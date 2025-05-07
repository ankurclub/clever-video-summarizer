import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "All fields are required.",
        description: "Please fill out all fields before submitting."
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible."
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleLiveChat = () => {
    toast({
      title: "Live chat unavailable",
      description: "No live chat is available right now. Please leave us a message."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Contact Us | AIVideoSummary</title>
        <meta name="description" content="Get in touch with the AIVideoSummary team. We're here to help with any questions or concerns." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you. Our team is ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your message..."
                    ></textarea>
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">contact@aivideosummary.com</p>
                      <p className="text-gray-600">sales@aivideosummary.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+91 9816937512</p>
                      <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Office</h3>
                      <p className="text-gray-600">
                        Unit: D-57, Dayanand Vihar,<br />
                        Preet Colony, Delhi<br />
                        Pin Code: 110092, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-xl shadow-md p-8 text-white">
                <h2 className="text-2xl font-semibold mb-6">Quick Support</h2>
                <p className="mb-6">
                  Need immediate assistance? Our support team is available 24/7 through our live chat.
                </p>
                <Button variant="secondary" className="w-full" onClick={handleLiveChat}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
              </div>

              {/* Follow Us section remains unchanged */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
