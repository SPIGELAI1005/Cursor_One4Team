'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getContextualRole, getRoleDisplayName, getUserClub } from '@/lib/clerk-utils';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Star,
  FileText,
  Settings,
  BarChart3,
  ShoppingCart,
  UserPlus,
  Shield,
  Package,
  Globe,
  Key,
  Database
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  role: 'admin' | 'trainer' | 'member';
  stats: DashboardStat[];
  quickActions: QuickAction[];
  recentActivity?: ActivityItem[];
  announcements?: AnnouncementItem[];
  upcomingEvents?: EventItem[];
  recentBookings?: BookingItem[];
}

interface DashboardStat {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

interface ActivityItem {
  id: string | number;
  type: string;
  user: string;
  action: string;
  timestamp: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'class' | 'event' | 'booking';
  sportType?: string;
  trainer?: {
    name: string;
  };
  isEnrolled?: boolean;
}

interface BookingItem {
  id: string;
  startTime: string;
  endTime: string;
  resource: {
    name: string;
    type: string;
  };
  status: string;
}

export function DashboardLayout({
  children,
  role,
  stats,
  quickActions,
  recentActivity,
  announcements,
  upcomingEvents,
  recentBookings
}: DashboardLayoutProps) {
  const { user } = useUser();
  const contextualRole = getContextualRole(user || null, role);
  const roleDisplayName = getRoleDisplayName(contextualRole);
  const userClub = getUserClub(user || null);

  const getClubLogo = (clubName: string, clubLogo?: string) => {
    // TSV Allach 09 always uses their specific logo
    if (clubName.toLowerCase() === 'tsv allach 09') {
      return '/TSV Allach 09.png';
    }
    
    // For other clubs, use custom logo if configured
    if (clubLogo) {
      return clubLogo;
    }
    
    // Fallback to placeholder for clubs without custom logo
    return '/placeholder.svg';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string, sportType?: string) => {
    if (sportType) {
      switch (sportType.toLowerCase()) {
        case 'football':
        case 'soccer':
          return '⚽';
        case 'basketball':
          return '🏀';
        case 'tennis':
          return '🎾';
        case 'volleyball':
          return '🏐';
        case 'handball':
          return '🤾';
        case 'karate':
        case 'martial arts':
          return '🥋';
        case 'swimming':
          return '🏊';
        case 'athletics':
        case 'track':
          return '🏃';
        case 'gymnastics':
          return '🤸';
        case 'table tennis':
          return '🏓';
        case 'badminton':
          return '🏸';
        case 'hockey':
          return '🏒';
        case 'baseball':
          return '⚾';
        case 'rugby':
          return '🏉';
        case 'cricket':
          return '🏏';
        default:
          return '⚽';
      }
    }
    
    switch (type) {
      case 'class':
        return '⚽';
      case 'event':
        return '🎉';
      case 'booking':
        return '📅';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header with Club Logo */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <Image
                src={getClubLogo(userClub.name, userClub.logo)}
                alt={`${userClub.name} Logo`}
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-blue-100 mb-1">
                {userClub.name} • {userClub.location || 'Munich, Germany'}
              </p>
              <p className="text-blue-100">
                You're logged in as a <span className="font-semibold">{roleDisplayName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color || 'bg-blue-100'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
                  {stat.trend && (
                    <p className={`text-xs ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend.value}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Announcements */}
          {announcements && announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(announcement.createdAt)}
                          </p>
                        </div>
                        <Badge className={getTypeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your most used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <action.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm">{action.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          {recentBookings && recentBookings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{booking.resource.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                          </p>
                        </div>
                      </div>
                      <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events/Trainings */}
          {upcomingEvents && upcomingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming {role === 'member' ? 'Trainings' : 'Events'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{getEventIcon(event.type, event.sportType)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.startTime)} at {formatTime(event.startTime)}
                        </p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                        {event.trainer && (
                          <p className="text-xs text-blue-600">with {event.trainer.name}</p>
                        )}
                      </div>
                      {event.isEnrolled && (
                        <Badge className="bg-green-100 text-green-800">Enrolled</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {recentActivity && recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                        <p className="text-xs text-gray-600">{activity.action}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Custom Content */}
      {children}
    </div>
  );
} 