'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, Calendar, Eye } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  email: string;
  position: string;
  team: string;
  jerseyNumber: number;
  status: 'ACTIVE' | 'INACTIVE' | 'INJURED' | 'SUSPENDED';
  age: number;
  averageRating: number;
  totalEvaluations: number;
  lastEvaluation: string;
}

interface PlayerCardProps {
  player: Player;
  onEvaluate: () => void;
  getStatusColor: (status: string) => string;
}

export function PlayerCard({ player, onEvaluate, getStatusColor }: PlayerCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{player.name}</h3>
              <p className="text-xs text-gray-500">{player.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(player.status)}>
            {player.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Position:</span>
            <p className="font-medium">{player.position}</p>
          </div>
          <div>
            <span className="text-gray-500">Team:</span>
            <p className="font-medium">{player.team}</p>
          </div>
          <div>
            <span className="text-gray-500">Jersey:</span>
            <p className="font-medium">#{player.jerseyNumber}</p>
          </div>
          <div>
            <span className="text-gray-500">Age:</span>
            <p className="font-medium">{player.age}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Rating</span>
            <span className="text-sm text-gray-500">
              {player.averageRating.toFixed(1)}/5
            </span>
          </div>
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(player.averageRating)}
          </div>
          <p className="text-xs text-gray-500">
            {player.totalEvaluations} evaluations
          </p>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          Last evaluation: {new Date(player.lastEvaluation).toLocaleDateString()}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEvaluate}
          >
            <Star className="w-3 h-3 mr-1" />
            Evaluate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 