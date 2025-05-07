import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
         <title>Features of AIVideoSummary – Summarize Videos, Extract Subtitles, and Transcribe</title>
         <meta name="description" content="Discover all the powerful features of AIVideoSummary. Summarize videos, generate accurate subtitles, transcribe speech to text, and create concise summaries with AI." />
         <link rel="canonical" href="https://aivideosummary.com/features" />
      </Helmet>

      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful AI Tools for Video Content</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how AIVideoSummary helps you extract more value from video content with our suite of AI-powered tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" />
                <path d="M7 10L12 15L17 10" />
                <path d="M12 15V3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Video Transcription</h3>
            <p className="text-gray-600 mb-4">
              Convert speech to text with state-of-the-art accuracy. Our AI transcription service handles multiple languages and accents with precision.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">100+ languages supported</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Timestamps for each paragraph</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Speaker diarization (Premium)</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-purple-600">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Summarization</h3>
            <p className="text-gray-600 mb-4">
              Get concise summaries that capture the key points and insights from any video, saving you valuable time and effort.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Key points extraction</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Adjustable summary length</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Topic categorization</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
                <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
                <line x1="2" y1="20" x2="22" y2="20" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Subtitle Generator</h3>
            <p className="text-gray-600 mb-4">
              Extract precise subtitles for videos in multiple formats. Perfect for content creators, educators, and accessibility purposes.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">SRT, VTT, TXT formats</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Accurate time syncing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Translation to 50+ languages</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Multi-Platform Support</h3>
            <p className="text-gray-600 mb-4">
              Process videos from major platforms like YouTube, TikTok, Facebook, and Vimeo with a simple URL paste.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">YouTube integration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">TikTok video processing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Facebook and Vimeo support</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-amber-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-600">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
            <p className="text-gray-600 mb-4">
              All processing happens locally in your browser. No data is sent to our servers - your content remains private.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Browser-based processing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">No API keys required</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">GDPR compliant</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-rose-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-rose-600">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Time Saving</h3>
            <p className="text-gray-600 mb-4">
              Drastically reduce the time it takes to process video content. Get transcripts and summaries in seconds, not hours.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Fast processing times</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Batch processing (Premium)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Content archiving</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-xl p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to try AIVideoSummary?</h2>
            <p className="text-lg mb-8 text-white/90">
              Start extracting value from your videos today with our powerful AI tools. No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
