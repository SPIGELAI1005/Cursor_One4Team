'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { BookSlotModal } from './components/BookSlotModal';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  session?: TrainingSession;
}

interface TrainingSession {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxPlayers: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export default function SchedulePage() {
  const { getToken } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // API state
  const [upcomingSessions, setUpcomingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  // Fetch upcoming sessions
  useEffect(() => {
    async function fetchUpcomingSessions() {
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        
        // Get current week's date range
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const response = await fetch(`/api/trainer/schedule?startDate=${startOfWeek.toISOString()}&endDate=${endOfWeek.toISOString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/403';
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming sessions');
        }
        
        const data = await response.json();
        setUpcomingSessions(data);
        
      } catch (err) {
        console.error('Error fetching upcoming sessions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch upcoming sessions');
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingSessions();
  }, [getToken, currentWeek, refetchIndex]);

  const handleSessionBooked = () => {
    setRefetchIndex(prev => prev + 1);
    setIsBookModalOpen(false);
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      // Check if slot conflicts with existing sessions
      const conflictingSession = upcomingSessions.find(session => {
        const sessionStart = new Date(session.startTime);
        const sessionEnd = new Date(session.endTime);
        return (
          (startTime >= sessionStart && startTime < sessionEnd) ||
          (endTime > sessionStart && endTime <= sessionEnd) ||
          (startTime <= sessionStart && endTime >= sessionEnd)
        );
      });
      
      slots.push({
        id: `${date.toDateString()}-${hour}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        available: !conflictingSession,
        session: conflictingSession,
      });
    }
    
    return slots;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setIsBookModalOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your training schedule and book time slots
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsBookModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Slot
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Week
            </Button>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                {weekDays[0].toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-sm text-gray-600">
                {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
            >
              Next Week
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div
                    key={day.toDateString()}
                    className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected(day)
                        ? 'bg-blue-100 text-blue-900'
                        : isToday(day)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-xs font-medium">{day.toLocaleDateString([], { weekday: 'short' })}</div>
                    <div className="text-sm font-bold">{day.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {getTimeSlots(selectedDate).map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      slot.available
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {slot.available ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600">Available</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-600">Booked</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {slot.session && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{slot.session.name}</h4>
                            <p className="text-xs text-gray-600">{slot.session.description}</p>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(slot.session.status)}`}>
                            {slot.session.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{slot.session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{slot.session.maxPlayers} players</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading upcoming sessions...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error: {error}
                </div>
              ) : upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">
                    Book your first training session to get started
                  </p>
                  <Button onClick={() => setIsBookModalOpen(true)}>
                    Book Session
                  </Button>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{session.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{session.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(new Date(session.startTime))}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{session.maxPlayers} players</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Slot Modal */}
      <BookSlotModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedSlot(null);
        }}
        selectedSlot={selectedSlot}
        onSessionBooked={handleSessionBooked}
      />
    </div>
  );
} 