'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Star, X } from 'lucide-react';

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

interface EvaluationModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

const evaluationCategories = [
  { id: 'OVERALL', label: 'Overall Performance' },
  { id: 'TECHNICAL', label: 'Technical Skills' },
  { id: 'TACTICAL', label: 'Tactical Understanding' },
  { id: 'PHYSICAL', label: 'Physical Condition' },
  { id: 'MENTAL', label: 'Mental Strength' },
  { id: 'ATTITUDE', label: 'Attitude & Work Ethic' },
];

export function EvaluationModal({ player, isOpen, onClose }: EvaluationModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    OVERALL: 0,
    TECHNICAL: 0,
    TACTICAL: 0,
    PHYSICAL: 0,
    MENTAL: 0,
    ATTITUDE: 0,
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating,
    }));
  };

  const renderStars = (category: string, rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(category, i + 1)}
        className="focus:outline-none"
      >
        <Star
          className={`w-6 h-6 ${
            i < rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Submitting evaluation:', {
        playerId: player.id,
        ratings,
        comment,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setRatings({
        OVERALL: 0,
        TECHNICAL: 0,
        TACTICAL: 0,
        PHYSICAL: 0,
        MENTAL: 0,
        ATTITUDE: 0,
      });
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).filter(r => r > 0).length || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Evaluate {player.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Player Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                <span className="text-gray-500">Current Rating:</span>
                <p className="font-medium">{player.averageRating.toFixed(1)}/5</p>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Rate Performance</h3>
            
            {evaluationCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {category.label}
                  </label>
                  <span className="text-sm text-gray-500">
                    {ratings[category.id]}/5
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(category.id, ratings[category.id])}
                </div>
              </div>
            ))}
          </div>

          {/* Average Rating */}
          {averageRating > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-900">Average Rating</span>
                <span className="text-2xl font-bold text-blue-600">
                  {averageRating.toFixed(1)}/5
                </span>
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <Textarea
              placeholder="Add your observations, suggestions, or notes about the player's performance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || averageRating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 