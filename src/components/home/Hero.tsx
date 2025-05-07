import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Upload, X, AlertTriangle, Clock, FileVideo, FileAudio, Info, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranscription, getSummaryFromText, cleanupResources, checkServerStorageCapacity, storeProcessedResult } from '@/utils/videoProcessor';
import ProcessingResult from './ProcessingResult';
import TaskHistory from '../history/TaskHistory'; // Import the new TaskHistory component
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import FileUploader from './FileUploader';
import RequestMonitor from '@/utils/RequestMonitor';
import { PLAN_LIMITS } from '@/utils/planLimits'; // Add this import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

const Hero = () => {
  useEffect(() => {
    console.log("Hero component rendered");
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'subtitles' | 'transcription' | 'summary' | ''>('');
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false);
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedContent, setProcessedContent] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [transcriptionText, setTranscriptionText] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const { toast } = useToast();
  const { 
    setShowAuthModal, 
    isAuthenticated, 
    userPlan,
    hasReachedDailyLimit,
    incrementDailyUploadUsage,
    user
  } = useAuth();

  const getDailyLimitMessage = () => {
    if (!isAuthenticated || userPlan === 'free') {
      return "Upgrade to a Pro Plan to increase your daily file processing limit.";
    } else if (userPlan === 'pro') {
      return "Upgrade to a Business Plan to increase your daily file processing limit.";
    } else {
      return "Our servers are currently experiencing high traffic. Please try again later. We recommend checking back tomorrow. Thank you for your patience!";
    }
  };

  useEffect(() => {
    if (processingProgress >= 100 && !isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessingDialogOpen(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [processingProgress, isProcessing]);

  // Check server storage capacity
  const checkServerCapacity = async () => {
    try {
      // In a real implementation, this would be an API call to check server storage
      // For now, we'll use a mock implementation that randomly determines if server is busy
      const isBusy = Math.random() > 0.7; // 30% chance server is "busy"
      
      if (isBusy) {
        // Calculate a random queue position and wait time
        const position = Math.floor(Math.random() * 5) + 1;
        const waitTime = position * 2; // 2 minutes per position
        setQueuePosition(position);
        setEstimatedWaitTime(waitTime);
        setIsQueueDialogOpen(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking server capacity:", error);
      return true; // Proceed anyway if we can't check
    }
  };

  // Simulate queue processing
  const processQueue = () => {
    const interval = setInterval(() => {
      setQueuePosition(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsQueueDialogOpen(false);
          setIsFileUploaderOpen(true);
          return 0;
        }
        return prev - 1;
      });
      
      setEstimatedWaitTime(prev => {
        const newTime = prev - 2;
        return newTime > 0 ? newTime : 1;
      });
    }, 20000); // Update every 20 seconds
    
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isQueueDialogOpen && queuePosition > 0) {
      const stopQueueProcessing = processQueue();
      return stopQueueProcessing;
    }
  }, [isQueueDialogOpen, queuePosition]);

  const simulateProgress = (expectedDuration = 15) => {
    setProcessingProgress(0);
    
    // Calculate interval based on expected duration
    // Gradually slows down as it approaches 95%
    const totalSteps = 40;
    const intervalTime = (expectedDuration * 1000) / totalSteps;
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        // More realistic progress simulation with slowdown near the end
        if (prev < 50) {
          return prev + Math.random() * 5; // Faster at the beginning
        } else if (prev < 80) {
          return prev + Math.random() * 3; // Medium pace
        } else if (prev >= 95) {
          clearInterval(interval);
          return 95; // Hold at 95% until complete
        } else {
          return prev + Math.random() * 1; // Slow near the end
        }
      });
    }, intervalTime);
    
    return () => clearInterval(interval);
  };

  const cleanUpUploadedFile = () => {
    if (uploadedFile) {
      console.log(`Cleaning up file: ${uploadedFile.name}`);
      setUploadedFile(null);
      
      // Call the cleanup function to ensure resources are released
      cleanupResources();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanUpUploadedFile();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanUpUploadedFile(); // Clean up when component unmounts
    };
  }, [uploadedFile]);

  const handleProcess = async (type: 'subtitles' | 'transcription' | 'summary') => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload an audio or video file first",
        variant: "destructive",
      });
      return;
    }

    // Check if user can access the summary feature
    if (type === 'summary' && !PLAN_LIMITS[userPlan].allowSummary) {
      toast({
        title: "Feature Restricted",
        description: "The summary feature is only available for Pro and Business plans. Please upgrade to access this feature.",
        variant: "destructive",
      });
      setIsPremiumDialogOpen(true);
      return;
    }

    if (hasReachedDailyLimit('upload')) {
      toast({
        title: "Daily Limit Reached",
        description: getDailyLimitMessage(),
        variant: "destructive",
      });
      return;
    }

    const userId = user?.id || 'anonymous';
    const requestCheck = RequestMonitor.checkRequestAllowed(userId, 'upload');
    
    if (!requestCheck.allowed) {
      toast({
        title: "Request Limited",
        description: requestCheck.message,
        variant: "destructive",
      });
      return;
    }

    if (RequestMonitor.isUnusualPattern(userId)) {
      toast({
        title: "Unusual Activity Detected",
        description: "We've detected unusual patterns in your requests. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    incrementDailyUploadUsage();
    
    setIsProcessing(true);
    setProcessingType(type);
    setProcessedContent("");
    setProcessingError(null);
    
    // Show processing dialog for more intensive operations
    if (type === 'transcription' || type === 'summary') {
      setIsProcessingDialogOpen(true);
    }
    
    // Set different expected durations based on operation type
    const expectedDuration = type === 'summary' ? 30 : type === 'transcription' ? 20 : 10;
    const stopProgress = simulateProgress(expectedDuration);
    
    try {
      let content;
      
      try {
        console.log(`Processing ${type} for uploaded file: ${uploadedFile.name}, ${uploadedFile.type}`);
        
        if (type === 'transcription') {
          // Direct transcription
          content = await getTranscription(uploadedFile);
          setTranscriptionText(content); // Store for potential future use
          
          if (!content || content.length < 20) {
            throw new Error("Failed to get a meaningful transcription from the audio");
          }
        } else if (type === 'summary') {
          // For summary, first get transcription and then summarize
          let textToSummarize;
          
          // If we already have a transcription, use it
          if (transcriptionText && transcriptionText.length > 100) {
            textToSummarize = transcriptionText;
            console.log("Using existing transcription for summary");
          } else {
            // Otherwise get a new transcription
            console.log("Getting fresh transcription for summary");
            textToSummarize = await getTranscription(uploadedFile);
            setTranscriptionText(textToSummarize);
          }
          
          // Validate that we have text to summarize
          if (!textToSummarize || textToSummarize.length < 50) {
            throw new Error("Could not extract enough text for summarization");
          }
          
          console.log(`Summarizing transcription of ${textToSummarize.length} characters`);
          content = await getSummaryFromText(textToSummarize);
          
          // Validate summary quality
          if (!content || content.length < 50) {
            throw new Error("Generated summary is too short or empty");
          }
        } else if (type === 'subtitles') {
          // For subtitles, we need to get transcription first
          let subtitlesSource;
          
          if (transcriptionText && transcriptionText.length > 100) {
            subtitlesSource = transcriptionText;
            console.log("Using existing transcription for subtitles");
          } else {
            console.log("Getting fresh transcription for subtitles");
            subtitlesSource = await getTranscription(uploadedFile);
            setTranscriptionText(subtitlesSource);
          }
          
          if (!subtitlesSource || subtitlesSource.length < 20) {
            throw new Error("Could not extract enough text for subtitles");
          }
          
          // Generate SRT content from transcription
          const lines = subtitlesSource.split(/[.!?]+/);
          let srtContent = '';
          
          lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              const startTime = formatSRTTime(index * 5);
              const endTime = formatSRTTime((index + 1) * 5);
              
              srtContent += `${index + 1}\n`;
              srtContent += `${startTime} --> ${endTime}\n`;
              srtContent += `${trimmedLine}.\n\n`;
            }
          });
          
          content = srtContent;
          
          if (!content || content.length < 20) {
            throw new Error("Generated subtitles file is too short or empty");
          }
        }
        
        if (!content) {
          throw new Error(`Failed to process ${type} for the uploaded file`);
        }
      } catch (error) {
        console.error(`Error processing ${type}:`, error);
        throw new Error(`Error processing ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setProcessedContent(content);
      setProcessingProgress(100);
      
      toast({
        title: "Processing complete",
        description: `Successfully processed ${type} for your file`,
      });
    } catch (error) {
      console.error(`Processing error:`, error);
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      setProcessingType('');
      setProcessedContent(null);
      setProcessingError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsProcessing(false);
      stopProgress();
    }
  };

  const handleUploadClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (hasReachedDailyLimit('upload')) {
      toast({
        title: "Daily Upload Limit Reached",
        description: getDailyLimitMessage(),
        variant: "destructive",
      });
      return;
    }

    const userId = user?.id || 'anonymous';
    const requestCheck = RequestMonitor.checkRequestAllowed(userId, 'upload');
    
    if (!requestCheck.allowed) {
      toast({
        title: "Request Limited",
        description: requestCheck.message,
        variant: "destructive",
      });
      return;
    }

    // Check server capacity before opening the uploader
    const canProceed = await checkServerCapacity();
    if (canProceed) {
      setIsFileUploaderOpen(true);
    }
  };
  
  const handleFileProcessed = (file: File) => {
    setUploadedFile(file);
    setIsFileUploaderOpen(false);
    // Clear any previous transcription when a new file is uploaded
    setTranscriptionText(null);
    // Also clear any previous results
    setProcessedContent(null);
    setProcessingType('');
  };
  
  const clearResults = () => {
    setProcessedContent(null);
    setProcessingType('');
    setProcessingProgress(0);
    setProcessingError(null);
    // Don't clear transcription text here as it might be useful for generating a summary later
  };

  const getEstimatedTime = () => {
    if (processingType === 'transcription') {
      return "1 to 2 minutes";
    } else if (processingType === 'summary') {
      return "2 to 5 minutes";
    }
    return "a few minutes";
  };

  const getUpgradeMessage = () => {
    if (userPlan === 'free') {
      return "You have exceeded your 3 files/month limit for the Free plan. Please upgrade to Pro plan to process more files.";
    } else if (userPlan === 'pro') {
      return "You have exceeded your 15 files/month limit for the Pro plan. Please upgrade to Business plan for unlimited file processing.";
    } else {
      return "You have reached your processing limit. Please contact support.";
    }
  };

  const getNextPlan = () => {
    return userPlan === 'free' ? 'Pro' : 'Business';
  };

  const formatSRTTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  return (
    <section className="w-full pt-12 md:pt-24 lg:pt-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-blue-900 tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Upload Your Audio or Video<br />
              <span className="block">And Get Instant Subtitles, Transcripts & AI Summaries</span>
            </h1>
            <p className="mx-auto max-w-[700px] font-medium text-gray-600 md:text-xl dark:text-gray-400">
              Convert any uploaded MP4 or MP3 file into clean subtitles, full transcripts, or AI-powered summaries – instantly and privately, with no signup required.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-center gap-2">
              {!isAuthenticated && (
               <Button 
                 className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
                 onClick={() => setShowAuthModal(true)}
               >
                 Join Now
                 <Upload className="ml-2 h-4 w-4" />
               </Button>
              )}

              {/* Add the History button */}
              {isAuthenticated && (
                <TaskHistory />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Upload your MP4, MOV, MP3, WAV or M4A files and process up to 5 for free. No credit card needed.
            </p>
          </div>
          <div className="w-full max-w-4xl pt-8">
            <div className="relative overflow-hidden rounded-xl border bg-background shadow-xl p-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-pink-700 mb-4">All-in-One Audio & Video Processing Platform</span>
                
                <div className="flex flex-col items-center">
                  {uploadedFile ? (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4 w-full max-w-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileVideo className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium text-blue-700 truncate max-w-xs">
                            {uploadedFile.name}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setUploadedFile(null);
                            setTranscriptionText(null);
                          }}
                          className="text-blue-500 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-1xl font-bold text-blue-600 mt-2">
                         File ready for processing. <br />Choose an option below:<br />⬇️
                      </p>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setIsFileUploaderOpen(true)} 
                      className="mt-2 p-6 bg-red-50 border-2 border-[#ea384c] border-dashed rounded-lg cursor-pointer hover:bg-red-100 transition-colors w-full max-w-lg"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-16 w-16 text-[#ea384c] mb-4" />
                        <p className="text-2xl font-bold text-[#ea384c] text-center">
                          Upload Video or Audio
                        </p>
                        <p className="text-sm text-gray-600 text-center mt-2">
                          Supported formats: MP4, MOV, MP3, WAV, M4A
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {isProcessing && processingProgress < 100 && (
                    <div className="w-full max-w-lg mb-4 mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Processing {processingType}...</span>
                        <span>{Math.round(processingProgress)}%</span>
                      </div>
                      <Progress value={processingProgress} className="h-2" />
                    </div>
                  )}
                  
                  {processingError && (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg my-6 max-w-lg w-full">
                      <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-red-800 mb-2">Processing Error</h3>
                          <p className="text-red-700">
                            {processingError}. This could be due to an issue with file format or processing.
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button 
                              variant="outline" 
                              className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                              onClick={clearResults}
                            >
                              Try Another File
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {processedContent !== null && processingType && !processingError ? (
                    <ProcessingResult
                      type={processingType as 'subtitles' | 'transcription' | 'summary'}
                      content={processedContent}
                      onClose={clearResults}
                      isLoading={processedContent === ""}
                    />
                  ) : (
                    !processingError && (
                      <div className="flex flex-wrap justify-center gap-4 mb-6 mt-6">
                        <LoadingButton 
                          isLoading={isProcessing && processingType === 'subtitles'} 
                          loadingText="Generating Subtitles..."
                          onClick={() => handleProcess('subtitles')}
                          className="bg-indigo-600 hover:bg-indigo-700"
                          disabled={isProcessing || !uploadedFile}
                        >
                          <FileVideo className="mr-2 h-4 w-4" /> Generate Subtitles
                        </LoadingButton>
                        
                        <LoadingButton 
                          isLoading={isProcessing && processingType === 'transcription'} 
                          loadingText="Transcribing..."
                          onClick={() => handleProcess('transcription')}
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={isProcessing || !uploadedFile}
                        >
                          <FileAudio className="mr-2 h-4 w-4" /> Get Transcription
                        </LoadingButton>
                        
                        <LoadingButton 
                          isLoading={isProcessing && processingType === 'summary'} 
                          loadingText="Summarizing..."
                          onClick={() => handleProcess('summary')}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isProcessing || !uploadedFile}
                        >
                          <Info className="mr-2 h-4 w-4" /> Create Summary
                        </LoadingButton>
                      </div>
                    )
                  )}
                  
                  <div className="w-full bg-gray-50 p-4 rounded-lg mt-4">
                    <h3 className="text-sm font-medium mb-2">Powered by cutting-edge AI:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded mr-2">
                          <span className="text-blue-700 font-medium">Whisper</span>
                        </div>
                        <p>OpenAI's model for transcription - runs locally, no API key needed</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-1 rounded mr-2">
                          <span className="text-purple-700 font-medium">BART</span>
                        </div>
                        <p>Facebook's model for summarization - processes text locally</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-700">Local Processing</h3>
              <p className="text-sm text-gray-600">All processing happens in your browser - no data sent to servers</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700">Multiple File Formats</h3>
              <p className="text-sm text-gray-600">Supports MP4, MP3, WAV, MOV, M4A formats</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700">No API Key Required</h3>
              <p className="text-sm text-gray-600">Runs on open-source AI models with NO API Key</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPremiumDialogOpen} onOpenChange={setIsPremiumDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
            <DialogDescription>
              The summary feature is only available for Pro and Business plans. Upgrade now to access advanced AI-powered summarization and other premium features!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsPremiumDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.location.href = '/pricing'}>
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Processing in Progress
            </DialogTitle>
            <DialogDescription className="pt-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    Wait! Processing may take {getEstimatedTime()}, depending on the file length.
                  </p>
                  <p className="text-blue-700 mt-2 text-sm">
                    Longer files (20+ minutes) will take more time to process. Please keep this window open until processing completes.
                  </p>
                </div>
                
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Processing {processingType}...</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
                
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-800 text-sm">
                    Closing this window will not cancel the process, but you'll need to wait for it to complete when you return.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* New Queue Dialog */}
      <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-amber-500" />
              Processing Queue
            </DialogTitle>
            <DialogDescription className="pt-4">
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <p className="text-amber-800 font-medium">
                    Our servers are currently processing many requests.
                  </p>
                  <p className="text-amber-700 mt-2 text-sm">
                    You are currently in position {queuePosition} in the queue. Estimated wait time: {estimatedWaitTime} minute{estimatedWaitTime !== 1 ? 's' : ''}.
                  </p>
                </div>
                
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Queue progress</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (queuePosition * 20))} className="h-2" />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800 text-sm">
                    You can close this window and come back later. Your position in the queue will be saved.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQueueDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Manual override for demo purposes
                setIsQueueDialogOpen(false);
                setIsFileUploaderOpen(true);
              }}
            >
              Process Now Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFileUploaderOpen} onOpenChange={setIsFileUploaderOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <FileUploader 
            onFileProcessed={handleFileProcessed}
            onCancel={() => setIsFileUploaderOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
