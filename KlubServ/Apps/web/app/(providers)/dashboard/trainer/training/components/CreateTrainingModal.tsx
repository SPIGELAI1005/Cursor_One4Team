'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Clock, Users, MapPin, BookOpen } from 'lucide-react';

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

interface CreateTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'plans' | 'sessions';
}

export function CreateTrainingModal({ isOpen, onClose, activeTab }: CreateTrainingModalProps) {
  const [formType, setFormType] = useState<'plan' | 'session'>('plan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Plan form state
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    focus: '',
    duration: 60,
    difficulty: 'INTERMEDIATE' as const,
    isTemplate: false,
    drills: '',
  });

  // Session form state
  const [sessionForm, setSessionForm] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
    maxPlayers: 20,
    planId: '',
  });

  // Mock templates - replace with API call
  const templates: TrainingPlan[] = [
    {
      id: '1',
      name: 'Technical Skills Development',
      description: 'Focus on ball control, passing, and shooting techniques',
      focus: 'Technical Skills',
      duration: 90,
      difficulty: 'INTERMEDIATE',
      isTemplate: true,
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      name: 'Fitness and Conditioning',
      description: 'Endurance and strength training for players',
      focus: 'Physical Fitness',
      duration: 75,
      difficulty: 'ALL_LEVELS',
      isTemplate: true,
      createdAt: '2024-01-08',
    },
  ];

  const handlePlanFormChange = (field: string, value: any) => {
    setPlanForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSessionFormChange = (field: string, value: any) => {
    setSessionForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlanSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Creating plan:', planForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setPlanForm({
        name: '',
        description: '',
        focus: '',
        duration: 60,
        difficulty: 'INTERMEDIATE',
        isTemplate: false,
        drills: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Creating session:', sessionForm);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setSessionForm({
        name: '',
        description: '',
        startDate: '',
        startTime: '',
        endTime: '',
        location: '',
        maxPlayers: 20,
        planId: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadTemplate = (template: TrainingPlan) => {
    setPlanForm({
      name: template.name,
      description: template.description,
      focus: template.focus,
      duration: template.duration,
      difficulty: template.difficulty,
      isTemplate: false,
      drills: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {formType === 'plan' ? 'Create Training Plan' : 'Schedule Training Session'}
          </CardTitle>
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
          {/* Form Type Toggle */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setFormType('plan')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  formType === 'plan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Training Plan
              </button>
              <button
                onClick={() => setFormType('session')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  formType === 'session'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Training Session
              </button>
            </nav>
          </div>

          {formType === 'plan' && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Use Template (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => loadTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{template.focus}</span>
                          <span className="text-xs font-medium">{template.duration} min</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Plan Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name *
                  </label>
                  <Input
                    placeholder="Enter plan name"
                    value={planForm.name}
                    onChange={(e) => handlePlanFormChange('name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Area *
                  </label>
                  <Input
                    placeholder="e.g., Technical Skills, Tactical Understanding"
                    value={planForm.focus}
                    onChange={(e) => handlePlanFormChange('focus', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <Input
                    type="number"
                    min="15"
                    max="180"
                    value={planForm.duration}
                    onChange={(e) => handlePlanFormChange('duration', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={planForm.difficulty}
                    onChange={(e) => handlePlanFormChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="ALL_LEVELS">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the training plan objectives and content..."
                  value={planForm.description}
                  onChange={(e) => handlePlanFormChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drills & Exercises *
                </label>
                <Textarea
                  placeholder="Detail the specific drills, exercises, and activities for this training plan..."
                  value={planForm.drills}
                  onChange={(e) => handlePlanFormChange('drills', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isTemplate"
                  checked={planForm.isTemplate}
                  onChange={(e) => handlePlanFormChange('isTemplate', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isTemplate" className="text-sm text-gray-700">
                  Save as template for future use
                </label>
              </div>
            </div>
          )}

          {formType === 'session' && (
            <div className="space-y-6">
              {/* Session Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Name *
                  </label>
                  <Input
                    placeholder="Enter session name"
                    value={sessionForm.name}
                    onChange={(e) => handleSessionFormChange('name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <Input
                    placeholder="e.g., Main Field, Training Room"
                    value={sessionForm.location}
                    onChange={(e) => handleSessionFormChange('location', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={sessionForm.startDate}
                    onChange={(e) => handleSessionFormChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    value={sessionForm.startTime}
                    onChange={(e) => handleSessionFormChange('startTime', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <Input
                    type="time"
                    value={sessionForm.endTime}
                    onChange={(e) => handleSessionFormChange('endTime', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Players
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={sessionForm.maxPlayers}
                    onChange={(e) => handleSessionFormChange('maxPlayers', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Based on Training Plan (Optional)
                </label>
                <select
                  value={sessionForm.planId}
                  onChange={(e) => handleSessionFormChange('planId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a training plan</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Add any additional notes or instructions for this session..."
                  value={sessionForm.description}
                  onChange={(e) => handleSessionFormChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

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
              onClick={formType === 'plan' ? handlePlanSubmit : handleSessionSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : formType === 'plan' ? 'Create Plan' : 'Schedule Session'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 