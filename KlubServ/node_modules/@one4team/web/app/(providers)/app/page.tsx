'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getContextualRole, getRoleDisplayName, getUserClub } from '@/lib/clerk-utils';
import { DashboardLayout } from '@/components/dashboard';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
}

interface Event {
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
  maxParticipants?: number;
  currentParticipants?: number;
  isEnrolled?: boolean;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  resource: {
    name: string;
    type: string;
  };
  status: string;
}

interface QuickStats {
  activeMembership: string;
  classesThisWeek: number;
  unreadMessages: number;
  pendingPayments: number;
  totalPendingAmount: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  status: string;
  club: string;
}

interface DashboardData {
  announcements: Announcement[];
  upcomingEvents: Event[];
  upcomingBookings: Booking[];
  quickStats: QuickStats;
  member: Member;
}

export default function MemberDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Temporary: Use mock data instead of API call
        // TODO: Replace with real API call once database is set up
        const mockDashboardData: DashboardData = {
          announcements: [
            {
              id: '1',
              title: 'Welcome to the New Season!',
              content: 'We\'re excited to announce the start of our new training season. All members are welcome to join our enhanced programs.',
              type: 'info',
              createdAt: '2024-01-15T10:00:00Z',
            },
            {
              id: '2',
              title: 'Equipment Maintenance Day',
              content: 'This Saturday, we\'ll be performing routine maintenance on all training equipment. Please plan accordingly.',
              type: 'warning',
              createdAt: '2024-01-14T14:30:00Z',
            },
          ],
          upcomingEvents: [
            {
              id: '1',
              title: 'U12-1 Training',
              type: 'class',
              sportType: 'football',
              startTime: '2025-07-30T18:00:00Z',
              endTime: '2025-07-30T19:30:00Z',
              location: 'Main Training Field',
              trainer: { name: 'Coach Müller' },
              isEnrolled: true,
            },
            {
              id: '2',
              title: 'U12-1 Training',
              type: 'class',
              sportType: 'football',
              startTime: '2025-08-01T18:00:00Z',
              endTime: '2025-08-01T19:30:00Z',
              location: 'Main Training Field',
              trainer: { name: 'Coach Müller' },
              isEnrolled: true,
            },
            {
              id: '3',
              title: 'U08-Girls Training',
              type: 'class',
              sportType: 'football',
              startTime: '2025-08-01T18:00:00Z',
              endTime: '2025-08-01T19:30:00Z',
              location: 'Training Ground A',
              trainer: { name: 'Coach Schmidt' },
              isEnrolled: false,
            },
          ],
          upcomingBookings: [
            {
              id: '1',
              startTime: '2025-08-03T14:00:00Z',
              endTime: '2025-08-03T18:00:00Z',
              status: 'confirmed',
              resource: {
                name: 'Artificial Grass Field',
                type: 'field',
              },
            },
          ],
          quickStats: {
            activeMembership: 'ACTIVE',
            classesThisWeek: 3,
            unreadMessages: 2,
            pendingPayments: 1,
            totalPendingAmount: 50.00,
          },
          member: {
            id: '1',
            name: user?.firstName + ' ' + user?.lastName || 'Member',
            email: user?.emailAddresses[0]?.emailAddress || 'member@example.com',
            status: 'active',
            club: 'TSV Allach 09',
          },
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(mockDashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [getToken, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const { announcements, upcomingEvents, upcomingBookings, quickStats } = data;

  // Prepare data for unified dashboard layout
  const stats = [
    {
      title: 'Membership',
      value: quickStats.activeMembership.toLowerCase(),
      subtitle: 'Status',
      icon: Users,
      color: quickStats.activeMembership === 'ACTIVE' ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      title: 'Trainings This Week',
      value: quickStats.classesThisWeek,
      subtitle: 'Scheduled sessions',
      icon: Calendar,
      color: 'bg-blue-100',
    },
    {
      title: 'Unread Messages',
      value: quickStats.unreadMessages,
      subtitle: 'New messages',
      icon: MessageSquare,
      color: 'bg-orange-100',
    },
    {
      title: 'Pending Payments',
      value: quickStats.pendingPayments,
      subtitle: `€${quickStats.totalPendingAmount.toFixed(2)}`,
      icon: CreditCard,
      color: 'bg-red-100',
    },
  ];

  const quickActions = [
    {
      title: 'Payments',
      description: 'View and manage payments',
      icon: CreditCard,
      href: '/app/payments',
      color: 'bg-blue-500',
    },
    {
      title: 'Messages',
      description: 'Check your messages',
      icon: MessageSquare,
      href: '/app/messages',
      color: 'bg-green-500',
    },
    {
      title: 'Calendar',
      description: 'View your schedule',
      icon: Calendar,
      href: '/app/calendar',
      color: 'bg-purple-500',
    },
    {
      title: 'Bookings',
      description: 'Manage your bookings',
      icon: BookOpen,
      href: '/app/bookings',
      color: 'bg-orange-500',
    },
  ];

  return (
    <DashboardLayout
      role="member"
      stats={stats}
      quickActions={quickActions}
      announcements={announcements}
      upcomingEvents={upcomingEvents}
      recentBookings={upcomingBookings}
    />
  );
} 