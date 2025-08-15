"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval, addMonths, subMonths } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'training' | 'match' | 'tournament' | 'maintenance' | 'meeting' | 'class';
  capacity?: number;
  enrolled?: number;
  trainer?: string;
  color?: string;
  isEnrolled?: boolean;
}

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: () => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  defaultView?: CalendarView;
  className?: string;
  showControls?: boolean;
  showTodayButton?: boolean;
  showCreateButton?: boolean;
}

const getEventTypeColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'match': return 'bg-green-100 text-green-800 border-green-200';
    case 'tournament': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
    case 'meeting': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'class': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

export function Calendar({
  events = [],
  onEventClick,
  onEventCreate,
  onEventEdit,
  onEventDelete,
  onDateSelect,
  defaultView = 'week',
  className = '',
  showControls = true,
  showTodayButton = true,
  showCreateButton = true,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(defaultView);

  const weekDates = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const monthWeeks = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  const getEventsForDateRange = (start: Date, end: Date) => {
    return events.filter(event => 
      event.startTime >= start && event.startTime <= end
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
    if (view === 'day') {
      setCurrentDate(date);
    }
  };

  const renderDayView = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 24 }, (_, hour) => {
          const hourDate = new Date(currentDate);
          hourDate.setHours(hour, 0, 0, 0);
          const hourEvents = events.filter(event => 
            event.startTime.getDate() === currentDate.getDate() &&
            event.startTime.getHours() === hour
          );
          
          return (
            <div key={hour} className="flex border-b border-gray-200 min-h-[60px]">
              <div className="w-20 p-2 text-sm text-gray-500 border-r border-gray-200">
                {format(hourDate, 'HH:mm')}
              </div>
              <div className="flex-1 p-2">
                {hourEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-md mb-1 cursor-pointer ${getEventTypeColor(event.type)}`}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs opacity-75">
                      {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1">
        <div className="p-2 text-center text-sm font-medium text-gray-500"></div>
        {weekDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`p-2 text-center cursor-pointer rounded-md transition-colors ${
              isToday(date) ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleDateClick(date)}
          >
            <div className="text-sm font-medium">{format(date, 'EEE')}</div>
            <div className={`text-lg font-bold ${isToday(date) ? 'text-blue-900' : 'text-gray-900'}`}>
              {format(date, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 min-h-[600px]">
        <div className="space-y-1">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="h-6 text-xs text-gray-500 text-right pr-2">
              {hour > 0 && hour < 24 ? format(new Date().setHours(hour), 'HH:mm') : ''}
            </div>
          ))}
        </div>
        
        {weekDates.map((date) => {
          const dayEvents = getEventsForDate(date);
          return (
            <div key={date.toISOString()} className="border border-gray-200 rounded-md p-1">
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-1 rounded text-xs cursor-pointer ${getEventTypeColor(event.type)}`}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="opacity-75 truncate">
                      {format(event.startTime, 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="space-y-4">
      {monthWeeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1">
          {week.map((date) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] p-2 border border-gray-200 rounded-md cursor-pointer transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'
                } ${isToday(date) ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday(date) ? 'text-blue-900' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`p-1 rounded text-xs cursor-pointer ${getEventTypeColor(event.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <div className="truncate">{event.title}</div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(event => event.startTime >= new Date())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 20);

    return (
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{format(event.startTime, 'MMM d, yyyy')}</span>
                      <span>{format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}</span>
                      {event.location && <span>{event.location}</span>}
                      {event.capacity && (
                        <span>{event.enrolled || 0}/{event.capacity} enrolled</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderViewContent = () => {
    switch (view) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderWeekView();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy')
                : view === 'week'
                ? `${format(weekDates[0], 'MMM d')} - ${format(weekDates[6], 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy')
              }
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {showTodayButton && (
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
            )}
            <div className="flex rounded-md border">
              {(['day', 'week', 'month', 'agenda'] as CalendarView[]).map((viewOption) => (
                <Button
                  key={viewOption}
                  variant={view === viewOption ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView(viewOption)}
                  className="rounded-none first:rounded-l-md last:rounded-r-md"
                >
                  {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                </Button>
              ))}
            </div>
            {showCreateButton && onEventCreate && (
              <Button onClick={onEventCreate} className="ml-2">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {renderViewContent()}
        </CardContent>
      </Card>
    </div>
  );
} 