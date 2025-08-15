import { render, screen } from '@testing-library/react';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import PressNewsDashboardPage from '@/app/dashboard/press-news/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'John',
      lastName: 'Doe',
      publicMetadata: {
        user_role: 'press-news',
        agency_name: 'Test Media Outlet'
      }
    },
    isLoaded: true
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Press News Dashboard', () => {
  it('renders press news dashboard for press-news users', () => {
    render(
      <SignedInWithRole requiredRoles={['press-news']} redirectTo="/403">
        <PressNewsDashboardPage />
      </SignedInWithRole>
    );

    // Check for main dashboard elements
    expect(screen.getByText('Press & News Portal')).toBeInTheDocument();
    expect(screen.getByText('Club News Center')).toBeInTheDocument();
    expect(screen.getByText('Press Materials Download')).toBeInTheDocument();
    expect(screen.getByText('Visibility Statistics')).toBeInTheDocument();
    expect(screen.getByText('Sponsored Content')).toBeInTheDocument();
    expect(screen.getByText('Contact Club Media Officer')).toBeInTheDocument();
    expect(screen.getByText('Public Events Feed')).toBeInTheDocument();
  });

  it('displays welcome message with user info', () => {
    render(
      <SignedInWithRole requiredRoles={['press-news']} redirectTo="/403">
        <PressNewsDashboardPage />
      </SignedInWithRole>
    );

    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Media Outlet')).toBeInTheDocument();
    expect(screen.getByText('External Contributor')).toBeInTheDocument();
  });
}); 