'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ACTIVITY_TYPE_OPTIONS, SPORT_TYPE_OPTIONS, ActivityType, SportType } from '@/lib/club-config';
import { Settings, Save, Building, Users, Calendar, Trophy, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [activityType, setActivityType] = useState<ActivityType>('training');
  const [primarySportType, setPrimarySportType] = useState<SportType>('football');
  const [selectedSportTypes, setSelectedSportTypes] = useState<SportType[]>(['football']);
  const [clubLogo, setClubLogo] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check for user in localStorage (demo authentication)
    const userData = localStorage.getItem('one4team_user');
    
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
    } else {
      // No user found, redirect to sign-in
      router.push('/sign-in');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the settings page.</p>
          <Button onClick={() => router.push('/sign-in')}>Sign Out</Button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll just simulate a save
      console.log('Saving activity type:', activityType);
      console.log('Saving club logo:', clubLogo);
      
      setTimeout(() => {
        setIsSaving(false);
        // Show success message
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to your server
      // and get back a URL. For now, we'll create a local URL
      const url = URL.createObjectURL(file);
      setClubLogo(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Club Settings</h1>
            <p className="text-gray-600">Configure your club preferences and terminology</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Club Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-gray-600" />
              <span>Club Information</span>
            </CardTitle>
            <CardDescription>
              Basic club details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clubName">Club Name</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-700">Demo Sports Club</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="clubEmail">Contact Email</Label>
              <Input 
                id="clubEmail" 
                type="email" 
                placeholder="contact@club.com"
                defaultValue="contact@demosportsclub.com"
              />
            </div>
            
            <div>
              <Label htmlFor="clubPhone">Phone Number</Label>
              <Input 
                id="clubPhone" 
                type="tel" 
                placeholder="+49 123 456 789"
                defaultValue="+49 123 456 789"
              />
            </div>
            
            <div>
              <Label htmlFor="clubAddress">Address</Label>
              <Input 
                id="clubAddress" 
                placeholder="Club Address"
                defaultValue="123 Sports Street, Munich, Germany"
              />
            </div>
          </CardContent>
        </Card>

        {/* Club Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-gray-600" />
              <span>Club Logo</span>
            </CardTitle>
            <CardDescription>
              Upload your club logo for branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                {clubLogo ? (
                  <Image 
                    src={clubLogo} 
                    alt="Club Logo" 
                    width={80} 
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <Label htmlFor="logoUpload" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </div>
                </Label>
                <Input 
                  id="logoUpload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Type Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span>Activity Type</span>
            </CardTitle>
            <CardDescription>
              Choose how activities are labeled in your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activityType">Primary Activity Type</Label>
              <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>This will change how activities are labeled throughout the app:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"{activityType} sessions" instead of "training sessions"</li>
                <li>"{activityType} schedule" instead of "training schedule"</li>
                <li>"{activityType} management" instead of "training management"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sport Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-gray-600" />
              <span>Sport Types</span>
            </CardTitle>
            <CardDescription>
              Configure available sports and primary sport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primarySport">Primary Sport</Label>
              <Select value={primarySportType} onValueChange={(value: SportType) => setPrimarySportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Available Sports</Label>
              <div className="mt-2 space-y-2">
                {SPORT_TYPE_OPTIONS.map((sport) => (
                  <div key={sport.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={sport.value}
                      checked={selectedSportTypes.includes(sport.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSportTypes([...selectedSportTypes, sport.value]);
                        } else {
                          setSelectedSportTypes(selectedSportTypes.filter(s => s !== sport.value));
                        }
                      }}
                    />
                    <Label htmlFor={sport.value} className="text-sm">
                      {sport.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 