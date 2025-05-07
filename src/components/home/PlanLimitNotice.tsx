
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PlanLimitNoticeProps {
  limitType: 'monthly' | 'daily' | 'audio' | 'video' | 'feature';
  feature?: string;
  onClose?: () => void;
}

const PlanLimitNotice: React.FC<PlanLimitNoticeProps> = ({ 
  limitType, 
  feature,
  onClose 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, userPlan } = useAuth();

  const getMessage = () => {
    const planName = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
    
    if (userPlan === 'free') {
      switch (limitType) {
        case 'monthly':
          return `You've reached the limit of 5 files per month on the Free plan.`;
        case 'daily':
          return `You've reached the limit of 1 file per day on the Free plan.`;
        case 'audio':
          return `The audio file exceeds the 10MB limit on the Free plan.`;
        case 'video':
          return `The video file exceeds the 50MB limit on the Free plan.`;
        case 'feature':
          return `${feature || 'This feature'} is not available on the Free plan.`;
      }
    } else if (userPlan === 'pro') {
      switch (limitType) {
        case 'monthly':
          return `You've reached the limit of 50 files per month on the Pro plan.`;
        case 'daily':
          return `You've reached the limit of 5 files per day on the Pro plan.`;
        case 'audio':
          return `The audio file exceeds the 50MB limit on the Pro plan.`;
        case 'video':
          return `The video file exceeds the 200MB limit on the Pro plan.`;
        case 'feature':
          return `${feature || 'This feature'} is only available on the Business plan.`;
      }
    } else {
      // Business plan
      switch (limitType) {
        case 'audio':
          return `The audio file exceeds the 200MB limit on the Business plan.`;
        case 'video':
          return `The video file exceeds the 500MB limit on the Business plan.`;
        default:
          return `You've reached a limit on your ${planName} plan.`;
      }
    }
    
    return `You've reached a limit on your ${planName} plan.`;
  };

  const getUpgradeText = () => {
    if (userPlan === 'free') {
      return "Upgrade to our Pro plan for more files and larger upload sizes.";
    } else if (userPlan === 'pro') {
      return "Upgrade to our Business plan for unlimited files and larger upload sizes.";
    }
    return "Please contact support if you need to process larger files.";
  };

  const handleUpgrade = () => {
    navigate('/pricing');
    if (onClose) onClose();
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-800">{getMessage()}</h4>
          <p className="text-amber-700 mt-1 text-sm">
            {getUpgradeText()}
          </p>
          <div className="mt-3 flex gap-3">
            {userPlan !== 'business' && (
              <Button 
                variant="default" 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={handleUpgrade}
              >
                {isAuthenticated ? 'Upgrade Plan' : 'View Plans'}
              </Button>
            )}
            {onClose && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={onClose}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanLimitNotice;
