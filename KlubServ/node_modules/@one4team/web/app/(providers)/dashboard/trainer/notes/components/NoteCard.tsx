'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, Tag, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  player: Player;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isRecentlyUpdated = () => {
    const updatedDate = new Date(note.updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isRecentlyUpdated() ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm">{note.title}</h3>
              {note.isPrivate ? (
                <EyeOff className="w-4 h-4 text-orange-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{note.content}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Player Info */}
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{note.player.name}</h4>
            <p className="text-xs text-gray-500">
              {note.player.position} • {note.player.team}
            </p>
          </div>
        </div>
        
        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created: {formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt !== note.createdAt && (
            <span>Updated: {formatTime(note.updatedAt)}</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 