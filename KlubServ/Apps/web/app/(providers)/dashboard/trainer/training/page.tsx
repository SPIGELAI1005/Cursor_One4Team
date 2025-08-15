'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { TrainingPlanCard } from './components/TrainingPlanCard';
import { TrainingSessionCard } from './components/TrainingSessionCard';
import { CreateTrainingModal } from './components/CreateTrainingModal';

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  focus: string;
  duration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  isTemplate: boolean;
  createdAt: string;
}

interface TrainingSession {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxPlayers: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plan?: TrainingPlan;
}

export default function TrainingPage() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'plans' | 'sessions'>('plans');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // API state
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  // Fetch training plans and sessions
  useEffect(() => {
    async function fetchTrainingData() {
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        // Fetch training plans
        const plansResponse = await fetch('/api/trainer/training/plans', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (plansResponse.status === 401 || plansResponse.status === 403) {
          window.location.href = '/403';
          return;
        }
        
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch training plans');
        }
        
        const plansData = await plansResponse.json();
        setTrainingPlans(plansData);
        
        // Fetch training sessions
        const sessionsResponse = await fetch('/api/trainer/training/sessions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (sessionsResponse.status === 401 || sessionsResponse.status === 403) {
          window.location.href = '/403';
          return;
        }
        
        if (!sessionsResponse.ok) {
          throw new Error('Failed to fetch training sessions');
        }
        
        const sessionsData = await sessionsResponse.json();
        setTrainingSessions(sessionsData);
        
      } catch (err) {
        console.error('Error fetching training data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch training data');
      } finally {
        setLoading(false);
      }
    }

    fetchTrainingData();
  }, [getToken, refetchIndex]);

  const handleTrainingCreated = () => {
    setRefetchIndex(prev => prev + 1);
    setIsCreateModalOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      case 'ALL_LEVELS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalPlans: trainingPlans.length,
    templates: trainingPlans.filter(p => p.isTemplate).length,
    scheduledSessions: trainingSessions.filter(s => s.status === 'SCHEDULED').length,
    completedSessions: trainingSessions.filter(s => s.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage training plans and sessions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Training
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">{stats.totalPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Copy className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold">{stats.templates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduledSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Training Plans
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Training Sessions
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Training Plans</h2>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading training plans...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : trainingPlans.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No training plans</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first training plan to get started
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Create Training Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              trainingPlans.map((plan) => (
                <TrainingPlanCard
                  key={plan.id}
                  plan={plan}
                  getDifficultyColor={getDifficultyColor}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Training Sessions</h2>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading training sessions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : trainingSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No training sessions</h3>
                  <p className="text-gray-600 mb-4">
                    Schedule your first training session
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              trainingSessions.map((session) => (
                <TrainingSessionCard
                  key={session.id}
                  session={session}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Training Modal */}
      <CreateTrainingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        activeTab={activeTab}
        onTrainingCreated={handleTrainingCreated}
      />
    </div>
  );
} 