"use client";

import { useState } from 'react';
import { Calendar, CalendarEventModal, CalendarWidget } from '@/components/ui';
import { CalendarProvider, useCalendar } from '@/components/calendar/CalendarProvider';
import { CalendarEvent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, User, X } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Morning Training Session',
    description: 'Intensive morning training for advanced players',
    startTime: new Date(2024, 0, 15, 7, 0),
    endTime: new Date(2024, 0, 15, 8, 30),
    location: 'Main Field',
    type: 'training',
    capacity: 20,
    enrolled: 15,
    trainer: 'Coach Sarah Johnson',
    isEnrolled: true,
  },
  {
    id: '2',
    title: 'Youth Tournament',
    description: 'Monthly youth tournament for U16 teams',
    startTime: new Date(2024, 0, 18, 14, 0),
    endTime: new Date(2024, 0, 18, 18, 0),
    location: 'Tournament Field',
    type: 'tournament',
    capacity: 50,
    enrolled: 32,
    isEnrolled: false,
  },
  {
    id: '3',
    title: 'Swimming Class',
    description: 'Advanced swimming techniques and training',
    startTime: new Date(2024, 0, 17, 16, 0),
    endTime: new Date(2024, 0, 17, 17, 0),
    location: 'Indoor Pool',
    type: 'class',
    capacity: 12,
    enrolled: 8,
    trainer: 'Mike Chen',
    isEnrolled: false,
  },
  {
    id: '4',
    title: 'Equipment Maintenance',
    description: 'Gym equipment will be unavailable during maintenance',
    startTime: new Date(2024, 0, 20, 9, 0),
    endTime: new Date(2024, 0, 20, 17, 0),
    location: 'Weight Room',
    type: 'maintenance',
    capacity: 0,
    enrolled: 0,
    isEnrolled: false,
  },
  {
    id: '5',
    title: 'Team Meeting',
    description: 'Weekly team coordination meeting',
    startTime: new Date(2024, 0, 16, 10, 0),
    endTime: new Date(2024, 0, 16, 11, 0),
    location: 'Conference Room',
    type: 'meeting',
    capacity: 25,
    enrolled: 18,
    isEnrolled: true,
  },
  {
    id: '6',
    title: 'Friendly Match',
    description: 'Friendly match against local team',
    startTime: new Date(2024, 0, 19, 15, 0),
    endTime: new Date(2024, 0, 19, 17, 0),
    location: 'Main Field',
    type: 'match',
    capacity: 30,
    enrolled: 22,
    isEnrolled: false,
  },
];

function CalendarPageContent() {
  const { events, addEvent, updateEvent, deleteEvent, enrollInEvent, unenrollFromEvent } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleEventCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleEventSave = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEnroll = (eventId: string) => {
    enrollInEvent(eventId);
  };

  const handleUnenroll = (eventId: string) => {
    unenrollFromEvent(eventId);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'match': return 'bg-green-100 text-green-800';
      case 'tournament': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-orange-100 text-orange-800';
      case 'class': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your sports club events and activities</p>
        </div>
        <Button onClick={handleEventCreate} size="lg">
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Calendar
            events={events}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onDateSelect={(date) => console.log('Date selected:', date)}
            defaultView="week"
            showControls={true}
            showTodayButton={true}
            showCreateButton={false}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <CalendarWidget
            events={events}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onDateSelect={(date) => console.log('Date selected:', date)}
            showUpcomingEvents={true}
            maxUpcomingEvents={5}
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">
                  {events.filter(event => {
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return event.startTime >= weekStart && event.startTime <= weekEnd;
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Enrolled Events</span>
                <span className="font-semibold">
                  {events.filter(event => event.isEnrolled).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Event Info */}
              <div className="space-y-4">
                {selectedEvent.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">
                        {format(selectedEvent.startTime, 'MMM d, yyyy HH:mm')} - {format(selectedEvent.endTime, 'HH:mm')}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.trainer && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Trainer</p>
                        <p className="text-sm text-gray-600">{selectedEvent.trainer}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.capacity && (
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Capacity</p>
                        <p className="text-sm text-gray-600">
                          {selectedEvent.enrolled || 0}/{selectedEvent.capacity} enrolled
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getEventTypeColor(selectedEvent.type)}>
                    {selectedEvent.type}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEventEdit(selectedEvent);
                    setSelectedEvent(null);
                  }}
                >
                  Edit Event
                </Button>
                {selectedEvent.type !== 'maintenance' && (
                  <Button
                    variant={selectedEvent.isEnrolled ? 'outline' : 'default'}
                    onClick={() => {
                      if (selectedEvent.isEnrolled) {
                        handleUnenroll(selectedEvent.id);
                      } else {
                        handleEnroll(selectedEvent.id);
                      }
                      setSelectedEvent(null);
                    }}
                    disabled={!selectedEvent.isEnrolled && selectedEvent.capacity && (selectedEvent.enrolled || 0) >= selectedEvent.capacity}
                  >
                    {selectedEvent.isEnrolled ? 'Unenroll' : 'Enroll'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      <CalendarEventModal
        event={editingEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <CalendarProvider initialEvents={mockEvents}>
      <CalendarPageContent />
    </CalendarProvider>
  );
} 