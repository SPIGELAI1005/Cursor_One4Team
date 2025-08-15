'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  UserCheck, 
  CreditCard,
  Activity,
  Star,
  FileText,
  BookOpen,
  MessageSquare
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) router.push('/sign-in');
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare data for unified dashboard layout
  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      subtitle: 'Active club members',
      icon: Users,
      color: 'bg-blue-100',
      trend: {
        value: '+12% from last month',
        isPositive: true
      }
    },
    {
      title: 'Active Activities',
      value: '24',
      subtitle: 'Currently running',
      icon: Calendar,
      color: 'bg-green-100',
      trend: {
        value: '3 scheduled today',
        isPositive: true
      }
    },
    {
      title: 'Monthly Revenue',
      value: '€45,231',
      subtitle: 'This month',
      icon: CreditCard,
      color: 'bg-purple-100',
      trend: {
        value: '+20.1% from last month',
        isPositive: true
      }
    },
    {
      title: 'System Health',
      value: '98%',
      subtitle: 'All systems operational',
      icon: Activity,
      color: 'bg-orange-100',
      trend: {
        value: 'Optimal performance',
        isPositive: true
      }
    }
  ];

  const quickActions = [
    {
      title: 'Manage Members',
      description: 'View and manage club members',
      icon: Users,
      href: '/dashboard/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Trainings',
      description: 'Schedule and manage training sessions',
      icon: Calendar,
      href: '/dashboard/trainings',
      color: 'bg-green-500',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Club Settings',
      description: 'Configure club preferences',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  const roleBasedModules = [
    {
      title: 'Admin Dashboard',
      description: 'Full administrative control',
      icon: UserCheck,
      href: '/dashboard/admin',
      color: 'bg-red-500',
      roles: ['admin']
    },
    {
      title: 'Finance Dashboard',
      description: 'Financial management and reporting',
      icon: CreditCard,
      href: '/dashboard/finance',
      color: 'bg-blue-500',
      roles: ['finance', 'admin']
    },
    {
      title: 'Trainer Dashboard',
      description: 'Player and training management',
      icon: Star,
      href: '/dashboard/trainer',
      color: 'bg-green-500',
      roles: ['trainer', 'admin']
    },
    {
      title: 'Support Dashboard',
      description: 'Customer support and issue tracking',
      icon: MessageSquare,
      href: '/dashboard/support',
      color: 'bg-orange-500',
      roles: ['support', 'admin']
    },
    {
      title: 'Official Dashboard',
      description: 'Official communications and documents',
      icon: FileText,
      href: '/dashboard/official',
      color: 'bg-purple-500',
      roles: ['official', 'admin']
    },
    {
      title: 'Partner Dashboard',
      description: 'Partner management and collaboration',
      icon: BookOpen,
      href: '/dashboard/partner',
      color: 'bg-indigo-500',
      roles: ['partner', 'admin']
    },
    {
      title: 'Press & News',
      description: 'Media and press management',
      icon: Activity,
      href: '/dashboard/press-news',
      color: 'bg-pink-500',
      roles: ['press-news', 'admin']
    }
  ];

  // Filter modules based on user role
  const userRole = (user?.publicMetadata?.roles as string[] | undefined)?.[0]
    || (user?.publicMetadata?.user_role as string | undefined)
    || 'member';
  const availableModules = roleBasedModules.filter(module => module.roles.includes(userRole as any));

  return (
    <div className="space-y-6">
      <SignedOut>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">
                Role: {user.role} • Here's what's happening with your sports club today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
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

      {/* Role-Based Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Available Dashboards</CardTitle>
          <CardDescription>
            Access dashboards based on your role permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules.map((module) => (
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

      {/* Member App Access */}
      <Card>
        <CardHeader>
          <CardTitle>Member Application</CardTitle>
          <CardDescription>
            Access the member-facing application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/app">
            <Button className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Go to Member App
            </Button>
          </Link>
        </CardContent>
      </Card>
      </SignedIn>
    </div>
  );
} 