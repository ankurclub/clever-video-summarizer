
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Copy, Download, X, Languages, Check, AlertTriangle, Globe, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, translateText, storeProcessedResult } from '@/utils/videoProcessor';
import { useAuth } from '@/contexts/AuthContext';
import TaskHistory from '@/components/history/TaskHistory';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  detectLanguage, 
  getLanguageLabel, 
  languageOptions 
} from '@/utils/languageDetection';
import { PLAN_LIMITS } from '@/utils/planLimits';

interface ProcessingResultProps {
  type: 'subtitles' | 'transcription' | 'summary';
  content: string;
  onClose: () => void;
  isLoading: boolean;
}

const ProcessingResult: React.FC<ProcessingResultProps> = ({ type, content, onClose, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userPlan } = useAuth();
  
  const typeTitles = {
    subtitles: 'Subtitles',
    transcription: 'Transcription',
    summary: 'Summary'
  };

  // Detect the language when content changes
  useEffect(() => {
    if (content && !isLoading) {
      try {
        const detected = detectLanguage(content);
        setDetectedLanguage(detected);
        setCurrentLanguage(detected);
      } catch (error) {
        console.error("Error detecting language:", error);
      }
    }
  }, [content, isLoading]);
  
  // Store the processed result in history for Business plan users
  useEffect(() => {
    if (content && !isLoading && user) {
      storeProcessedResult(content, type, userPlan, user.id);
    }
  }, [content, isLoading, user, userPlan, type]);

  const handleCopy = () => {
    // Use the translated content if available, otherwise use the original content
    const contentToCopy = translatedContent !== null ? translatedContent : content;
    
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    // Use the translated content if available, otherwise use the original content
    const contentToDownload = translatedContent !== null ? translatedContent : content;
    
    // Include language info in the filename if it's translated
    let filename = `processed_${type}.txt`;
    if (translatedContent !== null && currentLanguage) {
      filename = `processed_${type}_${getLanguageLabel(currentLanguage).toLowerCase()}.txt`;
    }
    
    downloadTextFile(contentToDownload, filename);
    toast({
      title: "Download started",
      description: `Your ${type} file is being downloaded`,
    });
  };

  const toggleTranslationOptions = () => {
    setShowTranslationOptions(!showTranslationOptions);
  };

  const handleTranslationRequest = async (targetLanguage: string) => {
    if (targetLanguage === currentLanguage) return;
    
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      const textToTranslate = translatedContent || content;
      const translatedText = await translateText(textToTranslate, targetLanguage);
      setTranslatedContent(translatedText);
      setCurrentLanguage(targetLanguage);
      
      // Also store the translation in history for Business plan users
      if (user) {
        storeProcessedResult(translatedText, 'translation', userPlan, user.id);
      }
      
      toast({
        title: "Translation complete",
        description: `Successfully translated to ${getLanguageLabel(targetLanguage)}`,
      });
    } catch (error) {
      console.error("Translation error:", error);
      setTranslationError(error instanceof Error ? error.message : "Unknown translation error");
      toast({
        title: "Translation failed",
        description: error instanceof Error ? error.message : "Failed to translate content",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRestoreOriginal = () => {
    setTranslatedContent(null);
    setCurrentLanguage(detectedLanguage);
    toast({
      title: "Original content restored",
      description: "The content has been restored to its original language",
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {typeTitles[type]}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleCopy}
            disabled={isLoading}
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          
          {/* Convert/Translation Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <LoadingButton 
                variant="outline" 
                className="bg-white border-blue-200 text-gray-700 hover:bg-blue-50"
                disabled={isLoading || isTranslating}
                isLoading={isTranslating}
                loadingText="Converting..."
              >
                <Globe className="mr-2 h-4 w-4 text-blue-500" />
                <span>Convert</span>
                {detectedLanguage && !isTranslating && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    {getLanguageLabel(detectedLanguage)} detected
                  </Badge>
                )}
              </LoadingButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {languageOptions.map((language) => (
                <DropdownMenuItem 
                  key={language.value}
                  disabled={isTranslating || currentLanguage === language.value}
                  className={currentLanguage === language.value ? "bg-blue-50" : ""}
                  onClick={() => {
                    // Check if translation is allowed for user's plan
                    if (PLAN_LIMITS[userPlan].allowTranslation) {
                      handleTranslationRequest(language.value);
                    } else {
                      setIsPremiumDialogOpen(true);
                    }
                  }}
                >
                  {language.label}
                  {language.value === detectedLanguage && (
                    <span className="ml-2 text-blue-500 text-xs">✓ Detected</span>
                  )}
                  {currentLanguage === language.value && (
                    <span className="ml-2 text-blue-500 text-xs">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {translatedContent && (
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-gray-700 hover:bg-blue-50"
              onClick={handleRestoreOriginal}
            >
              <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />
              <span>Original</span>
            </Button>
          )}
          
          {user && (
            <TaskHistory />
          )}
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </div>
      </div>

      {translationError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{translationError}</p>
          </div>
        </div>
      )}

      {translatedContent !== null ? (
        <div className="whitespace-pre-wrap break-words bg-white p-4 rounded-md border border-gray-200">
          {translatedContent}
        </div>
      ) : (
        <div className="whitespace-pre-wrap break-words bg-white p-4 rounded-md border border-gray-200">
          {content}
        </div>
      )}
    </div>
  );
};

export default ProcessingResult;
