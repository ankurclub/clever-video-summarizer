
import React from 'react';
import { Helmet } from 'react-helmet';
import FAQ from '@/components/home/FAQ';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Frequently Asked Questions | AIVideoSummary</title>
        <meta name="description" content="Find answers to commonly asked questions about AIVideoSummary's features, pricing, and services." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h1>
        <FAQ />
      </div>
    </div>
  );
};

export default FAQPage;
