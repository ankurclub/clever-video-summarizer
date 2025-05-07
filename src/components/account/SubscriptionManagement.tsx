
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Check, AlertTriangle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingButton } from '@/components/ui/loading-button';

const SubscriptionManagement = () => {
  const { userPlan, user, cancelSubscription } = useAuth();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const planDetails = {
    free: { name: 'Free Plan', price: '$0/month' },
    pro: { 
      name: 'Pro Plan', 
      price: '$9.99/month',
      features: [
        'Process up to 30 videos/month',
        'Videos up to 60 minutes',
        'Daily limit of 3 videos',
        'Upload files up to 50MB',
      ]
    },
    business: { 
      name: 'Business Plan', 
      price: '$29.99/month',
      features: [
        'Unlimited videos',
        'Videos up to 4 hours',
        'No daily limits',
        'Upload files up to 300MB',
      ]
    }
  };

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      setIsConfirmOpen(false);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You'll be downgraded to the Free plan at the end of your current billing period.",
        variant: "default",
      });
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      toast({
        title: "Cancellation Error",
        description: "There was a problem cancelling your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const isPaidPlan = userPlan === 'pro' || userPlan === 'business';

  return (
    <>
      {isPaidPlan && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>Manage your current subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Cancellation Policy</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    You can cancel your subscription anytime. After cancellation, 
                    you'll continue to have access to your current plan features 
                    until the end of your billing period.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setIsConfirmOpen(true)}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      )}

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your {userPlan} subscription? 
              You'll retain access to your current plan features until the end of 
              your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <LoadingButton
              isLoading={isCancelling}
              loadingText="Cancelling..."
              onClick={handleCancelConfirm}
              variant="destructive"
            >
              Confirm Cancellation
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubscriptionManagement;
