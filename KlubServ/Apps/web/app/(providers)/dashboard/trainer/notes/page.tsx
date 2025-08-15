'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  User,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Edit,
  Trash2
} from 'lucide-react';
import { NoteCard } from './components/NoteCard';
import { CreateNoteModal } from './components/CreateNoteModal';

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

export default function NotesPage() {
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPrivate, setShowPrivate] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // API state
  const [players, setPlayers] = useState<Player[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  // Fetch players and notes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        // Fetch players
        const playersResponse = await fetch('/api/trainer/players', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (playersResponse.status === 401 || playersResponse.status === 403) {
          window.location.href = '/403';
          return;
        }
        
        if (!playersResponse.ok) {
          throw new Error('Failed to fetch players');
        }
        
        const playersData = await playersResponse.json();
        setPlayers(playersData);
        
        // Fetch notes
        const notesResponse = await fetch('/api/trainer/notes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (notesResponse.status === 401 || notesResponse.status === 403) {
          window.location.href = '/403';
          return;
        }
        
        if (!notesResponse.ok) {
          throw new Error('Failed to fetch notes');
        }
        
        const notesData = await notesResponse.json();
        setNotes(notesData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getToken, refetchIndex]);

  const handleNoteCreated = () => {
    setRefetchIndex(prev => prev + 1);
    setIsCreateModalOpen(false);
  };

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.player.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlayer = selectedPlayer === 'all' || note.player.id === selectedPlayer;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags.includes(tag));
    
    const matchesPrivacy = showPrivate || !note.isPrivate;
    
    return matchesSearch && matchesPlayer && matchesTags && matchesPrivacy;
  });

  const stats = {
    totalNotes: notes.length,
    privateNotes: notes.filter(n => n.isPrivate).length,
    notesThisMonth: notes.filter(n => {
      const noteDate = new Date(n.createdAt);
      const now = new Date();
      return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
    }).length,
    uniquePlayers: new Set(notes.map(n => n.player.id)).size,
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Player Notes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track player development and maintain development records
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold">{stats.totalNotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <EyeOff className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Private Notes</p>
                <p className="text-2xl font-bold">{stats.privateNotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{stats.notesThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Players</p>
                <p className="text-2xl font-bold">{stats.uniquePlayers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Players</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privacy
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPrivate"
                  checked={showPrivate}
                  onChange={(e) => setShowPrivate(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showPrivate" className="text-sm text-gray-700">
                  Show private notes
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p>Loading notes...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12 text-red-500">
            <p>{error}</p>
            <Button onClick={() => setRefetchIndex(prev => prev + 1)} className="mt-4">
              Retry
            </Button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria, or create your first note
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => console.log('Edit note:', note.id)}
              onDelete={() => console.log('Delete note:', note.id)}
            />
          ))
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        players={players}
        allTags={allTags}
        onNoteCreated={handleNoteCreated}
      />
    </div>
  );
} 