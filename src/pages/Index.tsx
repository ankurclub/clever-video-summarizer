
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServiceCards from '@/components/home/ServiceCards';
import FAQ from '@/components/home/FAQ';
import CallToAction from '@/components/home/CallToAction';
import SeoArticle from '@/components/home/SeoArticle';

const Index = () => {
  useEffect(() => {
    console.log("Index page rendered");
    document.body.style.overflow = "auto"; // Ensure content is scrollable
    document.body.style.height = "auto"; // Set height to auto to show all content
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Upload Video for Transcription – Free Subtitle Generator & AI Summarizer</title>
        <meta name="description" content="Upload MP4, MP3, WAV files to auto-generate subtitles, transcribe audio, and create AI summaries. Convert any media file to text with no signup required!" />
        <meta name="keywords" content="upload video for transcription, convert mp4 to subtitles, ai audio transcription from file, auto-generate subtitles from video file, summarize audio file online, upload to get transcript, free video summarizer from file, subtitle generator for mp4 upload" />
        <link rel="canonical" href="https://aivideosummary.com/" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Upload Video for Transcription – Free Subtitle Generator & AI Summarizer" />
        <meta property="og:description" content="Convert any uploaded MP4, MP3, or WAV file into accurate subtitles, full transcripts, or AI summaries. Fast, private processing with no signup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aivideosummary.com/" />
        <meta property="og:image" content="https://aivideosummary.com/og-image.png" />
        <meta property="og:image:alt" content="AI Video Processing Tool - Upload files for subtitles and transcription" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aivideosummary" />
        <meta name="twitter:title" content="Upload Video for Transcription – Generate Subtitles & Summaries" />
        <meta name="twitter:description" content="Convert MP4 to subtitles, transcribe audio files, and summarize video content by uploading your files to our AI-powered processing tool." />
        <meta name="twitter:image" content="https://aivideosummary.com/og-image.png" />
      </Helmet>

      <div className="pt-4">
        <Hero />
        <ServiceCards />
        <SeoArticle />
        <Features />
        <FAQ />
        <CallToAction />
      </div>
    </div>
  );
};

export default Index;
