
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What video platforms are supported?",
      answer: "AIVideoSummary currently supports video summarization, transcription, and subtitle extraction from YouTube, Facebook, TikTok, and Vimeo. You can also directly upload video files from your device in formats like MP4, MOV, and AVI. We are continuously expanding platform support to include more services like Instagram Reels and LinkedIn videos to make video content processing even more accessible."
    },
    {
      question: "How accurate is the transcription?",
      answer: "Our transcription service is powered by OpenAI's Whisper model, one of the most advanced AI models for automatic speech recognition (ASR). It offers high accuracy across 100+ languages, dialects, and accents. Even with moderate background noise, you can expect over 90% transcription accuracy. Clean audio recordings with minimal noise can achieve near-human transcription quality, making it ideal for summarizing educational videos, webinars, interviews, and podcasts."
    },
    {
      question: "Is there a limit to the video length I can process?",
      answer: "With the free plan on AIVideoSummary, you can process videos up to 10 minutes long, perfect for short educational clips, TikTok videos, or quick tutorials. If you need to summarize longer videos like webinars, online courses, or podcasts, our affordable premium plans allow processing videos up to 60 minutes or more, ensuring flexibility for professional and personal needs."
    },
    {
      question: "How many videos can I process with the free plan?",
      answer: "Our generous free plan allows users to process up to 5 videos per month with a limitation of 1 video per day, including summarization, subtitle extraction, and AI transcription. Premium plans lift these restrictions, offering higher limits or unlimited processing, depending on the plan tier. Whether you're a student needing video summaries or a business user transcribing long meetings, we have flexible options to suit your workflow."
    },
    {
      question: "How is my data handled?",
      answer: "At AIVideoSummary, we prioritize data privacy and security. All processing, including video summarization, subtitle generation, and transcription, happens locally in your browser whenever possible. We do not store your uploaded videos or the generated transcriptions on our servers unless you explicitly choose to save them to your account for future access. Our platform is built to comply with data protection best practices, ensuring full confidentiality of your video content."
    },
    {
      question: "Do you offer browser extensions?",
      answer: "Yes, AIVideoSummary offers official browser extensions for Chrome Browser that allow you to summarize videos, extract subtitles, and generate transcriptions directly while browsing. Whether you're watching YouTube lectures, Facebook Live videos, or TikTok reels, you can instantly access AI-powered summarization tools with just one click. Visit our 'Get Extension' page to download and install the latest version for your browser."
    }
  ];

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg mt-4">
            Find answers to common questions about our services
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
