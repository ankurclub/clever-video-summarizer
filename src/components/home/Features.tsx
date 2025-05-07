import React from 'react';
import { Globe, Cpu, Zap, Smile, CreditCard, Shield, FileText, Terminal } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Free OpenAI Whisper Integration",
      description: "We use Whisper base model for transcription with no API key required, no usage limits, and support for multiple languages.",
      icon: <Globe className="h-10 w-10 text-primary" />,
      techDetail: "Whisper is an automatic speech recognition system trained on 680,000 hours of multilingual data."
    },
    {
      title: "Local Processing Power",
      description: "Our system runs Facebook BART locally for summarization with no API key or usage limits, ensuring your data stays private.",
      icon: <Cpu className="h-10 w-10 text-primary" />,
      techDetail: "BART is a transformer encoder-decoder model pre-trained by corrupting text with noise."
    },
    {
      title: "Lightning Fast Processing",
      description: "Get results quickly with our optimized processing pipeline, designed for speed without sacrificing accuracy.",
      icon: <Zap className="h-10 w-10 text-primary" />,
      techDetail: "Our chunk-based processing ensures even long videos can be processed efficiently."
    },
    {
      title: "User-Friendly Interface",
      description: "Our intuitive design makes it easy to extract what you need from any video with just a few clicks.",
      icon: <Smile className="h-10 w-10 text-primary" />,
      techDetail: "Built with React and modern web technologies for a responsive experience."
    },
    {
      title: "Most Affordable Pricing",
      description: "We offer the most competitive pricing in the market with a generous free tier and affordable premium options.",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      techDetail: "Process up to 5 videos for free, with no feature limitations on the free tier."
    },
    {
      title: "Advanced Data Security",
      description: "All processing happens locally in your browser. We don't store your videos or transcripts on our servers.",
      icon: <Shield className="h-10 w-10 text-primary" />,
      techDetail: "Client-side processing means your sensitive data never leaves your device."
    },
  ];

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter">
            Explore AIVideoSummary Features – Summarize, Transcribe, and Subtitle Any Video
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg mt-4">
            Summarize YouTube videos, extract subtitles, transcribe audio to text, and generate AI-powered summaries — all in one easy-to-use platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 mb-4 flex-grow">{feature.description}</p>
              <div className="mt-auto">
                <div className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Terminal className="h-3 w-3 text-primary mr-1" />
                    <span className="font-medium">Tech Detail</span>
                  </div>
                  <p className="text-gray-600">{feature.techDetail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">How Our Technology Works</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Video Processing</h4>
                    <p className="text-sm text-gray-600">We extract audio from the video and generate SRT subtitles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                    <Cpu className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">AI Transcription</h4>
                    <p className="text-sm text-gray-600">Speech is converted to text using Whisper with 99% accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Text Summarization</h4>
                    <p className="text-sm text-gray-600">Clean text is processed by BART to create concise summaries.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 border border-indigo-100 bg-white rounded-lg p-4 text-sm">
              <div className="font-mono text-xs text-gray-700 overflow-auto max-h-48">
                <p className="mb-2"><span className="text-purple-600">import</span> <span className="text-blue-600">whisper</span></p>
                <p className="mb-2"><span className="text-purple-600">import</span> <span className="text-blue-600">transformers</span></p>
                <br />
                <p className="mb-2"><span className="text-green-600"># Load Whisper for transcription</span></p>
                <p className="mb-2">model = whisper.load_model(<span className="text-orange-600">"base"</span>)</p>
                <p className="mb-2">result = model.transcribe(<span className="text-orange-600">"audio.mp3"</span>)</p>
                <br />
                <p className="mb-2"><span className="text-green-600"># Load BART for summarization</span></p>
                <p className="mb-2">summarizer = pipeline(<span className="text-orange-600">"summarization"</span>, model=<span className="text-orange-600">"facebook/bart-large-cnn"</span>)</p>
                <p className="mb-2">summary = summarizer(text, max_length=<span className="text-blue-600">150</span>)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;