import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PLAN_LIMITS, PlanType } from '@/utils/planLimits';

type UserPlan = 'free' | 'pro' | 'business';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  plan: UserPlan;
  monthlyUploadUsage: number;
  dailyUploadUsage: number;
  lastMonthlyReset: string; // YYYY-MM format
  lastDailyReset: string;  // YYYY-MM-DD format
  subscription_id?: string;
  subscription_end?: string;
  videoUsage?: number; // Added for Account.tsx
  dailyVideoUsage?: number; // Added for Account.tsx
};

const DEMO_ACCOUNTS = {
  pro: {
    email: 'prodemo@example.com',
    password: 'demo@123',
    plan: 'pro' as UserPlan,
    name: 'Pro Demo User',
    avatar: 'https://ui-avatars.com/api/?name=Pro+Demo&background=0D8ABC&color=fff'
  },
  business: {
    email: 'businessdemo@example.com',
    password: 'business@123',
    plan: 'business' as UserPlan,
    name: 'Business Demo User',
    avatar: 'https://ui-avatars.com/api/?name=Business+Demo&background=2A3646&color=fff'
  }
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: string, userData?: Partial<User>) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  isAuthRequired: boolean;
  setIsAuthRequired: (required: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
  userPlan: PlanType;
  monthlyUploadUsage: number;
  dailyUploadUsage: number;
  incrementMonthlyUploadUsage: () => void;
  incrementDailyUploadUsage: () => void;
  resetMonthlyUploadUsage: () => void;
  resetDailyUploadUsage: () => void;
  hasReachedMonthlyUploadLimit: () => boolean;
  hasReachedDailyUploadLimit: () => boolean;
  hasReachedDailyLimit: (type: string) => boolean; // Added missing property
  createDemoAccount: (plan: PlanType) => void;
  checkFileSize: (fileSize: number, fileType: 'audio' | 'video') => { allowed: boolean; message?: string };
  getCurrentPlanLimits: () => typeof PLAN_LIMITS[PlanType];
  cancelSubscription: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Check if monthly reset is needed (new month)
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      if (parsedUser.lastMonthlyReset !== currentMonth) {
        parsedUser.monthlyUploadUsage = 0;
        parsedUser.lastMonthlyReset = currentMonth;
      }
      
      // Check if daily reset is needed (new day)
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      if (parsedUser.lastDailyReset !== today) {
        parsedUser.dailyUploadUsage = 0;
        parsedUser.lastDailyReset = today;
      }
      
      setUser(parsedUser);
      localStorage.setItem('user', JSON.stringify(parsedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (provider: string, userData?: Partial<User>) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData?.name || `User${Math.floor(Math.random() * 1000)}`,
      email: userData?.email || `user${Math.floor(Math.random() * 1000)}@example.com`,
      avatar: userData?.avatar,
      provider,
      plan: userData?.plan || 'free',
      monthlyUploadUsage: userData?.monthlyUploadUsage || 0,
      dailyUploadUsage: userData?.dailyUploadUsage || 0,
      lastMonthlyReset: currentMonth,
      lastDailyReset: today,
      subscription_id: userData?.subscription_id,
      subscription_end: userData?.subscription_end
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.removeItem('anonymousUploadUsage');
    setShowAuthModal(false);
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const loginWithCredentials = (email: string, password: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);
    
    if (email === DEMO_ACCOUNTS.pro.email && password === DEMO_ACCOUNTS.pro.password) {
      const proUser: User = {
        id: `demo-pro-${Math.random().toString(36).substr(2, 6)}`,
        name: DEMO_ACCOUNTS.pro.name,
        email: DEMO_ACCOUNTS.pro.email,
        avatar: DEMO_ACCOUNTS.pro.avatar,
        provider: 'demo',
        plan: 'pro',
        monthlyUploadUsage: 0,
        dailyUploadUsage: 0,
        lastMonthlyReset: currentMonth,
        lastDailyReset: today,
        subscription_id: `demo-sub-${Math.random().toString(36).substr(2, 6)}`,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      
      setUser(proUser);
      localStorage.setItem('user', JSON.stringify(proUser));
      localStorage.removeItem('anonymousUploadUsage');
      setShowAuthModal(false);
      
      toast({
        title: "Welcome Pro Demo User!",
        description: "You're now logged in with Pro account privileges.",
      });
      
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      
      return true;
    }
    
    if (email === DEMO_ACCOUNTS.business.email && password === DEMO_ACCOUNTS.business.password) {
      const businessUser: User = {
        id: `demo-business-${Math.random().toString(36).substr(2, 6)}`,
        name: DEMO_ACCOUNTS.business.name,
        email: DEMO_ACCOUNTS.business.email,
        avatar: DEMO_ACCOUNTS.business.avatar,
        provider: 'demo',
        plan: 'business',
        monthlyUploadUsage: 0,
        dailyUploadUsage: 0,
        lastMonthlyReset: currentMonth,
        lastDailyReset: today,
        subscription_id: `demo-sub-${Math.random().toString(36).substr(2, 6)}`,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      
      setUser(businessUser);
      localStorage.setItem('user', JSON.stringify(businessUser));
      localStorage.removeItem('anonymousUploadUsage');
      setShowAuthModal(false);
      
      toast({
        title: "Welcome Business Demo User!",
        description: "You're now logged in with Business account privileges.",
      });
      
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const createDemoAccount = (plan: PlanType) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);
    
    const demoUser: User = {
      id: `demo-${plan}-${Math.random().toString(36).substr(2, 6)}`,
      name: `Demo ${plan.charAt(0).toUpperCase() + plan.slice(1)} User`,
      email: `demo-${plan}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=Demo+${plan}&background=random`,
      provider: 'demo',
      plan: plan,
      monthlyUploadUsage: 0,
      dailyUploadUsage: 0,
      lastMonthlyReset: currentMonth,
      lastDailyReset: today,
      subscription_id: plan !== 'free' ? `demo-sub-${Math.random().toString(36).substr(2, 6)}` : undefined,
      subscription_end: plan !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
    };
    
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.removeItem('anonymousUploadUsage');
    
    toast({
      title: `Demo ${plan.toUpperCase()} account created`,
      description: "You can now test premium features with this account.",
    });
  };

  const checkFileSize = (fileSize: number, fileType: 'audio' | 'video') => {
    const plan = user?.plan || 'free';
    const maxSize = fileType === 'audio' 
      ? PLAN_LIMITS[plan].maxAudioFileSize 
      : PLAN_LIMITS[plan].maxVideoFileSize;
    
    if (fileSize > maxSize) {
      const upgradeMessage = plan === 'business' 
        ? "You've reached the maximum file size for your Business plan." 
        : `Upgrade to ${plan === 'free' ? 'Pro' : 'Business'} for larger file uploads.`;
      
      return {
        allowed: false,
        message: upgradeMessage
      };
    }
    
    return { allowed: true };
  };

  const getCurrentPlanLimits = () => {
    return PLAN_LIMITS[user?.plan || 'free'];
  };

  const hasReachedMonthlyUploadLimit = () => {
    if (user) {
      const limit = PLAN_LIMITS[user.plan].monthlyUploadLimit;
      return typeof limit === 'number' ? user.monthlyUploadUsage >= limit : false;
    } else {
      const anonymousUploadUsage = parseInt(localStorage.getItem('anonymousUploadUsage') || '0', 10);
      return anonymousUploadUsage >= PLAN_LIMITS.free.monthlyUploadLimit;
    }
  };

  const hasReachedDailyUploadLimit = () => {
    if (user) {
      const limit = PLAN_LIMITS[user.plan].dailyUploadLimit;
      return typeof limit === 'number' ? user.dailyUploadUsage >= limit : false;
    } else {
      const anonymousDailyUploadUsage = parseInt(localStorage.getItem('anonymousDailyUploadUsage') || '0', 10);
      return anonymousDailyUploadUsage >= PLAN_LIMITS.free.dailyUploadLimit;
    }
  };

  const hasReachedDailyLimit = (type: string): boolean => {
    if (type === 'upload') {
      return hasReachedDailyUploadLimit();
    }
    // Add other limit types if needed
    return false;
  };

  const incrementMonthlyUploadUsage = () => {
    if (user) {
      const updatedUser = {
        ...user,
        monthlyUploadUsage: user.monthlyUploadUsage + 1
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      const currentAnonymousUsage = parseInt(localStorage.getItem('anonymousUploadUsage') || '0', 10);
      localStorage.setItem('anonymousUploadUsage', (currentAnonymousUsage + 1).toString());
    }
  };

  const incrementDailyUploadUsage = () => {
    if (user) {
      const updatedUser = {
        ...user,
        dailyUploadUsage: user.dailyUploadUsage + 1
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      const currentAnonymousDailyUsage = parseInt(localStorage.getItem('anonymousDailyUploadUsage') || '0', 10);
      localStorage.setItem('anonymousDailyUploadUsage', (currentAnonymousDailyUsage + 1).toString());
    }
  };

  const resetMonthlyUploadUsage = () => {
    if (user) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const updatedUser = {
        ...user,
        monthlyUploadUsage: 0,
        lastMonthlyReset: currentMonth
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('anonymousUploadUsage');
    }
  };

  const resetDailyUploadUsage = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const updatedUser = {
        ...user,
        dailyUploadUsage: 0,
        lastDailyReset: today
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('anonymousDailyUploadUsage');
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!user) {
          throw new Error('No user logged in');
        }
        
        if (user.plan === 'free') {
          throw new Error('No active subscription to cancel');
        }
        
        const subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const updatedUser: User = {
          ...user,
          plan: 'free',
          subscription_id: undefined,
          subscription_end: subscriptionEnd,
        };
        
        setTimeout(() => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          resolve();
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithCredentials,
        logout,
        showAuthModal,
        setShowAuthModal,
        isAuthRequired,
        setIsAuthRequired,
        pendingAction,
        setPendingAction,
        userPlan: user?.plan || 'free',
        monthlyUploadUsage: user ? user.monthlyUploadUsage : parseInt(localStorage.getItem('anonymousUploadUsage') || '0', 10),
        dailyUploadUsage: user ? user.dailyUploadUsage : parseInt(localStorage.getItem('anonymousDailyUploadUsage') || '0', 10),
        incrementMonthlyUploadUsage,
        incrementDailyUploadUsage,
        resetMonthlyUploadUsage,
        resetDailyUploadUsage,
        hasReachedMonthlyUploadLimit,
        hasReachedDailyUploadLimit,
        hasReachedDailyLimit,
        createDemoAccount,
        checkFileSize,
        getCurrentPlanLimits,
        cancelSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
