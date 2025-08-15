'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Edit, Copy, Trash2, Star } from 'lucide-react';

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

interface TrainingPlanCardProps {
  plan: TrainingPlan;
  getDifficultyColor: (difficulty: string) => string;
}

export function TrainingPlanCard({ plan, getDifficultyColor }: TrainingPlanCardProps) {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit plan:', plan.id);
  };

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copy plan:', plan.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete plan:', plan.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm">{plan.name}</h3>
              {plan.isTemplate && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{plan.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Focus Area</span>
          <span className="text-xs font-medium">{plan.focus}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Duration</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium">{plan.duration} min</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Difficulty</span>
          <Badge className={`text-xs ${getDifficultyColor(plan.difficulty)}`}>
            {plan.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Created</span>
          <span className="text-xs text-gray-600">
            {new Date(plan.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex space-x-2 pt-2">
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
            onClick={handleCopy}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 