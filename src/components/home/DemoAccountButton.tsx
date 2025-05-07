
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, UserCheck } from 'lucide-react';

const DemoAccountButton = () => {
  const { createDemoAccount, userPlan } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');

  const handleCreateAccount = () => {
    createDemoAccount(selectedPlan);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsDialogOpen(true)}
        className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
      >
        <Crown className="mr-2 h-4 w-4 text-amber-500" />
        Create Demo Premium Account
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <Crown className="mr-2 h-5 w-5 text-amber-500" />
              Create Demo Premium Account
            </DialogTitle>
            <DialogDescription className="pt-2">
              This will create a demo premium account for testing premium features like language conversion.
              No credit card required - this is for demonstration purposes only.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select plan type:</label>
            <Select
              value={selectedPlan}
              onValueChange={(value) => setSelectedPlan(value as 'pro' | 'business')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro" className="flex items-center">
                  <div className="flex items-center">
                    <span className="bg-purple-100 text-purple-800 text-xs py-1 px-2 rounded mr-2">Pro</span>
                    <span>15 videos/month + Premium Features</span>
                  </div>
                </SelectItem>
                <SelectItem value="business">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded mr-2">Business</span>
                    <span>Unlimited videos + All Features</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                <UserCheck className="mr-2 h-5 w-5" /> 
                Demo Account Benefits
              </h4>
              <ul className="text-sm text-amber-700 space-y-1 ml-7 list-disc">
                <li>Access to premium features like language conversion</li>
                <li>No credit card or payment required</li>
                <li>Test the full platform capabilities</li>
                <li>Your data is stored locally in your browser</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAccount}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              Create {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemoAccountButton;
