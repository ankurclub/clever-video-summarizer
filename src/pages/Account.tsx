import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SubscriptionManagement from '@/components/account/SubscriptionManagement';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to access your account settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // This would typically connect to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been updated.",
        });
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>Account Settings | AI Video Summary Tool</title>
        <meta name="description" content="Manage your account settings, subscription, and profile." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your basic account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-full w-8 h-8 p-0"
                        disabled={isUploading}
                      >
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <Upload className="h-4 w-4" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <span className="sr-only">Upload avatar</span>
                        </label>
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-lg font-medium">{user?.name || 'User'}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Button onClick={handleEditProfile}>Edit Profile</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="subscription">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription">
              <SubscriptionManagement />
            </TabsContent>
            
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Usage & Limits</CardTitle>
                  <CardDescription>Track your usage against your plan limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium mb-2">Videos Processed</h4>
                        <div className="flex justify-between">
                          <span>{user?.videoUsage || 0}</span>
                          <span className="text-gray-500">
                            / {user?.plan === 'free' ? '3' : user?.plan === 'pro' ? '15' : '∞'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium mb-2">Daily Videos</h4>
                        <div className="flex justify-between">
                          <span>{user?.dailyVideoUsage || 0}</span>
                          <span className="text-gray-500">
                            / {user?.plan === 'free' ? '1' : user?.plan === 'pro' ? '3' : '∞'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium mb-2">Daily Uploads</h4>
                        <div className="flex justify-between">
                          <span>{user?.dailyUploadUsage || 0}</span>
                          <span className="text-gray-500">
                            / {user?.plan === 'free' ? '1' : user?.plan === 'pro' ? '5' : '∞'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
