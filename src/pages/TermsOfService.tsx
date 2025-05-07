import React from 'react';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Terms of Service | AIVideoSummary</title>
        <meta name="description" content="Read the AIVideoSummary Terms of Service agreement to understand the rules and guidelines for using our platform and Chrome extension." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p><strong>Last Updated:</strong> April 27, 2025</p><br/>

            <h2><strong>1. Introduction</strong></h2>
            <p>
              Welcome to AI Video Summary. By accessing or using our website, services, or Chrome extension, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p><br/>

            <h2><strong>2. Services Provided</strong></h2>
            <p>AI Video Summary offers:</p>
            <ul>
              <li>Subtitle extraction from YouTube, TikTok, Facebook, Vimeo videos.</li>
              <li>AI-powered video transcription services.</li>
              <li>AI-powered video summarization services.</li>
              <li>Chrome Extension to summarize or transcribe videos directly from supported platforms.</li>
            </ul>
            <p>Our AI tools provide fast and automated results based on the content you submit.</p><br/>

            <h2><strong>3. User Responsibilities</strong></h2>
            <p>By using our services, you agree that:</p>
            <ul>
              <li>You will only submit publicly accessible videos or content you have permission to process.</li>
              <li>You will not use our services for any unlawful activities, including copyright infringement.</li>
              <li>You will not misuse or attempt to hack, overload, or reverse-engineer our systems.</li>
              <li>You are fully responsible for the content you process through our platform.</li>
            </ul><br/>

            <h2><strong>4. Content Ownership</strong></h2>
            <p>
              We do not claim any ownership over the original videos, subtitles, transcriptions, or summaries generated through your use of our services. All intellectual property rights remain with their respective owners.
            </p>
            <p>We only temporarily process and generate outputs based on your requests.</p><br/>

            <h2><strong>5. AI Limitations</strong></h2>
            <p>Our AI models strive for high accuracy, but:</p>
            <ul>
              <li>Subtitles, transcriptions, and summaries are generated automatically without manual verification.</li>
              <li>Errors, inaccuracies, or omissions may occur due to factors like audio quality, accents, background noise, or platform limitations.</li>
              <li>You acknowledge and accept the risk that some results may not be perfect.</li>
            </ul><br/>

            <h2><strong>6. Paid Plans and Billing</strong></h2>
            <p>
              Some features, such as extended summarization or transcription limits, may require a paid subscription. Details about pricing, plans, and billing cycles are available on our Pricing page.
            </p>
            <p>
              By purchasing a plan, you agree to the payment terms described at checkout.
            </p><br/>

            <h2><strong>7. Privacy and Data</strong></h2>
            <p>We respect your privacy.</p>
            <ul>
              <li>We temporarily process video URLs or uploaded files solely for the purpose of generating your requested output.</li>
              <li>We do not permanently store or share your data unless required by law.</li>
            </ul>
            <p>For more details, please refer to our Privacy Policy.</p><br/>

            <h2><strong>8. Termination</strong></h2>
            <p>We reserve the right to suspend or terminate your access to our services if:</p>
            <ul>
              <li>You violate these Terms of Service.</li>
              <li>You engage in abuse, fraud, or illegal activities.</li>
            </ul>
            <p>We also reserve the right to discontinue any part of the service at any time.</p><br/>

            <h2><strong>9. Disclaimers</strong></h2>
            <p>Our services are provided "as is" without warranties of any kind, express or implied. We are not liable for any damages arising from:</p>
            <ul>
              <li>Inaccurate results</li>
              <li>Service interruptions</li>
              <li>Loss of data or content</li>
            </ul>
            <p>Use of our services is at your own risk.</p><br/>

            <h2><strong>10. Changes to Terms</strong></h2>
            <p>
              We may update these Terms of Service from time to time. We will notify you of any major changes, but it is your responsibility to review the latest version.
            </p>
            <p>
              Continued use of our services after changes means you accept the new terms.
            </p><br/>

            <h2><strong>11. Contact Information</strong></h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              <strong>Email:</strong> contact@aivideosummary.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
