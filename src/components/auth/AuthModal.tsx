
import React, { useState } from 'react';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  signUpWithEmail,
  loginWithEmail,
} from "@/lib/firebase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login, isAuthRequired, loginWithCredentials } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'standard' | 'demo'>('standard');

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      let result;

      if (provider === "Google") result = await signInWithGoogle();
      else if (provider === "Facebook") result = await signInWithFacebook();
      else if (provider === "Twitter") result = await signInWithTwitter();
      else throw new Error("Unsupported provider");

      if (result.success && result.user) {
        const user = result.user;

        login(provider.toLowerCase(), {
          email: user.email || '',
          name: user.displayName || '',
          avatar: user.photoURL || ''
        });

        toast({
          title: `${provider} Login Success`,
          description: `Welcome, ${user.displayName || user.email}`,
        });

        setShowAuthModal(false);
      } else {
        console.error(`${provider} login failed:`, result.error);
        throw result.error || new Error(`${provider} sign-in failed`);
      }
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      
      let errorMessage = "Something went wrong during sign-in.";
      if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Firebase API key is invalid. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = isSignUp
        ? await signUpWithEmail(email, password)
        : await loginWithEmail(email, password);

      if (result.success && result.user) {
        login('email', {
          email: result.user.email || '',
          name: result.user.displayName || '',
        });

        toast({
          title: isSignUp ? "Sign Up Successful!" : "Login Successful!",
          description: `Welcome, ${result.user.email}`,
        });

        setShowAuthModal(false);
      } else {
        throw result.error;
      }
    } catch (error: any) {
      let errorMessage = "Unable to authenticate user.";
      
      if (error.code === "auth/api-key-not-valid") {
        errorMessage = "Firebase API key is invalid. Please check your configuration.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'pro' | 'business') => {
    setIsLoading(true);
    try {
      const demoEmail = type === 'pro' ? 'prodemo@example.com' : 'businessdemo@example.com';
      const demoPassword = type === 'pro' ? 'demo@123' : 'business@123';
      
      const success = loginWithCredentials(demoEmail, demoPassword);
      
      if (success) {
        toast({
          title: `Demo ${type.toUpperCase()} Login Success`,
          description: `Welcome to the ${type} account demo`,
        });
      } else {
        throw new Error("Demo login failed");
      }
    } catch (error: any) {
      toast({
        title: "Demo Login Failed",
        description: error.message || "Something went wrong with the demo login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isAuthRequired ? 'Authentication Required' : (isSignUp ? 'Create an account' : 'Login to your account')}</DialogTitle>
          <DialogDescription>
            {isAuthRequired
              ? 'You need to be signed in to access premium features.'
              : (isSignUp ? 'Sign up using your social accounts or email' : 'Sign in using your social accounts or email')}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          defaultValue="standard" 
          className="w-full" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'standard' | 'demo')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="standard">Standard Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialLogin('Google')} disabled={isLoading}>
                Continue with Google
              </Button>
              <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialLogin('Facebook')} disabled={isLoading}>
                Continue with Facebook
              </Button>
              <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialLogin('Twitter')} disabled={isLoading}>
                Continue with Twitter
              </Button>
            </div>

            <div className="flex items-center pt-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="mt-4 space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />

              <LoadingButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText={isSignUp ? "Signing Up..." : "Logging In..."}
              >
                {isSignUp ? "Sign Up with Email" : "Continue with Email"}
              </LoadingButton>
            </form>

            <div className="mt-4 text-center text-sm">
              {isSignUp ? (
                <p>
                  Already have an account?{" "}
                  <button className="text-primary underline font-medium" onClick={() => setIsSignUp(false)} type="button">
                    Log in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <button className="text-primary underline font-medium" onClick={() => setIsSignUp(true)} type="button">
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
              <h3 className="text-sm font-semibold mb-2">Demo Accounts</h3>
              <p className="text-xs text-amber-700 mb-3">
                These are pre-configured demo accounts for testing premium features without needing to register.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-xs font-semibold">Pro Account:</p>
                  <p className="text-xs">Email: prodemo@example.com</p>
                  <p className="text-xs">Password: demo@123</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full mt-2 h-8 text-xs"
                    onClick={() => handleDemoLogin('pro')}
                    disabled={isLoading}
                  >
                    Login as Pro
                  </Button>
                </div>
                
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-xs font-semibold">Business Account:</p>
                  <p className="text-xs">Email: businessdemo@example.com</p>
                  <p className="text-xs">Password: business@123</p>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 h-8 text-xs" 
                    onClick={() => handleDemoLogin('business')}
                    disabled={isLoading}
                  >
                    Login as Business
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-amber-700 mt-3">
                Note: These accounts do not use Firebase authentication and are for demonstration purposes only.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
