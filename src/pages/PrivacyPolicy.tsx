import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Privacy Policy | AIVideoSummary</title>
        <meta name="description" content="Learn how AIVideoSummary handles your data, protects your privacy, and ensures secure processing of your video summaries and transcriptions." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p><strong>Last Updated:</strong> April 27, 2025</p><br/>

            <h2><strong>1. Introduction</strong></h2>
            <p>
              At AIVideoSummary ("we", "us", or "our"), we are deeply committed to protecting your personal information and ensuring transparency about how we handle your data.
            </p><br/>

            <h2><strong>2. Information We Collect</strong></h2>
            <h3><i>2.1 Personal Information</i></h3>
            <p>When you create an account, subscribe, or interact with our services, we may collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Account credentials (username, password)</li>
              <li>Billing and payment details for subscriptions</li>
              <li>Communication preferences</li>
            </ul><br/>

            <h3><i>2.2 Video and Audio Data</i></h3>
            <p>When using our summarization and transcription tools:</p>
            <ul>
              <li>We temporarily process the video URL you submit but do not permanently store video content.</li>
              <li>Uploaded video or audio files (for premium users) are deleted immediately after processing.</li>
              <li>Summaries, transcriptions, and subtitles are generated and available for you to download or view, without us retaining the originals.</li>
            </ul><br/>

            <h3><i>2.3 Usage Data</i></h3>
            <p>We automatically collect certain information when you access our website or extension:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent</li>
              <li>Referring site information</li>
            </ul><br/>

            <h2><strong>3. How We Use Your Information</strong></h2>
            <ul>
              <li>To provide, maintain, and improve our services</li>
              <li>To personalize your user experience</li>
              <li>To communicate important updates or promotional offers</li>
              <li>To comply with legal obligations</li>
              <li>To analyze website and extension usage for better performance</li>
            </ul><br/>

            <h2><strong>4. Data Security</strong></h2>
            <p>We implement strong security measures, including:</p>
            <ul>
              <li>Secure HTTPS encryption for all data transmissions</li>
              <li>Server-side encryption of sensitive data</li>
              <li>Limited access to your personal data internally</li>
              <li>Regular security updates and audits</li>
            </ul>
            <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p><br/>

            <h2><strong>5. Data Retention</strong></h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which we collected it, including for satisfying any legal, accounting, or reporting requirements. Uploaded media files are deleted after processing.
            </p><br/>

            <h2><strong>6. Third-Party Sharing</strong></h2>
            <p>We do not sell or rent your personal information. We may share information with:</p>
            <ul>
              <li>Payment processors for subscription billing</li>
              <li>Cloud hosting services used to temporarily process videos</li>
              <li>Government authorities if legally required</li>
            </ul><br/>

            <h2><strong>7. Cookies and Tracking Technologies</strong></h2>
            <p>
              We use cookies to improve your browsing experience. You may choose to disable cookies through your browser settings, but this may impact your ability to use some features.
            </p><br/>

            <h2><strong>8. Your Rights</strong></h2>
            <p>You have rights over your personal data, including:</p>
            <ul>
              <li>The right to access, update, or delete your information</li>
              <li>The right to object to certain types of processing</li>
              <li>The right to withdraw consent at any time</li>
              <li>The right to data portability</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@aivideosummary.com.</p><br/>

            <h2><strong>9. Children's Privacy</strong></h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal information from minors. If we learn that a child has provided us with personal data, we will delete it immediately.
            </p><br/>

            <h2><strong>10. Changes to This Privacy Policy</strong></h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices. We encourage you to review this page regularly. Changes are effective upon posting.
            </p><br/>

            <h2><strong>11. Contact Us</strong></h2>
            <p>If you have any questions regarding our Privacy Policy, please contact us at:</p>
            <p>
              <strong>Email:</strong> privacy@aivideosummary.com<br />
              <strong>Address:</strong> Unit: D-57, Dayanand Vihar, Preet Colony, Delhi, Pin Code: 110092
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
