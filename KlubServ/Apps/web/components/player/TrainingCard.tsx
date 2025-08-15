'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Target } from 'lucide-react';

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

interface TrainingCardProps {
  training: Training;
  onClick?: (training: Training) => void;
}

export function TrainingCard({ training, onClick }: TrainingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'tactical':
        return 'bg-purple-100 text-purple-800';
      case 'fitness':
        return 'bg-green-100 text-green-800';
      case 'match':
        return 'bg-red-100 text-red-800';
      case 'recovery':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrainingTypeIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return '⚽';
      case 'tactical':
        return '🎯';
      case 'fitness':
        return '💪';
      case 'match':
        return '🏆';
      case 'recovery':
        return '🧘';
      default:
        return '⚽';
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const trainingDate = new Date(dateString);
    return today.toDateString() === trainingDate.toDateString();
  };

  const isUpcoming = (dateString: string) => {
    const today = new Date();
    const trainingDate = new Date(dateString);
    return trainingDate > today;
  };

  return (
    <Card 
      className={`p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
        isToday(training.date) 
          ? 'border-l-blue-500 bg-blue-50' 
          : isUpcoming(training.date)
          ? 'border-l-green-500'
          : 'border-l-gray-300'
      }`}
      onClick={() => onClick?.(training)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTrainingTypeIcon(training.trainingType)}</span>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{training.title}</h3>
        </div>
        
        <div className="flex space-x-1">
          {training.isMandatory && (
            <Badge variant="destructive" className="text-xs">
              Mandatory
            </Badge>
          )}
          <Badge 
            className={`text-xs ${getTrainingTypeColor(training.trainingType)}`}
          >
            {training.trainingType}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className={isToday(training.date) ? 'font-semibold text-blue-600' : ''}>
            {formatDate(training.date)}
            {isToday(training.date) && ' (Today)'}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(training.time)} • {training.duration} min</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{training.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>Coach {training.coach}</span>
        </div>
      </div>

      {training.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {training.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">{training.team}</span>
        </div>
        
        {onClick && (
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
} 