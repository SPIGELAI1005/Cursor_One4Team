'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Edit, Play, Pause, Trash2 } from 'lucide-react';

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

interface TrainingSessionCardProps {
  session: TrainingSession;
  getStatusColor: (status: string) => string;
}

export function TrainingSessionCard({ session, getStatusColor }: TrainingSessionCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDuration = () => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return diffMins;
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit session:', session.id);
  };

  const handleStart = () => {
    // TODO: Implement start functionality
    console.log('Start session:', session.id);
  };

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log('Cancel session:', session.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete session:', session.id);
  };

  const isUpcoming = new Date(session.startTime) > new Date();
  const isToday = new Date(session.startTime).toDateString() === new Date().toDateString();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-sm">{session.name}</h3>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{session.description}</p>
          </div>
          <Badge className={`text-xs ${getStatusColor(session.status)}`}>
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Date & Time</span>
          <div className="text-right">
            <div className="text-xs font-medium">{formatDate(session.startTime)}</div>
            <div className="text-xs text-gray-600">
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Duration</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium">{getDuration()} min</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Location</span>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium">{session.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Max Players</span>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium">{session.maxPlayers}</span>
          </div>
        </div>
        
        {session.plan && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Based on Plan</span>
            <span className="text-xs font-medium text-blue-600">{session.plan.name}</span>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          {session.status === 'SCHEDULED' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleEdit}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleStart}
              >
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
              >
                <Pause className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </>
          )}
          
          {session.status === 'IN_PROGRESS' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleEdit}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
              >
                <Pause className="w-3 h-3 mr-1" />
                End
              </Button>
            </>
          )}
          
          {(session.status === 'COMPLETED' || session.status === 'CANCELLED') && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 