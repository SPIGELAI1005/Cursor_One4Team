import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import MemberDashboard from '../../app/app/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockDashboardData = {
  announcements: [
    {
      id: '1',
      title: 'New Training Schedule Available',
      content: 'Check out our updated training schedule for the upcoming month.',
      type: 'info' as const,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Equipment Maintenance Notice',
      content: 'The gym will be closed for equipment maintenance on January 20th.',
      type: 'warning' as const,
      createdAt: '2024-01-10T10:00:00Z',
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Morning Yoga Class',
      startTime: '2024-01-16T07:00:00Z',
      endTime: '2024-01-16T08:00:00Z',
      location: 'Studio A',
      type: 'class' as const,
      trainer: { name: 'Sarah Johnson' },
      isEnrolled: true,
    },
    {
      id: '2',
      title: 'Basketball Tournament',
      startTime: '2024-01-18T14:00:00Z',
      endTime: '2024-01-18T16:00:00Z',
      location: 'Main Court',
      type: 'event' as const,
    },
  ],
  upcomingBookings: [
    {
      id: '1',
      startTime: '2024-01-17T10:00:00Z',
      endTime: '2024-01-17T11:00:00Z',
      resource: { name: 'Tennis Court 1', type: 'court' },
      status: 'confirmed',
    },
  ],
  quickStats: {
    activeMembership: 'ACTIVE',
    classesThisWeek: 5,
    unreadMessages: 2,
    pendingPayments: 1,
    totalPendingAmount: 75.00,
  },
  member: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'ACTIVE',
    club: 'Sports Club',
  },
};

describe('MemberDashboard', () => {
  const mockGetToken = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      getToken: mockGetToken,
    });
    mockGetToken.mockResolvedValue('mock-token');
    (fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<MemberDashboard />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard data after successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('New Training Schedule Available')).toBeInTheDocument();
      expect(screen.getByText('Morning Yoga Class')).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('redirects on 401/403 status', async () => {
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(mockLocation.href).toBe('/403');
    });
  });

  it('displays correct quick stats', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument(); // Membership status
      expect(screen.getByText('5')).toBeInTheDocument(); // Classes this week
      expect(screen.getByText('2')).toBeInTheDocument(); // Unread messages
      expect(screen.getByText('1')).toBeInTheDocument(); // Pending payments
    });
  });

  it('displays announcements with correct styling', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('New Training Schedule Available')).toBeInTheDocument();
      expect(screen.getByText('Equipment Maintenance Notice')).toBeInTheDocument();
      expect(screen.getByText('info')).toBeInTheDocument();
      expect(screen.getByText('warning')).toBeInTheDocument();
    });
  });

  it('displays upcoming events with enrollment status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga Class')).toBeInTheDocument();
      expect(screen.getByText('Basketball Tournament')).toBeInTheDocument();
      expect(screen.getByText('Enrolled')).toBeInTheDocument();
      expect(screen.getByText('with Sarah Johnson')).toBeInTheDocument();
    });
  });

  it('displays recent bookings when available', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Recent Bookings')).toBeInTheDocument();
      expect(screen.getByText('Tennis Court 1')).toBeInTheDocument();
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });
  });

  it('shows empty state for no announcements', async () => {
    const emptyData = {
      ...mockDashboardData,
      announcements: [],
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('No announcements')).toBeInTheDocument();
    });
  });

  it('shows empty state for no upcoming events', async () => {
    const emptyData = {
      ...mockDashboardData,
      upcomingEvents: [],
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });
  });

  it('displays quick action buttons', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('Bookings')).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
    
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Retry'));
    expect(reloadSpy).toHaveBeenCalled();
    
    reloadSpy.mockRestore();
  });

  it('formats dates correctly', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      // Check that dates are formatted (should show "Jan 15" format)
      expect(screen.getByText(/Jan 15/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 10/)).toBeInTheDocument();
    });
  });

  it('displays club information', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });
    render(<MemberDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Here's what's happening at Sports Club today/)).toBeInTheDocument();
    });
  });
}); 