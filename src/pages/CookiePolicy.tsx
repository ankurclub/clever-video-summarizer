import React from 'react';
import { Helmet } from 'react-helmet';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Cookie Policy | AIVideoSummary</title>
        <meta name="description" content="Learn about how AIVideoSummary uses cookies and similar technologies to improve your experience and ensure smooth operation." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p><strong>Last Updated:</strong> April 27, 2025</p><br/>

            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files placed on your device to collect standard Internet log information and visitor behavior information. When you visit our website or use our Chrome extension, we may collect information from you automatically through cookies or similar technologies.
            </p><br/>

            <h2>2. How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Ensure the secure and efficient operation of our services</li>
              <li>Understand how you interact with our content</li>
              <li>Remember your preferences and settings</li>
              <li>Personalize your user experience</li>
              <li>Analyze traffic and usage trends for service improvement</li>
            </ul><br/>

            <h2>3. Types of Cookies We Use</h2>
            <h3>3.1 Essential Cookies</h3>
            <p>Necessary for you to browse our website and use its features, such as accessing secure areas.</p><br/>

            <h3>3.2 Functional Cookies</h3>
            <p>Remember your preferences and previous choices to provide personalized features.</p><br/>

            <h3>3.3 Performance and Analytics Cookies</h3>
            <p>Help us understand how visitors interact with the website by collecting information anonymously.</p><br/>

            <h3>3.4 Targeting and Advertising Cookies</h3>
            <p>Collect information about your browsing habits to make advertising relevant to you and your interests.</p><br/>

            <h2>4. Third-Party Cookies</h2>
            <p>We may allow trusted third-party services to set cookies on your device. These may include:</p><br/>
            <ul>
              <li>Google Analytics - Site analytics and usage monitoring</li>
              <li>Stripe - Payment processing security</li>
              <li>Intercom - Live chat and customer support interactions</li>
              <li>Cloudflare - Performance and security optimization</li>
            </ul><br/>

            <h2>5. Managing Cookies</h2>
            <p>You can control and/or delete cookies as you wish. You can:</p>
            <ul>
              <li>Delete all cookies that are already on your computer</li>
              <li>Prevent cookies from being set by adjusting your browser settings</li>
              <li>Opt-out of certain third-party cookies for advertising purposes</li>
            </ul><br/>

            <h3>5.1 How to Delete or Manage Cookies</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul><br/>

            <h2>6. Consequences of Disabling Cookies</h2>
            <p>If you choose to block cookies, you may experience:</p>
            <ul>
              <li>Loss of personalized content and settings</li>
              <li>Limited functionality in some areas of the website</li>
              <li>Issues logging into accounts or completing secure transactions</li>
            </ul><br/>

            <h2>7. Updates to This Cookie Policy</h2>
            <p>
              We may revise this Cookie Policy to reflect changes in the law or our data practices. When we make updates, we will change the "Last Updated" date and notify users when necessary.
            </p><br/>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us:</p>
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

export default CookiePolicy;
