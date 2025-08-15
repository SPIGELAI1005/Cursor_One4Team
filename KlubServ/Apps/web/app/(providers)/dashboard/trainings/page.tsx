'use client';

import { useUser } from '@clerk/nextjs';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserClubConfig } from '@/lib/clerk-utils';
import { getSportTypeIcon } from '@/lib/club-config';
import { Calendar, Clock, Users, MapPin, Plus, Filter, Search } from 'lucide-react';

export default function TrainingsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const clubConfig = getUserClubConfig(user);

  // Mock data for trainings
  const trainings = [
    {
      id: 1,
      title: 'Advanced Soccer Training',
      trainer: 'Coach Müller',
      trainerAvatar: '/Thomas Weber.jpg',
      date: '2024-01-15',
      time: '18:00',
      duration: '90 min',
      location: 'Main Field',
      maxParticipants: 20,
      currentParticipants: 15,
      status: 'upcoming',
      type: 'training',
      sportType: 'football'
    },
    {
      id: 2,
      title: 'Youth Development Session',
      trainer: 'Coach Schmidt',
      trainerAvatar: '/Maria Schmidt.jpg',
      date: '2024-01-16',
      time: '16:00',
      duration: '60 min',
      location: 'Training Ground A',
      maxParticipants: 15,
      currentParticipants: 12,
      status: 'upcoming',
      type: 'training',
      sportType: 'football'
    },
    {
      id: 3,
      title: 'Goalkeeper Special Training',
      trainer: 'Coach Weber',
      trainerAvatar: '/Thomas Weber.jpg',
      date: '2024-01-14',
      time: '19:00',
      duration: '75 min',
      location: 'Goalkeeper Area',
      maxParticipants: 8,
      currentParticipants: 6,
      status: 'upcoming',
      type: 'training',
      sportType: 'football'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SignedInWithRole requiredRoles={['admin', 'trainer']} redirectTo="/403">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clubConfig.activityTypePlural} Management</h1>
              <p className="text-gray-600">Schedule and manage {clubConfig.activityTypeSingular.toLowerCase()} sessions</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule {clubConfig.activityTypeSingular}
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Search ${clubConfig.activityTypePlural.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trainings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getSportTypeIcon((training.sportType as any) || 'football')}</span>
                      <CardTitle className="text-lg">{training.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={training.trainerAvatar} />
                          <AvatarFallback>{training.trainer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{training.trainer}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(training.status)}>
                    {training.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(training.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{training.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{training.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{training.currentParticipants}/{training.maxParticipants}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">{training.duration}</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {trainings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {clubConfig.activityTypePlural.toLowerCase()} scheduled</h3>
              <p className="text-gray-500 mb-4">
                Get started by scheduling your first {clubConfig.activityTypeSingular.toLowerCase()}.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule {clubConfig.activityTypeSingular}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SignedInWithRole>
  );
} 