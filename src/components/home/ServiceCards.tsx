
import React from 'react';
import { FileText, Headphones, FileVideo, Code, Download, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServiceCards = () => {
  const services = [
    {
      title: "Subtitles from File Upload",
      description: "Generate SRT, VTT, and TXT subtitles from your uploaded audio/video file. Multi-language support included.",
      icon: FileText,
      details: ["Multiple export formats", "Auto-generate timestamps", "Direct download option"]
    },
    {
      title: "Audio & Video Transcription",
      description: "Turn speech into clean text transcripts using OpenAI Whisper. Works on all MP4, MP3, M4A formats.",
      icon: Headphones,
      details: ["Powered by OpenAI Whisper", "Runs locally - no data sent to servers", "Support for multiple languages"]
    },
    {
      title: "AI Summary from Upload",
      description: "Upload a file and get a clear, bullet-point summary using Facebook's BART model. Quickly understand key points without watching the entire video.",
      icon: FileVideo,
      details: ["Uses Facebook BART locally", "Creates concise bullet points", "Adjustable summary length"]
    },
  ];

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter">
            Upload Your Audio & Video Files for Instant Subtitles, Transcripts & AI Summaries
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg mt-4">
            Easily convert your MP4, MP3, and other audio/video files into subtitles, generate transcripts, and create AI-powered summaries – all with no signup needed!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg border-t-4 border-t-primary">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">{service.description}</CardDescription>
                <div className="space-y-2">
                  {service.details.map((detail, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-center">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Code className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium">File Processing Pipeline</h4>
                  <p className="text-sm text-gray-600">No links needed - all processing is based on directly uploaded files for maximum reliability.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Download className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium">Local File Processing</h4>
                  <p className="text-sm text-gray-600">Files are processed locally without server uploads for maximum privacy and security.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium">Facebook BART Summarization</h4>
                  <p className="text-sm text-gray-600">Text is processed in chunks using the BART large-CNN model to generate accurate summaries.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium">Multi-Format Support</h4>
                  <p className="text-sm text-gray-600">MP3, MP4, M4A, WAV, and MOV formats supported for maximum compatibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
