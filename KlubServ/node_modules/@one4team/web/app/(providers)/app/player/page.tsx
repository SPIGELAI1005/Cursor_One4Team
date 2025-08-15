'use client';

import { useState, useEffect } from 'react';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { RoleGuard } from '@/app/components/auth/RoleGuard';
import { 
  ProfileHeader, 
  TrainingCard, 
  PerformanceBlock, 
  PlayerChat, 
  DocumentTile 
} from '@/components/player';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Target, 
  MessageSquare, 
  FileText, 
  Settings,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Training {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  trainingType: 'technical' | 'tactical' | 'fitness' | 'match' | 'recovery';
  isMandatory: boolean;
  description: string;
  coach: string;
  team: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface TrainingPlan {
  id: string;
  title: string;
  goal: string;
  focus: string;
  exercises: Array<{
    name: string;
    duration: number;
    description: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function PlayerDashboard() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingsResponse, trainingPlanResponse] = await Promise.all([
          fetch('/api/player/trainings'),
          fetch('/api/player/trainings/plan')
        ]);

        if (trainingsResponse.ok) {
          const trainingsData = await trainingsResponse.json();
          setTrainings(trainingsData.data);
        }

        if (trainingPlanResponse.ok) {
          const trainingPlanData = await trainingPlanResponse.json();
          setTrainingPlan(trainingPlanData.data);
        }
      } catch (error) {
        console.error('Error fetching training data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingTrainings = trainings.filter(training => {
    const trainingDate = new Date(training.date);
    const today = new Date();
    return trainingDate >= today;
  });

  const todayTrainings = trainings.filter(training => {
    const trainingDate = new Date(training.date);
    const today = new Date();
    return trainingDate.toDateString() === today.toDateString();
  });

  return (
    <SignedInWithRole requiredRoles={['player']} redirectTo="/403">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Training & Team Area</h1>
            <p className="text-gray-600 mt-1">Welcome to your personalized player dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/app/profile">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            {/* Today's Trainings */}
            {todayTrainings.length > 0 && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Today's Training Sessions
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    {todayTrainings.length} session{todayTrainings.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayTrainings.map((training) => (
                    <TrainingCard key={training.id} training={training} />
                  ))}
                </div>
              </Card>
            )}

            {/* Upcoming Trainings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Upcoming Training Schedule
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    Calendar
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : upcomingTrainings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>No upcoming training sessions</p>
                  <p className="text-sm">Your coach will schedule sessions soon</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTrainings.map((training) => (
                    <TrainingCard key={training.id} training={training} />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Training Plan Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  My Training Plan
                </h2>
                {trainingPlan && (
                  <Badge variant="outline" className="text-sm">
                    Updated {new Date(trainingPlan.updatedAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ) : trainingPlan ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{trainingPlan.title}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Goal</p>
                          <p className="text-sm text-gray-600">{trainingPlan.goal}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Focus Areas</p>
                          <p className="text-sm text-gray-600">{trainingPlan.focus}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Exercises</h4>
                      <div className="space-y-2">
                        {trainingPlan.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{exercise.name}</p>
                              <p className="text-xs text-gray-600">{exercise.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {exercise.duration} min
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {trainingPlan.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
                      <div className="flex space-x-2">
                        {trainingPlan.attachments.map((attachment) => (
                          <Button key={attachment.id} variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {attachment.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>No training plan assigned yet</p>
                  <p className="text-sm">Your coach will create a personalized plan for you</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <PerformanceBlock />
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <PlayerChat />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentTile />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/app/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Edit Profile</span>
              </Button>
            </Link>
            <Link href="/app/messages">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">All Messages</span>
              </Button>
            </Link>
            <Link href="/app/documents">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">All Documents</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Report Issue</span>
            </Button>
          </div>
        </Card>
      </div>
    </SignedInWithRole>
  );
} 