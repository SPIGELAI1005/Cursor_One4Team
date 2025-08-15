import { render, screen, waitFor } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import OfficialDashboard from '@/app/dashboard/official/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

// Mock the SignedInWithRole component
jest.mock('@/app/components/auth/SignedInWithRole', () => {
  return function MockSignedInWithRole({ children, requiredRoles }: any) {
    return <div data-testid="signed-in-with-role">{children}</div>;
  };
});

// Mock the DashboardLayout component
jest.mock('@/components/dashboard', () => ({
  DashboardLayout: ({ children, role, stats, quickActions }: any) => (
    <div data-testid="dashboard-layout" data-role={role}>
      <div data-testid="stats-count">{stats.length}</div>
      <div data-testid="quick-actions-count">{quickActions.length}</div>
      {children}
    </div>
  ),
}));

describe('OfficialDashboard', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    emailAddresses: [{ emailAddress: 'john.doe@example.com' }],
    publicMetadata: {
      user_role: 'official',
    },
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoaded: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the official dashboard with correct role', () => {
    render(<OfficialDashboard />);

    expect(screen.getByTestId('signed-in-with-role')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-role', 'official');
  });

  it('displays correct stats count', () => {
    render(<OfficialDashboard />);

    expect(screen.getByTestId('stats-count')).toHaveTextContent('4');
  });

  it('displays correct quick actions count', () => {
    render(<OfficialDashboard />);

    expect(screen.getByTestId('quick-actions-count')).toHaveTextContent('4');
  });

  it('shows welcome message with user name', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText(/Welcome, John – Club Official/)).toBeInTheDocument();
  });

  it('displays read-only access badge', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText(/Read-only Access/)).toBeInTheDocument();
  });

  it('shows internal announcements section', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Internal Club Announcements')).toBeInTheDocument();
    expect(screen.getByText('Updated Hygiene Policy')).toBeInTheDocument();
    expect(screen.getByText('Board Meeting Results')).toBeInTheDocument();
  });

  it('shows staff directory section', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Staff Directory')).toBeInTheDocument();
    expect(screen.getByText('Dr. Hans Müller')).toBeInTheDocument();
    expect(screen.getByText('Club President')).toBeInTheDocument();
  });

  it('shows upcoming events section', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Upcoming Club Events')).toBeInTheDocument();
    expect(screen.getByText('Board Meeting')).toBeInTheDocument();
    expect(screen.getByText('Annual Club Assembly')).toBeInTheDocument();
  });

  it('shows club documents section', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Club Documents')).toBeInTheDocument();
    expect(screen.getByText('Club Constitution 2024')).toBeInTheDocument();
    expect(screen.getByText('Financial Report Q4 2023')).toBeInTheDocument();
  });

  it('shows contact and support section', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Contact & Support')).toBeInTheDocument();
    expect(screen.getByText('Club Admin Support')).toBeInTheDocument();
    expect(screen.getByText('admin@club.com')).toBeInTheDocument();
  });

  it('displays download buttons for documents', () => {
    render(<OfficialDashboard />);

    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBeGreaterThan(0);
  });

  it('shows request access and report issue buttons', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('Request Access Change')).toBeInTheDocument();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: false,
    });

    render(<OfficialDashboard />);

    expect(screen.queryByTestId('dashboard-layout')).not.toBeInTheDocument();
  });

  it('handles no user state correctly', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: true,
    });

    render(<OfficialDashboard />);

    expect(screen.queryByTestId('dashboard-layout')).not.toBeInTheDocument();
  });

  it('displays current date in welcome message', () => {
    render(<OfficialDashboard />);

    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    expect(screen.getByText(new RegExp(currentDate))).toBeInTheDocument();
  });

  it('shows correct event details with time and location', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText(/Club Office - Conference Room/)).toBeInTheDocument();
    expect(screen.getByText(/Main Hall/)).toBeInTheDocument();
  });

  it('displays document information correctly', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('2.3 MB')).toBeInTheDocument();
    expect(screen.getByText('Updated club constitution and bylaws')).toBeInTheDocument();
  });

  it('shows staff contact information', () => {
    render(<OfficialDashboard />);

    expect(screen.getByText('president@club.com')).toBeInTheDocument();
    expect(screen.getByText('+49 89 123 4567')).toBeInTheDocument();
  });
}); 