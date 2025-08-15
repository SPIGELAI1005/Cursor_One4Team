"use client";

import React from 'react';
import { CalendarWidget as BaseCalendarWidget } from '@/components/ui/calendar-widget';
import { CalendarEvent } from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';

interface DashboardCalendarWidgetProps {
  events?: CalendarEvent[];
  className?: string;
  showUpcomingEvents?: boolean;
  maxUpcomingEvents?: number;
}

export function DashboardCalendarWidget({
  events = [],
  className = '',
  showUpcomingEvents = true,
  maxUpcomingEvents = 5,
}: DashboardCalendarWidgetProps) {
  const router = useRouter();

  const handleEventClick = (event: CalendarEvent) => {
    // Navigate to the full calendar page with the event selected
    router.push(`/app/calendar?event=${event.id}`);
  };

  const handleEventCreate = () => {
    // Navigate to the full calendar page with create modal open
    router.push('/app/calendar?create=true');
  };

  const handleDateSelect = (date: Date) => {
    // Navigate to the full calendar page with the date selected
    const dateString = date.toISOString().split('T')[0];
    router.push(`/app/calendar?date=${dateString}`);
  };

  return (
    <BaseCalendarWidget
      events={events}
      onEventClick={handleEventClick}
      onEventCreate={handleEventCreate}
      onDateSelect={handleDateSelect}
      className={className}
      showUpcomingEvents={showUpcomingEvents}
      maxUpcomingEvents={maxUpcomingEvents}
    />
  );
} 