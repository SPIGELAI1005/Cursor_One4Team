'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Star,
  User,
  Calendar,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { PlayerCard } from './components/PlayerCard';
import { EvaluationModal } from './components/EvaluationModal';
import Link from 'next/link';

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

export default function PlayersPage() {
  const { getToken } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [refetchIndex, setRefetchIndex] = useState(0); // Used to trigger refetch after evaluation

  // Fetch players from API
  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch('/api/trainer/players', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = '/403';
            return;
          }
          throw new Error('Failed to fetch players');
        }
        const data = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, refetchIndex]);

  // Memoized derived data
  const teams = useMemo(() => 
    Array.from(new Set(players.map(p => p.team))).filter(Boolean), 
    [players]
  );
  
  const positions = useMemo(() => 
    Array.from(new Set(players.map(p => p.position))).filter(Boolean), 
    [players]
  );
  
  const statuses = useMemo(() => 
    ['ACTIVE', 'INACTIVE', 'INJURED', 'SUSPENDED'], 
    []
  );

  const filteredPlayers = useMemo(() => 
    players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
      const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition;
      const matchesStatus = selectedStatus === 'all' || player.status === selectedStatus;
      return matchesSearch && matchesTeam && matchesPosition && matchesStatus;
    }), 
    [players, searchTerm, selectedTeam, selectedPosition, selectedStatus]
  );

  // Memoized stats calculations
  const stats = useMemo(() => {
    const avgRating = players.length > 0 
      ? (players.reduce((sum, p) => sum + p.averageRating, 0) / players.length).toFixed(1) 
      : '0.0';
    const totalEvaluations = players.reduce((sum, p) => sum + p.totalEvaluations, 0);
    const activePlayers = players.filter(p => p.status === 'ACTIVE').length;
    
    return { avgRating, totalEvaluations, activePlayers };
  }, [players]);

  // Memoized event handlers
  const handleEvaluatePlayer = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setIsEvaluationModalOpen(true);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTeamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
  }, []);

  const handlePositionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTeam('all');
    setSelectedPosition('all');
    setSelectedStatus('all');
  }, []);

  const handleEvaluationSubmitted = useCallback(() => {
    setRefetchIndex(i => i + 1);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEvaluationModalOpen(false);
    setSelectedPlayer(null);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'INJURED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and evaluate your team players
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/dashboard/trainer/players/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Link>
          </Button>
        </div>
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
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <select
                value={selectedTeam}
                onChange={handleTeamChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={selectedPosition}
                onChange={handlePositionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Positions</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Players</p>
                <p className="text-2xl font-bold">{players.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Players</p>
                <p className="text-2xl font-bold">{stats.activePlayers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluations</p>
                <p className="text-2xl font-bold">{stats.totalEvaluations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-8 text-gray-500">Loading players...</div>
      )}
      {error && (
        <div className="text-center py-8 text-red-500">{error}</div>
      )}

      {/* Players Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEvaluate={() => handleEvaluatePlayer(player)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Evaluation Modal */}
      {selectedPlayer && (
        <EvaluationModal
          player={selectedPlayer}
          isOpen={isEvaluationModalOpen}
          onClose={handleCloseModal}
          onEvaluationSubmitted={handleEvaluationSubmitted}
        />
      )}
    </div>
  );
} 