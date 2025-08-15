'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard, AdminNavCard, ActivityFeed, DashboardHeader } from "@/components/admin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  ShoppingCart,
  Settings,
  UserPlus,
  FileText,
  Shield,
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
  Package,
  MessageSquare,
  BookOpen,
  Database,
  Globe,
  Key
} from "lucide-react";
import { DashboardLayout } from '@/components/dashboard';

// Mock data for the dashboard
const mockStats = {
  totalMembers: 1247,
  upcomingEvents: 8,
  openInvoices: 23,
  ordersLastWeek: 156
};

const mockActivity = [
  {
    id: 1,
    type: 'registration',
    user: 'Anna Müller',
    action: 'New member registration',
    timestamp: '2 minutes ago',
    icon: UserPlus,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'payment',
    user: 'Thomas Weber',
    action: 'Payment received - €89.99',
    timestamp: '15 minutes ago',
    icon: CreditCard,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'admin',
    user: 'Admin',
    action: 'Updated club settings',
    timestamp: '1 hour ago',
    icon: Settings,
    color: 'text-purple-600'
  },
  {
    id: 4,
    type: 'order',
    user: 'Maria Schmidt',
    action: 'New shop order - #ORD-001',
    timestamp: '2 hours ago',
    icon: ShoppingCart,
    color: 'text-orange-600'
  },
  {
    id: 5,
    type: 'event',
    user: 'System',
    action: 'New event created: Training Camp',
    timestamp: '3 hours ago',
    icon: Calendar,
    color: 'text-indigo-600'
  }
];

const managementModules = [
  {
    title: 'Members Management',
    description: 'Manage club members, profiles, and memberships',
    icon: Users,
    href: '/dashboard/admin/users',
    color: 'bg-blue-500'
  },
  {
    title: 'Trainers & Players',
    description: 'Manage trainers, players, and team assignments',
    icon: UserPlus,
    href: '/dashboard/trainer',
    color: 'bg-green-500'
  },
  {
    title: 'Contributions & Invoices',
    description: 'Track payments, generate invoices, and manage finances',
    icon: CreditCard,
    href: '/dashboard/admin/payments',
    color: 'bg-purple-500'
  },
  {
    title: 'Shop & Orders',
    description: 'Manage products, inventory, and customer orders',
    icon: ShoppingCart,
    href: '/dashboard/admin/shop',
    color: 'bg-orange-500'
  },
  {
    title: 'Calendar & Events',
    description: 'Schedule events, manage bookings, and coordinate activities',
    icon: Calendar,
    href: '/dashboard/admin/calendar',
    color: 'bg-indigo-500'
  },
  {
    title: 'Bookings & Resources',
    description: 'Manage facility bookings and resource allocation',
    icon: BookOpen,
    href: '/dashboard/admin/bookings',
    color: 'bg-teal-500'
  },
  {
    title: 'Club Website Builder',
    description: 'Customize and manage the club\'s public website',
    icon: Globe,
    href: '/dashboard/admin/website',
    color: 'bg-pink-500'
  },
  {
    title: 'Roles & Permissions',
    description: 'Configure user roles, permissions, and access control',
    icon: Shield,
    href: '/dashboard/admin/roles',
    color: 'bg-red-500'
  },
  {
    title: 'Settings & Configuration',
    description: 'Manage club settings, preferences, and system configuration',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'bg-gray-500'
  }
];

const adminTools = [
  {
    title: 'Add Member',
    description: 'Register new club members',
    icon: UserPlus,
    href: '/dashboard/admin/users/add',
    color: 'bg-green-500'
  },
  {
    title: 'Upload Documents',
    description: 'Upload and manage club documents',
    icon: FileText,
    href: '/dashboard/admin/documents',
    color: 'bg-blue-500'
  },
  {
    title: 'Assign Role',
    description: 'Manage user roles and permissions',
    icon: Shield,
    href: '/dashboard/admin/roles',
    color: 'bg-purple-500'
  },
  {
    title: 'System Backup',
    description: 'Create system backup and export data',
    icon: Database,
    href: '/dashboard/admin/backup',
    color: 'bg-orange-500'
  }
];

export default function AdminDashboard() {
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
          <p>Loading dashboard...</p>
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
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
    );
  }

  // Prepare data for unified dashboard layout
  const stats = [
    {
      title: 'Total Members',
      value: mockStats.totalMembers,
      subtitle: 'Active members',
      icon: Users,
      color: 'bg-blue-100',
      trend: {
        value: '+12% from last month',
        isPositive: true
      }
    },
    {
      title: 'Upcoming Events',
      value: mockStats.upcomingEvents,
      subtitle: 'This week',
      icon: Calendar,
      color: 'bg-green-100',
      trend: {
        value: '3 scheduled today',
        isPositive: true
      }
    },
    {
      title: 'Open Invoices',
      value: mockStats.openInvoices,
      subtitle: 'Pending payments',
      icon: CreditCard,
      color: 'bg-orange-100',
      trend: {
        value: '€2,450 pending',
        isPositive: false
      }
    },
    {
      title: 'Orders Last Week',
      value: mockStats.ordersLastWeek,
      subtitle: 'Shop orders',
      icon: ShoppingCart,
      color: 'bg-purple-100',
      trend: {
        value: '+8% from last week',
        isPositive: true
      }
    }
  ];

  const quickActions = [
    {
      title: 'Add Member',
      description: 'Register new club members',
      icon: UserPlus,
      href: '/dashboard/admin/users/add',
      color: 'bg-green-500',
    },
    {
      title: 'Manage Settings',
      description: 'Configure club settings',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-blue-500',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Shop Management',
      description: 'Manage products and orders',
      icon: ShoppingCart,
      href: '/dashboard/admin/shop',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{user.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.name || 'Admin User'}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'Administrator'}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your sports club today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className={`text-xs ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <action.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm">{action.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Modules */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Management Modules</CardTitle>
            <CardDescription>
              Access all administrative functions and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managementModules.map((module) => (
                <Link key={module.title} href={module.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${module.color}`}>
                          <module.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{module.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in your club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 