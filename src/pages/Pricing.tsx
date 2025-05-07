
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { CheckCircle2, HelpCircle, CreditCard, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLAN_LIMITS, formatFileSize } from '@/utils/planLimits';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Pricing | AIVideoSummary - AI-Powered Video Transcription & Summarization</title>
        <meta name="description" content="Choose the right plan for your needs. AIVideoSummary offers flexible pricing options for individuals, content creators, and businesses." />
        <meta name="keywords" content="AI pricing, video transcription pricing, video summarization pricing, affordable AI pricing" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Affordable Pricing for AI Video Transcription and Summarization Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include our core AI features.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                isAnnual ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 20%)
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                !isAnnual ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-6">For casual users and exploration</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/forever</span>
              </div>
              <Button className="w-full mb-6">Get Started</Button>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">5 files per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 file processing per day</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Video uploads up to {formatFileSize(PLAN_LIMITS.free.maxVideoFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Audio uploads up to {formatFileSize(PLAN_LIMITS.free.maxAudioFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic summarization</span>
                </li>
                <li className="flex items-start opacity-50">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500">No translation feature</span>
                </li>
                <li className="flex items-start opacity-50">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500">No history</span>
                </li>
                <li className="flex items-start opacity-50">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500">No content library</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-500 overflow-hidden transform md:-translate-y-4 relative">
            <div className="bg-indigo-500 text-white text-center py-2 text-sm font-medium">
              MOST POPULAR
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For content creators & professionals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${isAnnual ? '5.60' : '7'}</span>
                <span className="text-gray-500">/{isAnnual ? 'mo' : 'mo'}</span>
                {isAnnual && <span className="text-green-500 text-sm ml-2 font-medium">Save 20%</span>}
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mb-6">
                Get Started
              </Button>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">50 files per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">5 file processing per day</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Video uploads up to {formatFileSize(PLAN_LIMITS.pro.maxVideoFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Audio uploads up to {formatFileSize(PLAN_LIMITS.pro.maxAudioFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Detailed summarization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Translation support</span>
                </li>
                <li className="flex items-start opacity-50">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500">No history</span>
                </li>
                <li className="flex items-start opacity-50">
                  <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500">No content library</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Business Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For teams and organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${isAnnual ? '20' : '25'}</span>
                <span className="text-gray-500">/{isAnnual ? 'mo' : 'mo'}</span>
                {isAnnual && <span className="text-green-500 text-sm ml-2 font-medium">Save 20%</span>}
              </div>
              <Button className="w-full mb-6">Get Started</Button>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited files</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited daily processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Video uploads up to {formatFileSize(PLAN_LIMITS.business.maxVideoFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Audio uploads up to {formatFileSize(PLAN_LIMITS.business.maxAudioFileSize)}
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced summarization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Translation support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Content library access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">History management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Payment Methods Section */}
        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold mb-4">Accepted Payment Methods</h3>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm border">
              <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm border">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#0070BA" />
                <path d="M7.5 17h-3c-.3 0-.5-.2-.5-.5v-9c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v9c0 .3.2.5.5.5zm12-10h-3c-.3 0-.5.2-.5.5v9c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-9c0-.3-.2-.5-.5-.5zm-6 6h-3c-.3 0-.5.2-.5.5v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5zm0-6h-3c-.3 0-.5.2-.5.5v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5z" fill="white" />
              </svg>
              <span className="font-medium">PayPal</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">What happens when I reach my plan's limits?</h4>
              <p className="text-gray-700">When you reach your plan's limits, you'll see a notification prompting you to upgrade to continue using additional features. Free users can process up to 5 files per month and 1 per day, while Pro users get 50 per month and 5 per day.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Can I switch plans at any time?</h4>
              <p className="text-gray-700">Absolutely! You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new rate will apply at the next billing cycle.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">What file formats do you support?</h4>
              <p className="text-gray-700">We support common video formats (MP4, MOV, WebM) and audio formats (MP3, WAV, M4A). Each plan has different file size limits for both audio and video files.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-700">All transactions are final. We do not provide refunds, returns, or exchanges. Kindly review your purchase carefully before proceeding.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Do you offer discounts for education or non-profits?</h4>
              <p className="text-gray-700">We currently do not offer educational or non-profit discounts. Please contact our sales team for more information.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We offer custom enterprise solutions for large-scale needs. Contact our sales team to discuss your requirements.
          </p>
          <Button variant="outline" size="lg">Contact Sales</Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
