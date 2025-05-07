
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TaskHistory from '@/components/history/TaskHistory';

const CallToAction = () => {
  const { setShowAuthModal, user, userPlan, isAuthenticated } = useAuth();
  
  const handleJoinNowClick = () => {
    setShowAuthModal(true);
  };

  return (
    <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Summarize Videos, Extract Subtitles & Generate Transcripts Instantly
            </h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
              Save hours by using our AI video summarizer — instantly create subtitles, transcripts, and concise video summaries without technical skills!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 text-left">
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-white bg-green-500 rounded-full p-0.5 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Advanced AI models run locally in your browser</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-white bg-green-500 rounded-full p-0.5 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Process up to 5 videos for free with no credit card</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-white bg-green-500 rounded-full p-0.5 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Support for YouTube, TikTok, Facebook, and more</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {!isAuthenticated ? (
              <>
                <Button className="bg-white text-primary hover:bg-white/90 font-medium px-8" onClick={handleJoinNowClick}>
                  Join Now
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-primary-foreground/10">
                  View Pricing Plans <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-white text-primary hover:bg-white/90 font-medium px-8">
                  Start Processing
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-primary-foreground/10">
                  View Pricing Plans <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                {userPlan === 'business' && (
                  <TaskHistory />
                )}
              </>
            )}
          </div>
          
          <div className="pt-4">
            {!isAuthenticated ? (
              <p className="text-sm text-primary-foreground/80">
                Already have an account? <a href="#" className="underline font-medium" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>Log in</a>
              </p>
            ) : (
              <p className="text-sm text-primary-foreground/80">
                You're logged in as a {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} user
              </p>
            )}
          </div>
          
          <div className="mt-8 text-sm text-primary-foreground/70 max-w-2xl">
            <p>Our AI models (OpenAI Whisper for transcription and Facebook BART for summarization) run directly in your browser. No data is sent to our servers, ensuring complete privacy. The models work offline once loaded.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
