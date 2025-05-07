
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Upload, X, AlertTriangle, FileVideo, FileAudio, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_LIMITS, formatFileSize, getUpgradeMessage } from '@/utils/planLimits';

interface FileUploaderProps {
  onFileProcessed: (file: File) => void;
  onCancel: () => void;
}

// Supported file formats
const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/webm']; // mp4, mov, webm
const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a']; // mp3, wav, m4a

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { 
    userPlan, 
    hasReachedMonthlyUploadLimit, 
    hasReachedDailyUploadLimit,
    incrementMonthlyUploadUsage,
    incrementDailyUploadUsage
  } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check monthly upload limit
    if (hasReachedMonthlyUploadLimit()) {
      const upgradeMessage = userPlan === 'free' ? 'Pro' : 'Business';
      toast({
        title: "Monthly limit reached",
        description: `You've reached the ${PLAN_LIMITS[userPlan].monthlyUploadLimit} uploads limit for your ${userPlan} plan. Upgrade to ${upgradeMessage} for more uploads.`,
        variant: "destructive",
      });
      return;
    }

    // Check daily upload limit
    if (hasReachedDailyUploadLimit()) {
      const upgradeMessage = userPlan === 'free' ? 'Pro' : 'Business';
      toast({
        title: "Daily limit reached",
        description: `You've reached the ${PLAN_LIMITS[userPlan].dailyUploadLimit} daily uploads limit for your ${userPlan} plan. Upgrade to ${upgradeMessage} for more daily uploads.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check supported formats
    const isVideo = SUPPORTED_VIDEO_FORMATS.includes(file.type);
    const isAudio = SUPPORTED_AUDIO_FORMATS.includes(file.type);
    
    if (!isVideo && !isAudio) {
      toast({
        title: "Unsupported file format",
        description: "Please upload an MP4, MOV, WebM, MP3, WAV, or M4A file",
        variant: "destructive",
      });
      return;
    }

    // Check file size based on type and plan
    const fileType = isVideo ? 'video' : 'audio';
    const maxSize = fileType === 'video' 
      ? PLAN_LIMITS[userPlan].maxVideoFileSize 
      : PLAN_LIMITS[userPlan].maxAudioFileSize;

    if (file.size > maxSize) {
      const fileSizeFormatted = formatFileSize(maxSize);
      const fileTypeLabel = fileType.charAt(0).toUpperCase() + fileType.slice(1);
      const upgradeMessage = getUpgradeMessage(userPlan, fileType);
      
      toast({
        title: "File too large",
        description: `${fileTypeLabel} files are limited to ${fileSizeFormatted} for ${userPlan} plan. ${upgradeMessage}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    // Simulate processing delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Increment usage counters
      incrementMonthlyUploadUsage();
      incrementDailyUploadUsage();
      
      // Process the file
      onFileProcessed(selectedFile);
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upload Video or Audio File</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Plan information */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Your {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan</h3>
              <p className="text-xs text-blue-700 mt-1">
                {userPlan === 'free' && (
                  'Free plan allows up to 5 files per month, 1 per day.'
                )}
                {userPlan === 'pro' && (
                  'Pro plan allows up to 50 files per month, 5 per day.'
                )}
                {userPlan === 'business' && (
                  'Business plan allows unlimited file processing.'
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* File drop area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg inline-block mx-auto">
                {selectedFile.type.startsWith('video/') ? (
                  <FileVideo className="h-12 w-12 text-indigo-500 mx-auto" />
                ) : (
                  <FileAudio className="h-12 w-12 text-purple-500 mx-auto" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              {isUploading ? (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="mr-2 h-4 w-4" /> Remove
                  </Button>
                  <LoadingButton 
                    onClick={handleUpload} 
                    isLoading={isUploading}
                    loadingText="Uploading..."
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </LoadingButton>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-700">Drag & drop your audio or video file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select file
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={[...SUPPORTED_VIDEO_FORMATS, ...SUPPORTED_AUDIO_FORMATS].join(',')}
              />
            </div>
          )}
        </div>
        
        {/* Info section with file size limits */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="text-sm font-medium mb-2">Supported formats:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-700">Video:</p>
              <p className="text-gray-500">MP4, MOV, WebM</p>
              <p className="text-gray-500 text-xs mt-1">
                Max size: {formatFileSize(PLAN_LIMITS[userPlan].maxVideoFileSize)}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Audio:</p>
              <p className="text-gray-500">MP3, WAV, M4A</p>
              <p className="text-gray-500 text-xs mt-1">
                Max size: {formatFileSize(PLAN_LIMITS[userPlan].maxAudioFileSize)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
            <p className="text-xs text-gray-600">
              {userPlan === 'free' && 'Free plan limited to 5 uploads per month, 1 per day.'}
              {userPlan === 'pro' && 'Pro plan limited to 50 uploads per month, 5 per day.'}
              {userPlan === 'business' && 'You have unlimited uploads with your Business plan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
