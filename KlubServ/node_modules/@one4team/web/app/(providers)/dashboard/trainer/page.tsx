'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Star, 
  FileText, 
  TrendingUp,
  Plus,
  BookOpen,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboard() {
  // Mock data - replace with real API calls
  const stats = {
    totalPlayers: 24,
    activeSessions: 3,
    upcomingSessions: 8,
    totalNotes: 156,
    averageRating: 4.2,
    thisWeekSessions: 12,
  };

  const recentSessions = [
    {
      id: '1',
      name: 'Technical Skills Training',
      date: '2024-01-15',
      time: '14:00',
      players: 12,
      status: 'completed',
    },
    {
      id: '2',
      name: 'Tactical Analysis',
      date: '2024-01-16',
      time: '16:00',
      players: 8,
      status: 'scheduled',
    },
    {
      id: '3',
      name: 'Fitness Assessment',
      date: '2024-01-17',
      time: '10:00',
      players: 15,
      status: 'scheduled',
    },
  ];

  const quickActions = [
    {
      title: 'Add Player Note',
      description: 'Record player development progress',
      icon: FileText,
      href: '/dashboard/trainer/notes',
      color: 'bg-blue-500',
    },
    {
      title: 'Create Training Plan',
      description: 'Design new training session',
      icon: BookOpen,
      href: '/dashboard/trainer/training',
      color: 'bg-green-500',
    },
    {
      title: 'Schedule Session',
      description: 'Book training time slot',
      icon: Calendar,
      href: '/dashboard/trainer/schedule',
      color: 'bg-purple-500',
    },
    {
      title: 'Evaluate Player',
      description: 'Rate player performance',
      icon: Star,
      href: '/dashboard/trainer/players',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your players, training sessions, and development notes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/dashboard/trainer/training">
              <Plus className="w-4 h-4 mr-2" />
              New Training Session
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekSessions}</div>
            <p className="text-xs text-muted-foreground">
              Training sessions scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Player performance score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              Development records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={action.href}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{session.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {session.date} at {session.time} • {session.players} players
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/dashboard/trainer/schedule">
                View All Sessions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Top Performers</span>
                <span className="text-xs text-muted-foreground">This Month</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Alex Johnson', rating: 4.8, improvement: '+0.3' },
                  { name: 'Sarah Miller', rating: 4.6, improvement: '+0.2' },
                  { name: 'Mike Davis', rating: 4.5, improvement: '+0.4' },
                ].map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{player.rating}</span>
                      <span className="text-xs text-green-600">{player.improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/dashboard/trainer/players">
                View All Players
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 