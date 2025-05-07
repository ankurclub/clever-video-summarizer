
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "./hooks/use-theme";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/blog/BlogPost";
import FAQ from "./pages/FAQ";
import { AuthProvider } from "./contexts/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import { useState, useEffect } from "react";
import ErrorAlert from "./components/ui/error-alert";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // Using meta for error handling as onError is not directly available
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          // Global error handling for React Query errors
        }
      }
    },
  },
});

const App = () => {
  console.log("App component rendering");
  const [error, setError] = useState<string | null>(null);
  
  // Set up global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.message || 'An unexpected error occurred');
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    
    // Clean up
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#4f46e5" />
              <link rel="icon" href="/favicon.ico" />
            </Helmet>
            <Toaster />
            <Sonner />
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow mt-16"> {/* Added mt-16 to account for fixed navbar */}
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <AuthModal />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
