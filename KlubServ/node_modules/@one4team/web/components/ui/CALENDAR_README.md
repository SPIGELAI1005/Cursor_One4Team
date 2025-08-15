# Calendar System Documentation

## Overview

The One4Team calendar system provides a comprehensive, standardized solution for managing sports club events and activities. It consists of multiple components that can be used independently or together to create a complete calendar experience.

## Components

### 1. Calendar (`calendar.tsx`)

The main calendar component with multiple view modes and full event management capabilities.

**Features:**
- Multiple view modes: Day, Week, Month, Agenda
- Event management (create, edit, delete)
- Navigation controls
- Responsive design
- Color-coded event types

**Props:**
```typescript
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
```

**Usage:**
```tsx
import { Calendar } from '@/components/ui/calendar';

<Calendar
  events={events}
  onEventClick={handleEventClick}
  onEventCreate={handleEventCreate}
  defaultView="week"
  showControls={true}
/>
```

### 2. CalendarEventModal (`calendar-event-modal.tsx`)

A modal component for creating and editing calendar events with form validation.

**Features:**
- Form validation
- Event type selection
- Date/time picker
- Location and capacity management
- Trainer assignment

**Props:**
```typescript
interface CalendarEventModalProps {
  event?: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
}
```

**Usage:**
```tsx
import { CalendarEventModal } from '@/components/ui/calendar-event-modal';

<CalendarEventModal
  event={selectedEvent}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleEventSave}
  onDelete={handleEventDelete}
/>
```

### 3. CalendarWidget (`calendar-widget.tsx`)

A compact calendar widget for embedding in dashboard pages.

**Features:**
- Mini calendar view
- Upcoming events list
- Quick event creation
- Responsive design

**Props:**
```typescript
interface CalendarWidgetProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: () => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
  showUpcomingEvents?: boolean;
  maxUpcomingEvents?: number;
}
```

**Usage:**
```tsx
import { CalendarWidget } from '@/components/ui/calendar-widget';

<CalendarWidget
  events={events}
  onEventClick={handleEventClick}
  onEventCreate={handleEventCreate}
  showUpcomingEvents={true}
  maxUpcomingEvents={5}
/>
```

### 4. CalendarProvider (`CalendarProvider.tsx`)

Context provider for managing calendar state across the application.

**Features:**
- Centralized event management
- Event CRUD operations
- Enrollment management
- Date filtering utilities

**Usage:**
```tsx
import { CalendarProvider, useCalendar } from '@/components/calendar/CalendarProvider';

function App() {
  return (
    <CalendarProvider initialEvents={mockEvents}>
      <CalendarPage />
    </CalendarProvider>
  );
}

function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();
  // Use calendar functions
}
```

## Event Types

The calendar system supports the following event types:

- **training**: Training sessions
- **match**: Sports matches
- **tournament**: Tournaments and competitions
- **maintenance**: Equipment or facility maintenance
- **meeting**: Team or staff meetings
- **class**: Educational classes or workshops

Each event type has its own color coding and icon for easy identification.

## Event Interface

```typescript
interface CalendarEvent {
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
```

## Integration Examples

### 1. Full Calendar Page

```tsx
"use client";

import { Calendar, CalendarEventModal } from '@/components/ui';
import { CalendarProvider, useCalendar } from '@/components/calendar/CalendarProvider';

function CalendarPageContent() {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Calendar
        events={events}
        onEventCreate={() => setIsModalOpen(true)}
        defaultView="week"
      />
      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
      />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarPageContent />
    </CalendarProvider>
  );
}
```

### 2. Dashboard Widget

```tsx
import { CalendarWidget } from '@/components/ui/calendar-widget';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Main dashboard content */}
      </div>
      <div>
        <CalendarWidget
          events={events}
          onEventClick={handleEventClick}
          onEventCreate={handleEventCreate}
        />
      </div>
    </div>
  );
}
```

### 3. Trainer Dashboard Integration

```tsx
import { DashboardCalendarWidget } from '@/app/dashboard/components';

function TrainerDashboard() {
  return (
    <CalendarProvider initialEvents={trainerEvents}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Trainer-specific content */}
        </div>
        <div>
          <DashboardCalendarWidget
            events={events}
            showUpcomingEvents={true}
            maxUpcomingEvents={3}
          />
        </div>
      </div>
    </CalendarProvider>
  );
}
```

## Styling

The calendar components use Tailwind CSS and follow the One4Team design system:

- **Colors**: Consistent with One4Team branding (#1757FF blue)
- **Typography**: Inter font family
- **Spacing**: Tailwind spacing scale
- **Components**: shadcn/ui components for consistency

## Event Type Colors

- Training: Blue (`bg-blue-100 text-blue-800`)
- Match: Green (`bg-green-100 text-green-800`)
- Tournament: Purple (`bg-purple-100 text-purple-800`)
- Maintenance: Red (`bg-red-100 text-red-800`)
- Meeting: Orange (`bg-orange-100 text-orange-800`)
- Class: Indigo (`bg-indigo-100 text-indigo-800`)

## Dependencies

- `date-fns`: Date manipulation and formatting
- `lucide-react`: Icons
- `@/components/ui/*`: shadcn/ui components

## Best Practices

1. **Always wrap calendar components with CalendarProvider** when using calendar functions
2. **Use the DashboardCalendarWidget** for dashboard integrations
3. **Handle event clicks** to show event details or edit modals
4. **Validate event data** before saving
5. **Use consistent event types** across the application
6. **Implement proper error handling** for event operations

## Future Enhancements

- Drag and drop event rescheduling
- Recurring events
- Event notifications
- Calendar sharing
- Integration with external calendar services
- Advanced filtering and search
- Event templates
- Bulk event operations 