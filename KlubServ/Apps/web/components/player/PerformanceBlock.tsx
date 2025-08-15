'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Calendar, User, Target } from 'lucide-react';

interface Evaluation {
  id: string;
  playerId: string;
  trainerId: string;
  trainerName: string;
  date: string;
  rating: number;
  category: 'technical' | 'tactical' | 'fitness' | 'mental' | 'overall';
  comment: string;
  strengths: string[];
  areasForImprovement: string[];
  goals: string[];
  nextEvaluationDate: string;
  status: 'completed' | 'pending';
}

interface PerformanceStats {
  totalEvaluations: number;
  averageRating: number;
  latestRating: number;
  categories: {
    technical: number;
    tactical: number;
    fitness: number;
  };
  progress: {
    lastMonth: number;
    lastQuarter: number;
    overall: number;
  };
}

export function PerformanceBlock() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evaluationsResponse, statsResponse] = await Promise.all([
          fetch('/api/player/evaluations'),
          fetch('/api/player/evaluations/stats')
        ]);

        if (evaluationsResponse.ok) {
          const evaluationsData = await evaluationsResponse.json();
          setEvaluations(evaluationsData.data);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'tactical':
        return 'bg-purple-100 text-purple-800';
      case 'fitness':
        return 'bg-green-100 text-green-800';
      case 'mental':
        return 'bg-yellow-100 text-yellow-800';
      case 'overall':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return '⚽';
      case 'tactical':
        return '🎯';
      case 'fitness':
        return '💪';
      case 'mental':
        return '🧠';
      case 'overall':
        return '⭐';
      default:
        return '📊';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  const displayedEvaluations = showAll ? evaluations : evaluations.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {stats && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Performance Overview
            </h2>
            <Badge variant="outline" className="text-sm">
              {stats.totalEvaluations} evaluations
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.latestRating}</div>
              <div className="text-sm text-gray-600">Latest Rating</div>
              <div className="flex justify-center mt-1">
                {renderStars(stats.latestRating)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.progress.overall}</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <Progress value={stats.progress.overall * 20} className="mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Technical</div>
              <div className="text-lg font-bold text-blue-600">{stats.categories.technical}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-purple-900">Tactical</div>
              <div className="text-lg font-bold text-purple-600">{stats.categories.tactical}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-900">Fitness</div>
              <div className="text-lg font-bold text-green-600">{stats.categories.fitness}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Evaluations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Recent Evaluations
          </h2>
          {evaluations.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All (${evaluations.length})`}
            </Button>
          )}
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>No evaluations yet</p>
            <p className="text-sm">Your coach will provide feedback after training sessions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(evaluation.category)}</span>
                    <Badge className={getCategoryColor(evaluation.category)}>
                      {evaluation.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(evaluation.date)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Coach {evaluation.trainerName}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(evaluation.rating)}
                  <span className="text-sm text-gray-600">
                    Rating: {evaluation.rating}/5
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{evaluation.comment}</p>

                {evaluation.strengths.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Strengths:</div>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.areasForImprovement.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Areas for Improvement:</div>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.areasForImprovement.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.goals.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Goals:</div>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.goals.map((goal, index) => (
                        <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
} 