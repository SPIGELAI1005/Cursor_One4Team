import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerDashboard from '@/app/app/player/page';

// Mock the auth components
jest.mock('@/components/auth/SignedInWithRole', () => {
  return function MockSignedInWithRole({ children, requiredRoles }: any) {
    return <div data-testid="signed-in-with-role">{children}</div>;
  };
});

jest.mock('@/components/auth/RoleGuard', () => {
  return function MockRoleGuard({ children, allowedRoles }: any) {
    return <div data-testid="role-guard">{children}</div>;
  };
});

// Mock the player components
jest.mock('@/components/player', () => ({
  ProfileHeader: () => <div data-testid="profile-header">Profile Header</div>,
  TrainingCard: ({ training }: any) => <div data-testid="training-card">{training.title}</div>,
  PerformanceBlock: () => <div data-testid="performance-block">Performance Block</div>,
  PlayerChat: () => <div data-testid="player-chat">Player Chat</div>,
  DocumentTile: () => <div data-testid="document-tile">Document Tile</div>,
}));

// Mock fetch
global.fetch = jest.fn();

describe('PlayerDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the player dashboard with correct title', () => {
    render(<PlayerDashboard />);
    
    expect(screen.getByText('My Training & Team Area')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your personalized player dashboard')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<PlayerDashboard />);
    
    expect(screen.getByTestId('signed-in-with-role')).toBeInTheDocument();
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
  });

  it('renders tab navigation with all expected tabs', () => {
    render(<PlayerDashboard />);
    
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    render(<PlayerDashboard />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('All Messages')).toBeInTheDocument();
    expect(screen.getByText('All Documents')).toBeInTheDocument();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
  });

  it('renders settings button in header', () => {
    render(<PlayerDashboard />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to simulate loading
    );

    render(<PlayerDashboard />);
    
    // Check for loading skeleton elements
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('handles empty training data gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null })
    });

    render(<PlayerDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No upcoming training sessions')).toBeInTheDocument();
    });
  });

  it('displays today\'s training sessions when available', async () => {
    const mockTrainings = [
      {
        id: '1',
        title: 'Technical Training',
        date: new Date().toISOString().split('T')[0],
        time: '16:00',
        duration: 90,
        location: 'Main Field',
        trainingType: 'technical',
        isMandatory: true,
        description: 'Ball control exercises',
        coach: 'Coach Smith',
        team: 'U14 Boys',
        status: 'scheduled'
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockTrainings })
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null })
    });

    render(<PlayerDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Today's Training Sessions")).toBeInTheDocument();
      expect(screen.getByText('Technical Training')).toBeInTheDocument();
    });
  });

  it('displays training plan when available', async () => {
    const mockTrainingPlan = {
      id: '1',
      title: 'U14 Development Plan',
      goal: 'Improve technical skills',
      focus: 'Ball control and passing',
      exercises: [
        {
          name: 'Warm-up',
          duration: 15,
          description: 'Dynamic stretching'
        }
      ],
      attachments: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockTrainingPlan })
    });

    render(<PlayerDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('My Training Plan')).toBeInTheDocument();
      expect(screen.getByText('U14 Development Plan')).toBeInTheDocument();
    });
  });

  it('shows empty state for training plan when not available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null })
    });

    render(<PlayerDashboard />);
    
    // Switch to training tab
    const trainingTab = screen.getByText('Training');
    trainingTab.click();
    
    await waitFor(() => {
      expect(screen.getByText('No training plan assigned yet')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<PlayerDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No upcoming training sessions')).toBeInTheDocument();
    });
  });
}); 