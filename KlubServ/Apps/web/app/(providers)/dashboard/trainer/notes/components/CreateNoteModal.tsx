'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, User, Tag, Eye, EyeOff } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
}

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  allTags: string[];
  onNoteCreated?: () => void;
}

export function CreateNoteModal({ isOpen, onClose, players, allTags, onNoteCreated }: CreateNoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    playerId: '',
    title: '',
    content: '',
    tags: [] as string[],
    isPrivate: false,
  });
  const [newTag, setNewTag] = useState('');

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Creating note:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        playerId: '',
        title: '',
        content: '',
        tags: [],
        isPrivate: false,
      });
      setNewTag('');
      onClose();
      onNoteCreated?.(); // Call the new prop
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlayer = players.find(p => p.id === formData.playerId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create Player Note</CardTitle>
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
          {/* Player Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player *
            </label>
            <select
              value={formData.playerId}
              onChange={(e) => handleFormChange('playerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.position} - {player.team})
                </option>
              ))}
            </select>
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Title *
            </label>
            <Input
              placeholder="Enter note title"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
            />
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Content *
            </label>
            <textarea
              placeholder="Write your observations, notes, or development feedback..."
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFormChange('content', e.target.value)}
              rows={6}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            
            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add new tag"
                value={newTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Selected tags:</span>
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => handleFormChange('isPrivate', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700 flex items-center">
              {formData.isPrivate ? (
                <EyeOff className="w-4 h-4 mr-1 text-orange-500" />
              ) : (
                <Eye className="w-4 h-4 mr-1 text-green-500" />
              )}
              Private note (only visible to you)
            </label>
          </div>

          {/* Note Preview */}
          {selectedPlayer && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Note Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedPlayer.name}</h4>
                    <p className="text-gray-500">
                      {selectedPlayer.position} • {selectedPlayer.team}
                    </p>
                  </div>
                </div>
                
                {formData.title && (
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                )}
                
                {formData.content && (
                  <div>
                    <span className="text-gray-600">Content:</span>
                    <p className="mt-1">{formData.content}</p>
                  </div>
                )}
                
                {formData.tags.length > 0 && (
                  <div>
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.playerId || !formData.title || !formData.content}
            >
              {isSubmitting ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 