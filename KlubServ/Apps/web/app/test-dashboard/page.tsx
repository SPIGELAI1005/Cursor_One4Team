'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleSignOut = () => {
    localStorage.removeItem('one4team_user');
    router.push('/sign-in');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Test - Authentication Working! ✅</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Success!</h3>
              <p className="text-green-700">
                The dashboard authentication is working without Clerk. No more useAuth errors!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">User Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                <p><strong>ID:</strong> {user.id || 'N/A'}</p>
                {user.provider && <p><strong>Provider:</strong> {user.provider}</p>}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold mb-2">Available Dashboards</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/admin')}>
                  Admin Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/finance')}>
                  Finance Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/trainer')}>
                  Trainer Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/support')}>
                  Support Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/official')}>
                  Official Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/partner')}>
                  Partner Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/press-news')}>
                  Press-News Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/app')}>
                  Member App
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
              <Button onClick={() => router.push('/sign-in')}>
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
