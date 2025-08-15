"use client";

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { CalendarEvent } from './calendar';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';

interface CalendarWidgetProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: () => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
  showUpcomingEvents?: boolean;
  maxUpcomingEvents?: number;
}

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

const getEventTypeIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'training': return '🏃';
    case 'match': return '⚽';
    case 'tournament': return '🏆';
    case 'maintenance': return '🔧';
    case 'meeting': return '👥';
    case 'class': return '📚';
    default: return '📅';
  }
};

export function CalendarWidget({
  events = [],
  onEventClick,
  onEventCreate,
  onDateSelect,
  className = '',
  showUpcomingEvents = true,
  maxUpcomingEvents = 5,
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDates = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  const upcomingEvents = events
    .filter(event => event.startTime >= new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, maxUpcomingEvents);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mini Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <div
                  key={date.toISOString()}
                  className={`aspect-square p-1 text-center cursor-pointer rounded-md transition-colors ${
                    !isCurrentMonth ? 'text-gray-300' : 'hover:bg-gray-100'
                  } ${isToday(date) ? 'bg-blue-100 text-blue-900 font-semibold' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="text-sm">{format(date, 'd')}</div>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center mt-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={onEventCreate}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      {showUpcomingEvents && upcomingEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(event.startTime, 'MMM d')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(event.startTime, 'HH:mm')}
                      </span>
                      {event.location && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Events State */}
      {showUpcomingEvents && upcomingEvents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500 mb-4">You don't have any events scheduled for the near future.</p>
            <Button onClick={onEventCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 