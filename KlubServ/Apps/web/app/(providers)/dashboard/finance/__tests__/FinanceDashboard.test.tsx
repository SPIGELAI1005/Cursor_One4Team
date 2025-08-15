import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import FinanceDashboard from '@/app/dashboard/finance/page';
import { ContributionPlanList } from '@/app/dashboard/finance/components/ContributionPlanList';
import { InvoiceTable } from '@/app/dashboard/finance/components/InvoiceTable';
import { PaymentGraph } from '@/app/dashboard/finance/components/PaymentGraph';
import { IntegrationStatus } from '@/app/dashboard/finance/components/IntegrationStatus';
import { FinanceReportList } from '@/app/dashboard/finance/components/FinanceReportList';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

// Mock SignedInWithRole component
jest.mock('@/app/components/auth/SignedInWithRole', () => ({
  SignedInWithRole: ({ children, requiredRoles }: any) => {
    const mockUser = {
      firstName: 'Finance',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'finance@club.com' }],
    };
    
    // Check if user has finance role (mock implementation)
    const hasFinanceRole = true; // Mock that user has finance role
    
    if (hasFinanceRole && requiredRoles.includes('finance')) {
      return <div data-testid="signed-in-with-role">{children}</div>;
    }
    return <div data-testid="access-denied">Access Denied</div>;
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('Finance Dashboard', () => {
  const mockUser = {
    firstName: 'Finance',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'finance@club.com' }],
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoaded: true,
    });
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Finance Dashboard Page', () => {
    it('renders the finance dashboard with correct title', () => {
      render(<FinanceDashboard />);
      
      expect(screen.getByText('Hello, Finance – Finance Role')).toBeInTheDocument();
      expect(screen.getByText('Finance Access Only')).toBeInTheDocument();
    });

    it('displays quick stats cards', () => {
      render(<FinanceDashboard />);
      
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Pending Invoices')).toBeInTheDocument();
      expect(screen.getByText('Active Plans')).toBeInTheDocument();
      expect(screen.getByText('Monthly Growth')).toBeInTheDocument();
    });

    it('shows finance toolbar', () => {
      render(<FinanceDashboard />);
      
      expect(screen.getByText('Generate Report')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('displays all main sections', () => {
      render(<FinanceDashboard />);
      
      expect(screen.getByText('Contribution Plans')).toBeInTheDocument();
      expect(screen.getByText('Payment Integration')).toBeInTheDocument();
      expect(screen.getByText('Invoice Management')).toBeInTheDocument();
      expect(screen.getByText('Payments Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Financial Reports')).toBeInTheDocument();
    });

    it('handles loading state', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: false,
      });

      render(<FinanceDashboard />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('handles no user state', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<FinanceDashboard />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('ContributionPlanList Component', () => {
    it('renders loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<ContributionPlanList />);
      
      expect(screen.getByText('Loading contribution plans...')).toBeInTheDocument();
    });

    it('displays contribution plans after successful API call', async () => {
      const mockPlans = [
        {
          id: '1',
          title: 'Youth Membership',
          amount: 29.99,
          frequency: 'MONTHLY',
          status: 'ACTIVE',
          assignedTo: ['youth', 'students'],
          memberCount: 156,
          description: 'Monthly membership for youth members',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPlans }),
      });

      render(<ContributionPlanList />);

      await waitFor(() => {
        expect(screen.getByText('Youth Membership')).toBeInTheDocument();
        expect(screen.getByText('€29.99')).toBeInTheDocument();
        expect(screen.getByText('Monthly')).toBeInTheDocument();
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      });
    });

    it('shows empty state when no plans exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      render(<ContributionPlanList />);

      await waitFor(() => {
        expect(screen.getByText('No contribution plans set up')).toBeInTheDocument();
        expect(screen.getByText('Create First Plan')).toBeInTheDocument();
      });
    });

    it('handles API error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      render(<ContributionPlanList />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load contribution plans')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('handles add plan button click', async () => {
      const mockPlans = [];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPlans }),
      });

      render(<ContributionPlanList />);

      await waitFor(() => {
        const addButton = screen.getByText('Create First Plan');
        fireEvent.click(addButton);
      });
    });
  });

  describe('InvoiceTable Component', () => {
    it('renders loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<InvoiceTable />);
      
      expect(screen.getByText('Loading invoices...')).toBeInTheDocument();
    });

    it('displays invoices after successful API call', async () => {
      const mockInvoices = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          amount: 49.99,
          status: 'PENDING',
          dueDate: '2024-12-31T00:00:00Z',
          description: 'Monthly membership fee',
          createdAt: '2024-12-01T00:00:00Z',
          updatedAt: '2024-12-01T00:00:00Z',
          member: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: mockInvoices,
          pagination: { page: 1, limit: 20, total: 1, pages: 1 }
        }),
      });

      render(<InvoiceTable />);

      await waitFor(() => {
        expect(screen.getByText('INV-2024-001')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('€49.99')).toBeInTheDocument();
        expect(screen.getByText('PENDING')).toBeInTheDocument();
      });
    });

    it('shows empty state when no invoices exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }),
      });

      render(<InvoiceTable />);

      await waitFor(() => {
        expect(screen.getByText('No invoices found')).toBeInTheDocument();
        expect(screen.getByText('Invoices will appear here once they are created.')).toBeInTheDocument();
      });
    });

    it('handles search functionality', async () => {
      const mockInvoices = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          amount: 49.99,
          status: 'PENDING',
          dueDate: '2024-12-31T00:00:00Z',
          member: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: mockInvoices,
          pagination: { page: 1, limit: 20, total: 1, pages: 1 }
        }),
      });

      render(<InvoiceTable />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search by invoice number/);
        fireEvent.change(searchInput, { target: { value: 'INV-2024-001' } });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=INV-2024-001'),
          expect.any(Object)
        );
      });
    });

    it('handles status filtering', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }),
      });

      render(<InvoiceTable />);

      await waitFor(() => {
        const statusFilter = screen.getByDisplayValue('All Status');
        fireEvent.change(statusFilter, { target: { value: 'PENDING' } });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('status=PENDING'),
          expect.any(Object)
        );
      });
    });
  });

  describe('PaymentGraph Component', () => {
    it('renders loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<PaymentGraph />);
      
      expect(screen.getByText('Loading payment data...')).toBeInTheDocument();
    });

    it('displays payment data after successful API call', async () => {
      const mockPaymentData = {
        revenueData: [
          {
            period: '2024-12-01T00:00:00Z',
            total_revenue: 5000,
            transaction_count: 50,
          },
        ],
        methodDistribution: [
          {
            method: 'stripe',
            _sum: { amount: 3000 },
            _count: 30,
          },
        ],
        recentTransactions: [
          {
            id: '1',
            amount: 49.99,
            method: 'stripe',
            status: 'completed',
            createdAt: '2024-12-15T10:30:00Z',
            member: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPaymentData }),
      });

      render(<PaymentGraph />);

      await waitFor(() => {
        expect(screen.getByText('Total Revenue (30 days)')).toBeInTheDocument();
        expect(screen.getByText('Transactions (30 days)')).toBeInTheDocument();
        expect(screen.getByText('Average Transaction')).toBeInTheDocument();
      });
    });

    it('shows empty state when no payment data exists', async () => {
      const mockPaymentData = {
        revenueData: [],
        methodDistribution: [],
        recentTransactions: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPaymentData }),
      });

      render(<PaymentGraph />);

      await waitFor(() => {
        expect(screen.getByText('No revenue data available')).toBeInTheDocument();
        expect(screen.getByText('No recent transactions')).toBeInTheDocument();
      });
    });
  });

  describe('IntegrationStatus Component', () => {
    it('renders loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<IntegrationStatus />);
      
      expect(screen.getByText('Loading integration status...')).toBeInTheDocument();
    });

    it('displays integration status after successful API call', async () => {
      const mockIntegrationData = {
        integrations: [
          {
            id: 'stripe',
            name: 'Stripe',
            provider: 'stripe',
            status: 'connected',
            credentialsStatus: 'valid',
            lastTested: '2024-12-15T10:30:00Z',
            settings: {
              publishableKey: 'pk_test_...',
              currency: 'EUR',
            },
          },
        ],
        stats: {
          stripe: { totalPayments: 150 },
          paypal: { totalPayments: 50 },
          bankTransfer: { totalPayments: 25 },
        },
        overallStatus: 'healthy',
        lastUpdated: '2024-12-15T10:30:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockIntegrationData }),
      });

      render(<IntegrationStatus />);

      await waitFor(() => {
        expect(screen.getByText('Stripe')).toBeInTheDocument();
        expect(screen.getByText('connected')).toBeInTheDocument();
        expect(screen.getByText('valid credentials')).toBeInTheDocument();
        expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
      });
    });

    it('shows empty state when no integrations exist', async () => {
      const mockIntegrationData = {
        integrations: [],
        stats: {},
        overallStatus: 'unhealthy',
        lastUpdated: '2024-12-15T10:30:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockIntegrationData }),
      });

      render(<IntegrationStatus />);

      await waitFor(() => {
        expect(screen.getByText('No payment integrations configured')).toBeInTheDocument();
        expect(screen.getByText('Configure Integrations')).toBeInTheDocument();
      });
    });

    it('handles test integration button click', async () => {
      const mockIntegrationData = {
        integrations: [
          {
            id: 'stripe',
            name: 'Stripe',
            provider: 'stripe',
            status: 'connected',
            credentialsStatus: 'valid',
            lastTested: '2024-12-15T10:30:00Z',
            settings: {},
          },
        ],
        stats: {},
        overallStatus: 'healthy',
        lastUpdated: '2024-12-15T10:30:00Z',
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockIntegrationData }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: { status: 'success' } }),
        });

      render(<IntegrationStatus />);

      await waitFor(() => {
        const testButton = screen.getByText('Test');
        fireEvent.click(testButton);
      });
    });
  });

  describe('FinanceReportList Component', () => {
    it('renders loading state initially', () => {
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<FinanceReportList />);
      
      expect(screen.getByText('Loading reports...')).toBeInTheDocument();
    });

    it('displays reports after successful API call', async () => {
      const mockReportData = {
        reports: [
          {
            id: 'monthly-summary',
            title: 'Monthly Financial Summary',
            description: 'Comprehensive monthly financial overview',
            type: 'pdf',
            available: true,
            lastGenerated: '2024-12-01T00:00:00Z',
          },
        ],
        summary: {
          totalRevenue: 50000,
          totalInvoices: 100,
          pendingInvoices: 15,
          activePlans: 8,
          monthlyGrowth: 12.5,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockReportData }),
      });

      render(<FinanceReportList />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Financial Summary')).toBeInTheDocument();
        expect(screen.getByText('Comprehensive monthly financial overview')).toBeInTheDocument();
        expect(screen.getByText('PDF')).toBeInTheDocument();
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('€50,000.00')).toBeInTheDocument();
      });
    });

    it('shows empty state when no reports exist', async () => {
      const mockReportData = {
        reports: [],
        summary: {
          totalRevenue: 0,
          totalInvoices: 0,
          pendingInvoices: 0,
          activePlans: 0,
          monthlyGrowth: 0,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockReportData }),
      });

      render(<FinanceReportList />);

      await waitFor(() => {
        expect(screen.getByText('No reports available')).toBeInTheDocument();
        expect(screen.getByText('Generate First Report')).toBeInTheDocument();
      });
    });

    it('handles generate report button click', async () => {
      const mockReportData = {
        reports: [
          {
            id: 'monthly-summary',
            title: 'Monthly Financial Summary',
            description: 'Comprehensive monthly financial overview',
            type: 'pdf',
            available: false,
            lastGenerated: '2024-12-01T00:00:00Z',
          },
        ],
        summary: {
          totalRevenue: 50000,
          totalInvoices: 100,
          pendingInvoices: 15,
          activePlans: 8,
          monthlyGrowth: 12.5,
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockReportData }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            success: true, 
            data: { 
              reportId: 'monthly-summary',
              format: 'pdf',
              generatedAt: '2024-12-15T10:30:00Z',
              downloadUrl: '/api/finance/reports/monthly-summary/download?format=pdf',
            }
          }),
        });

      render(<FinanceReportList />);

      await waitFor(() => {
        const generateButton = screen.getByText('Generate');
        fireEvent.click(generateButton);
      });
    });

    it('handles download report button click', async () => {
      const mockReportData = {
        reports: [
          {
            id: 'monthly-summary',
            title: 'Monthly Financial Summary',
            description: 'Comprehensive monthly financial overview',
            type: 'pdf',
            available: true,
            lastGenerated: '2024-12-01T00:00:00Z',
          },
        ],
        summary: {
          totalRevenue: 50000,
          totalInvoices: 100,
          pendingInvoices: 15,
          activePlans: 8,
          monthlyGrowth: 12.5,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockReportData }),
      });

      render(<FinanceReportList />);

      await waitFor(() => {
        const downloadButton = screen.getByText('Download');
        fireEvent.click(downloadButton);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully in ContributionPlanList', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ContributionPlanList />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load contribution plans')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully in InvoiceTable', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<InvoiceTable />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load invoices')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully in PaymentGraph', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<PaymentGraph />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load payment data')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully in IntegrationStatus', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<IntegrationStatus />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load integration status')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully in FinanceReportList', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<FinanceReportList />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load reports')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders properly on mobile devices', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<FinanceDashboard />);

      // Check that the layout is responsive
      expect(screen.getByTestId('signed-in-with-role')).toBeInTheDocument();
    });
  });
}); 