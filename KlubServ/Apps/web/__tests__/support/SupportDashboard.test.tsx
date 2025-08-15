import { render, screen } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import SupportDashboard from '@/app/dashboard/support/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

// Mock the support components
jest.mock('@/components/support', () => ({
  SupportUserTable: () => <div data-testid="support-user-table">User Table</div>,
  SupportMessageViewer: () => <div data-testid="support-message-viewer">Message Viewer</div>,
  UserProfileDrawer: () => <div data-testid="user-profile-drawer">Profile Drawer</div>,
  FlaggedIssuesTable: () => <div data-testid="flagged-issues-table">Issues Table</div>,
  SupportActionBar: () => <div data-testid="support-action-bar">Action Bar</div>,
}));

// Mock the auth components
jest.mock('@/app/components/auth/SignedInWithRole', () => ({
  SignedInWithRole: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SupportDashboard', () => {
  const mockUser = {
    id: 'user_123',
    emailAddresses: [{ emailAddress: 'support@example.com' }],
    publicMetadata: {
      user_role: 'support',
    },
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoaded: true,
    });
  });

  it('renders the support dashboard with correct title', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Support Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Hello, Support Team!')).toBeInTheDocument();
  });

  it('displays read-only access badge', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Read-Only Access')).toBeInTheDocument();
  });

  it('shows overview tab by default', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('User Directory')).toBeInTheDocument();
    expect(screen.getByText('Message Center')).toBeInTheDocument();
    expect(screen.getByText('Issues Feed')).toBeInTheDocument();
    expect(screen.getByText('Support Tools')).toBeInTheDocument();
  });

  it('displays stats cards in overview', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Open Conversations')).toBeInTheDocument();
    expect(screen.getByText('Active Issues')).toBeInTheDocument();
    expect(screen.getByText('Resolved Today')).toBeInTheDocument();
  });

  it('shows recent activity section', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Recent Support Activity')).toBeInTheDocument();
    expect(screen.getByText('Password reset completed')).toBeInTheDocument();
    expect(screen.getByText('New support conversation')).toBeInTheDocument();
    expect(screen.getByText('Critical issue reported')).toBeInTheDocument();
  });

  it('shows quick actions section', () => {
    render(<SupportDashboard />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('View User Directory')).toBeInTheDocument();
    expect(screen.getByText('Message Center')).toBeInTheDocument();
    expect(screen.getByText('Issues Feed')).toBeInTheDocument();
    expect(screen.getByText('Support Tools')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: false,
    });

    render(<SupportDashboard />);
    
    // Should not render anything while loading
    expect(screen.queryByText('Support Dashboard')).not.toBeInTheDocument();
  });

  it('handles no user state', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: true,
    });

    render(<SupportDashboard />);
    
    // Should not render anything when no user
    expect(screen.queryByText('Support Dashboard')).not.toBeInTheDocument();
  });
}); 