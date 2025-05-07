
export type PlanType = 'free' | 'pro' | 'business';

export interface PlanLimits {
  monthlyUploadLimit: number;
  dailyUploadLimit: number;
  maxAudioFileSize: number; // in bytes (MB * 1024 * 1024)
  maxVideoFileSize: number; // in bytes (MB * 1024 * 1024)
  allowTranslation: boolean;
  allowHistory: boolean;
  allowContentLibrary: boolean;
  allowSummary: boolean; // New feature flag for summary access
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    monthlyUploadLimit: 5,
    dailyUploadLimit: 1,
    maxAudioFileSize: 10 * 1024 * 1024, // 10MB
    maxVideoFileSize: 50 * 1024 * 1024, // 50MB
    allowTranslation: false,
    allowHistory: false,
    allowContentLibrary: false,
    allowSummary: false // Free plan users cannot access the summary feature
  },
  pro: {
    monthlyUploadLimit: 50,
    dailyUploadLimit: 5,
    maxAudioFileSize: 50 * 1024 * 1024, // 50MB
    maxVideoFileSize: 200 * 1024 * 1024, // 200MB
    allowTranslation: true,
    allowHistory: false,
    allowContentLibrary: false,
    allowSummary: true // Pro plan users can access the summary feature
  },
  business: {
    monthlyUploadLimit: Infinity,
    dailyUploadLimit: Infinity,
    maxAudioFileSize: 200 * 1024 * 1024, // 200MB
    maxVideoFileSize: 500 * 1024 * 1024, // 500MB
    allowTranslation: true,
    allowHistory: true,
    allowContentLibrary: true,
    allowSummary: true // Business plan users can access the summary feature
  }
};

export const getUpgradeMessage = (currentPlan: PlanType, limitType: 'monthly' | 'daily' | 'audio' | 'video' | 'feature'): string => {
  if (currentPlan === 'free') {
    switch (limitType) {
      case 'monthly':
        return "Upgrade to Pro for up to 50 files per month.";
      case 'daily':
        return "Upgrade to Pro to process up to 5 files per day.";
      case 'audio':
        return "Upgrade to Pro to upload audio files up to 50 MB.";
      case 'video':
        return "Upgrade to Pro to upload video files up to 200 MB.";
      case 'feature':
        return "Upgrade to Pro for translation features.";
      default:
        return "Upgrade to Pro for more features.";
    }
  } else if (currentPlan === 'pro') {
    switch (limitType) {
      case 'monthly':
        return "Upgrade to Business for unlimited file processing.";
      case 'daily':
        return "Upgrade to Business for unlimited daily processing.";
      case 'audio':
        return "Upgrade to Business to upload audio files up to 200 MB.";
      case 'video':
        return "Upgrade to Business to upload video files up to 500 MB.";
      case 'feature':
        return "Upgrade to Business for content library access and history.";
      default:
        return "Upgrade to Business for unlimited features.";
    }
  }
  return "You've reached the maximum limit for your plan. Please contact support for assistance.";
};

// Helper functions to check limits
export const checkMonthlyLimit = (currentCount: number, plan: PlanType): boolean => {
  const limit = PLAN_LIMITS[plan].monthlyUploadLimit;
  return typeof limit === 'number' ? currentCount < limit : true;
};

export const checkDailyLimit = (currentCount: number, plan: PlanType): boolean => {
  const limit = PLAN_LIMITS[plan].dailyUploadLimit;
  return typeof limit === 'number' ? currentCount < limit : true;
};

export const checkFileSize = (fileSize: number, fileType: 'audio' | 'video', plan: PlanType): boolean => {
  if (fileType === 'audio') {
    return fileSize <= PLAN_LIMITS[plan].maxAudioFileSize;
  } else {
    return fileSize <= PLAN_LIMITS[plan].maxVideoFileSize;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
