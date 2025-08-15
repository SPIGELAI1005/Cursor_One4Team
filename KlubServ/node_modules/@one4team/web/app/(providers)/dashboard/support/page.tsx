'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  SupportUserTable, 
  SupportMessageViewer, 
  UserProfileDrawer, 
  FlaggedIssuesTable, 
  SupportActionBar 
} from '@/components/support';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Settings, 
  Shield,
  Clock,
  CheckCircle,
  UserCheck
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  team?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  avatar?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'trainer' | 'admin';
  team?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin?: string;
  avatar?: string;
  address?: string;
  birthDate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  membershipDetails?: {
    type: string;
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
  };
  permissions?: string[];
}

export default function SupportDashboard() {
  const { user, isLoaded } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messages' | 'issues' | 'tools'>('overview');

  if (!isLoaded || !user) {
    return null;
  }

  // Mock stats for the dashboard
  const stats = [
    {
      title: 'Total Users',
      value: 1247,
      subtitle: 'Active members',
      icon: Users,
      color: 'bg-blue-100',
      trend: {
        value: '+12% from last month',
        isPositive: true
      }
    },
    {
      title: 'Open Conversations',
      value: 8,
      subtitle: 'Support tickets',
      icon: MessageSquare,
      color: 'bg-orange-100',
      trend: {
        value: '3 new today',
        isPositive: false
      }
    },
    {
      title: 'Active Issues',
      value: 5,
      subtitle: 'Flagged problems',
      icon: AlertTriangle,
      color: 'bg-red-100',
      trend: {
        value: '2 critical',
        isPositive: false
      }
    },
    {
      title: 'Resolved Today',
      value: 12,
      subtitle: 'Completed tickets',
      icon: CheckCircle,
      color: 'bg-green-100',
      trend: {
        value: '+3 from yesterday',
        isPositive: true
      }
    }
  ];

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // Convert User to UserProfile for the drawer
    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
      status: user.status,
      joinDate: '2023-01-15', // Mock data
      lastLogin: user.lastLogin,
      avatar: user.avatar,
      phone: '+49 123 456 789', // Mock data
      address: 'München, Germany', // Mock data
      birthDate: '1990-05-15', // Mock data
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+49 987 654 321',
        relationship: 'Parent'
      },
      membershipDetails: {
        type: 'Premium',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        autoRenew: true
      },
      permissions: ['view_profile', 'edit_profile', 'make_bookings']
    };
    setSelectedUserProfile(userProfile);
    setIsProfileDrawerOpen(true);
  };

  const handleProfileAction = (action: string, userId: string) => {
    console.log(`Support action: ${action} for user ${userId}`);
    // In a real app, this would call the appropriate API endpoint
  };

  const handleMessageReply = (conversationId: string, message: string) => {
    console.log(`Reply to conversation ${conversationId}: ${message}`);
    // In a real app, this would send the message via API
  };

  const handleIssueStatusUpdate = (issueId: string, status: string) => {
    console.log(`Update issue ${issueId} to status: ${status}`);
    // In a real app, this would update the issue via API
  };

  const handleSupportAction = (action: string, data?: any) => {
    console.log(`Support action: ${action}`, data);
    // In a real app, this would call the appropriate API endpoint
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'messages', label: 'Message Center', icon: MessageSquare },
    { id: 'issues', label: 'Issues Feed', icon: AlertTriangle },
    { id: 'tools', label: 'Support Tools', icon: Settings }
  ];

  return (
    <SignedInWithRole requiredRoles={['support']} redirectTo="/403">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
            <p className="text-gray-600">Hello, Support Team!</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" icon={<Shield className="w-3 h-3" />}>
              Read-Only Access
            </Badge>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className={`text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-orange-600'}`}>
                      {stat.trend.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Support Activity</CardTitle>
                  <CardDescription>Latest support interactions and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Password reset completed</p>
                        <p className="text-xs text-gray-500">Anna Müller • 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New support conversation</p>
                        <p className="text-xs text-gray-500">Thomas Weber • 15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Critical issue reported</p>
                        <p className="text-xs text-gray-500">Payment system • 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common support tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">View User Directory</p>
                        <p className="text-sm text-gray-500">Search and view member profiles</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium">Message Center</p>
                        <p className="text-sm text-gray-500">Respond to support conversations</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('issues')}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium">Issues Feed</p>
                        <p className="text-sm text-gray-500">Monitor and resolve flagged issues</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium">Support Tools</p>
                        <p className="text-sm text-gray-500">Password reset, email resend, etc.</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <SupportUserTable onUserSelect={handleUserSelect} />
          )}

          {activeTab === 'messages' && (
            <SupportMessageViewer onReply={handleMessageReply} />
          )}

          {activeTab === 'issues' && (
            <FlaggedIssuesTable 
              onIssueSelect={(issue) => console.log('Selected issue:', issue)}
              onStatusUpdate={handleIssueStatusUpdate}
            />
          )}

          {activeTab === 'tools' && (
            <SupportActionBar onAction={handleSupportAction} />
          )}
        </div>

        {/* User Profile Drawer */}
        <UserProfileDrawer
          user={selectedUserProfile}
          isOpen={isProfileDrawerOpen}
          onClose={() => {
            setIsProfileDrawerOpen(false);
            setSelectedUserProfile(null);
          }}
          onAction={handleProfileAction}
        />
      </div>
    </SignedInWithRole>
  );
} 