'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

interface PublicEvent {
  id: string;
  title: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  description: string;
  contact: string;
  isOpenToPress: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationUrl?: string;
}

const mockPublicEvents: PublicEvent[] = [
  {
    id: '1',
    title: 'Annual Charity Tournament',
    eventType: 'Tournament',
    date: '2024-02-15',
    time: '10:00 AM - 6:00 PM',
    location: 'Main Stadium',
    description: 'Annual charity tournament supporting local community initiatives. Open to public and press coverage.',
    contact: 'events@club.com',
    isOpenToPress: true,
    maxAttendees: 500,
    currentAttendees: 320,
    registrationUrl: '/events/charity-tournament'
  },
  {
    id: '2',
    title: 'Youth Development Program Launch',
    eventType: 'Ceremony',
    date: '2024-02-20',
    time: '2:00 PM - 4:00 PM',
    location: 'Training Facility',
    description: 'Official launch of our new youth development program with special guests and demonstrations.',
    contact: 'media@club.com',
    isOpenToPress: true,
    maxAttendees: 100,
    currentAttendees: 45
  },
  {
    id: '3',
    title: 'Community Health Fair',
    eventType: 'Community',
    date: '2024-02-25',
    time: '9:00 AM - 3:00 PM',
    location: 'Club Grounds',
    description: 'Free health screenings and wellness activities for the community. Partnering with local healthcare providers.',
    contact: 'community@club.com',
    isOpenToPress: true,
    maxAttendees: 200,
    currentAttendees: 78
  },
  {
    id: '4',
    title: 'Season Opening Match',
    eventType: 'Match',
    date: '2024-03-01',
    time: '7:30 PM - 9:30 PM',
    location: 'Main Stadium',
    description: 'Season opening match with pre-game festivities and entertainment.',
    contact: 'tickets@club.com',
    isOpenToPress: true,
    maxAttendees: 5000,
    currentAttendees: 4200,
    registrationUrl: '/events/season-opening'
  },
  {
    id: '5',
    title: 'Training Facility Open House',
    eventType: 'Open House',
    date: '2024-03-10',
    time: '1:00 PM - 5:00 PM',
    location: 'Training Facility',
    description: 'Public open house showcasing our state-of-the-art training facilities and equipment.',
    contact: 'facilities@club.com',
    isOpenToPress: true,
    maxAttendees: 150,
    currentAttendees: 23
  }
];

const eventTypes = ['All', 'Tournament', 'Ceremony', 'Community', 'Match', 'Open House'];

export function PublicEventsFeed() {
  const [events, setEvents] = useState<PublicEvent[]>(mockPublicEvents);
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In real implementation, fetch public events
    // fetchPublicEvents();
  }, []);

  const filteredEvents = selectedEventType === 'All' 
    ? events 
    : events.filter(event => event.eventType === selectedEventType);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'Tournament':
        return 'bg-purple-100 text-purple-800';
      case 'Ceremony':
        return 'bg-blue-100 text-blue-800';
      case 'Community':
        return 'bg-green-100 text-green-800';
      case 'Match':
        return 'bg-red-100 text-red-800';
      case 'Open House':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendancePercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Public Events Feed</span>
            <Badge variant="outline" className="text-sm">
              {filteredEvents.length} events
            </Badge>
          </CardTitle>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getEventTypeColor(event.eventType)}
                      >
                        {event.eventType}
                      </Badge>
                      {event.isOpenToPress && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Press Welcome
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {event.description}
                </p>

                {/* Attendance */}
                {event.maxAttendees && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.currentAttendees} / {event.maxAttendees} registered
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getAttendanceColor(getAttendancePercentage(event.currentAttendees || 0, event.maxAttendees))}`}>
                      {getAttendancePercentage(event.currentAttendees || 0, event.maxAttendees)}% full
                    </span>
                  </div>
                )}

                {/* Contact and Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    Contact: <span className="font-medium">{event.contact}</span>
                  </div>
                  {event.registrationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.registrationUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No public events found for the selected type.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 