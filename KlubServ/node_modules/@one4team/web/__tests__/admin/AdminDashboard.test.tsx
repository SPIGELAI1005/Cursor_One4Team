import { render, screen } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import AdminDashboard from '@/app/dashboard/admin/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  SignedInWithRole: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock admin components
jest.mock('@/components/admin', () => ({
  StatCard: ({ title, value }: { title: string; value: string | number }) => (
    <div data-testid="stat-card">
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  ),
  AdminNavCard: ({ title }: { title: string }) => (
    <div data-testid="nav-card">{title}</div>
  ),
  ActivityFeed: ({ activities }: { activities: any[] }) => (
    <div data-testid="activity-feed">
      {activities.map(activity => (
        <div key={activity.id}>{activity.user}</div>
      ))}
    </div>
  ),
  DashboardHeader: ({ user }: { user: any }) => (
    <div data-testid="dashboard-header">
      Welcome back, {user.firstName || 'Admin'}!
    </div>
  )
}));

describe('AdminDashboard', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://example.com/avatar.jpg',
    publicMetadata: { user_role: 'admin' }
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoaded: true
    });
  });

  it('renders admin dashboard with correct components', () => {
    render(<AdminDashboard />);
    
    // Check for main sections
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    
    // Check for stat cards
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    
    // Check for management tools section
    expect(screen.getByText('Management Tools')).toBeInTheDocument();
    
    // Check for activity feed
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
  });

  it('displays correct stats', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Open Invoices')).toBeInTheDocument();
    expect(screen.getByText('Orders Last 7 Days')).toBeInTheDocument();
  });

  it('shows management navigation cards', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Members Management')).toBeInTheDocument();
    expect(screen.getByText('Trainers & Players')).toBeInTheDocument();
    expect(screen.getByText('Contributions & Invoices')).toBeInTheDocument();
    expect(screen.getByText('Shop & Orders')).toBeInTheDocument();
  });

  it('displays quick actions', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Add New Member')).toBeInTheDocument();
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    expect(screen.getByText('Assign Role')).toBeInTheDocument();
  });

  it('shows system health status', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('API Services')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
  });
}); 