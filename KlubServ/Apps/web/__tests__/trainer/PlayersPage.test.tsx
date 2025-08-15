import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import PlayersPage from '../../app/dashboard/trainer/players/page';

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

const mockPlayers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    position: 'Forward',
    team: 'Senior Team',
    jerseyNumber: 10,
    status: 'ACTIVE' as const,
    age: 25,
    averageRating: 4.2,
    totalEvaluations: 5,
    lastEvaluation: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    position: 'Midfielder',
    team: 'Senior Team',
    jerseyNumber: 8,
    status: 'ACTIVE' as const,
    age: 23,
    averageRating: 4.5,
    totalEvaluations: 3,
    lastEvaluation: '2024-01-14T16:45:00Z',
  },
];

describe('PlayersPage', () => {
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
    
    render(<PlayersPage />);
    
    expect(screen.getByText('Loading players...')).toBeInTheDocument();
  });

  it('renders players after successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
      expect(screen.getByText('Sarah Miller')).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<PlayersPage />);

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

    render(<PlayersPage />);

    await waitFor(() => {
      expect(mockLocation.href).toBe('/403');
    });
  });

  it('filters players by search term', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search players...');
    fireEvent.change(searchInput, { target: { value: 'Alex' } });

    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Sarah Miller')).not.toBeInTheDocument();
  });

  it('filters players by team', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    });

    const teamSelect = screen.getByDisplayValue('All Teams');
    fireEvent.change(teamSelect, { target: { value: 'Senior Team' } });

    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sarah Miller')).toBeInTheDocument();
  });

  it('displays correct stats', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total players
      expect(screen.getByText('4.3')).toBeInTheDocument(); // Average rating
      expect(screen.getByText('2')).toBeInTheDocument(); // Active players
      expect(screen.getByText('8')).toBeInTheDocument(); // Total evaluations
    });
  });

  it('opens evaluation modal when evaluate button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    });

    const evaluateButtons = screen.getAllByText('Evaluate');
    fireEvent.click(evaluateButtons[0]);

    // Modal should be open
    expect(screen.getByText('Rate Performance')).toBeInTheDocument();
  });

  it('shows empty state when no players match filters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    render(<PlayersPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search players...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentPlayer' } });

    expect(screen.getByText('No players found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
  });
}); 