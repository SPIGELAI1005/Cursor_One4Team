import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoleGuard, getUserRoles, hasAnyRole, hasAllRoles } from '@/app/components/auth/RoleGuard';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { useUser } from '@clerk/nextjs';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('RBAC System Tests', () => {
  const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    });
  });

  describe('getUserRoles Function', () => {
    it('should return member role when no user', () => {
      const roles = getUserRoles(null);
      expect(roles).toEqual(['member']);
    });

    it('should return member role when no metadata', () => {
      mockUseUser.mockReturnValue({
        user: { publicMetadata: {} } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      const roles = getUserRoles({ publicMetadata: {} } as any);
      expect(roles).toEqual(['member']);
    });

    it('should handle roles array from metadata', () => {
      const user = {
        publicMetadata: {
          roles: ['admin', 'trainer']
        }
      } as any;

      const roles = getUserRoles(user);
      expect(roles).toEqual(['admin', 'trainer']);
    });

    it('should handle single role from metadata (backward compatibility)', () => {
      const user = {
        publicMetadata: {
          user_role: 'admin'
        }
      } as any;

      const roles = getUserRoles(user);
      expect(roles).toEqual(['admin']);
    });

    it('should filter out invalid roles', () => {
      const user = {
        publicMetadata: {
          roles: ['admin', 'invalid_role', 'trainer']
        }
      } as any;

      const roles = getUserRoles(user);
      expect(roles).toEqual(['admin', 'trainer']);
    });
  });

  describe('hasAnyRole Function', () => {
    it('should return true if user has any of the specified roles', () => {
      const user = {
        publicMetadata: {
          roles: ['admin', 'trainer']
        }
      } as any;

      expect(hasAnyRole(user, ['admin'])).toBe(true);
      expect(hasAnyRole(user, ['member'])).toBe(false);
      expect(hasAnyRole(user, ['admin', 'member'])).toBe(true);
    });
  });

  describe('hasAllRoles Function', () => {
    it('should return true if user has all specified roles', () => {
      const user = {
        publicMetadata: {
          roles: ['admin', 'trainer']
        }
      } as any;

      expect(hasAllRoles(user, ['admin', 'trainer'])).toBe(true);
      expect(hasAllRoles(user, ['admin'])).toBe(true);
      expect(hasAllRoles(user, ['admin', 'member'])).toBe(false);
    });
  });

  describe('RoleGuard Component', () => {
    it('should render children when user has required role', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should not render children when user lacks required role', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['member']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['admin']}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should render fallback when user lacks required role', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['member']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['admin']} fallback={<div>Access Denied</div>}>
          <div>Admin Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should handle multiple roles correctly', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin', 'trainer']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['trainer', 'member']}>
          <div>Trainer Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Trainer Content')).toBeInTheDocument();
    });

    it('should require all roles when requireAll is true', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin', 'trainer']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['admin', 'trainer']} requireAll={true}>
          <div>Admin + Trainer Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Admin + Trainer Content')).toBeInTheDocument();
    });

    it('should not render when user lacks all required roles', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <RoleGuard allowedRoles={['admin', 'trainer']} requireAll={true}>
          <div>Admin + Trainer Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText('Admin + Trainer Content')).not.toBeInTheDocument();
    });
  });

  describe('SignedInWithRole Component', () => {
    it('should render children when user has required role', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <SignedInWithRole requiredRoles={['admin']}>
          <div>Admin Content</div>
        </SignedInWithRole>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should redirect when user lacks required role', async () => {
      const mockPush = jest.fn();
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
        push: mockPush,
      } as any);

      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['member']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <SignedInWithRole requiredRoles={['admin']} redirectTo="/403">
          <div>Admin Content</div>
        </SignedInWithRole>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/403');
      });
    });

    it('should handle multiple roles correctly', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin', 'trainer']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      render(
        <SignedInWithRole requiredRoles={['trainer', 'member']}>
          <div>Trainer Content</div>
        </SignedInWithRole>
      );

      expect(screen.getByText('Trainer Content')).toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control Scenarios', () => {
    it('should allow admin to access all areas', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['admin']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      const adminUser = mockUseUser().user;
      
      expect(hasAnyRole(adminUser, ['admin'])).toBe(true);
      expect(hasAnyRole(adminUser, ['trainer'])).toBe(false);
      expect(hasAnyRole(adminUser, ['admin', 'trainer'])).toBe(true);
    });

    it('should allow trainer to access trainer areas but not admin areas', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['trainer']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      const trainerUser = mockUseUser().user;
      
      expect(hasAnyRole(trainerUser, ['trainer'])).toBe(true);
      expect(hasAnyRole(trainerUser, ['admin'])).toBe(false);
      expect(hasAnyRole(trainerUser, ['member'])).toBe(false);
    });

    it('should allow multi-role user to access multiple areas', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['trainer', 'player']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      const multiRoleUser = mockUseUser().user;
      
      expect(hasAnyRole(multiRoleUser, ['trainer'])).toBe(true);
      expect(hasAnyRole(multiRoleUser, ['player'])).toBe(true);
      expect(hasAnyRole(multiRoleUser, ['admin'])).toBe(false);
      expect(hasAllRoles(multiRoleUser, ['trainer', 'player'])).toBe(true);
    });

    it('should prevent cross-role access for single role users', () => {
      mockUseUser.mockReturnValue({
        user: {
          publicMetadata: {
            roles: ['finance']
          }
        } as any,
        isLoaded: true,
        isSignedIn: true,
      });

      const financeUser = mockUseUser().user;
      
      expect(hasAnyRole(financeUser, ['finance'])).toBe(true);
      expect(hasAnyRole(financeUser, ['trainer'])).toBe(false);
      expect(hasAnyRole(financeUser, ['member'])).toBe(false);
      expect(hasAnyRole(financeUser, ['admin'])).toBe(false);
    });
  });

  describe('Backward Compatibility', () => {
    it('should handle legacy single role format', () => {
      const user = {
        publicMetadata: {
          user_role: 'admin'
        }
      } as any;

      const roles = getUserRoles(user);
      expect(roles).toEqual(['admin']);
      expect(hasAnyRole(user, ['admin'])).toBe(true);
    });

    it('should prioritize roles array over user_role', () => {
      const user = {
        publicMetadata: {
          roles: ['trainer'],
          user_role: 'admin'
        }
      } as any;

      const roles = getUserRoles(user);
      expect(roles).toEqual(['trainer']);
      expect(hasAnyRole(user, ['trainer'])).toBe(true);
      expect(hasAnyRole(user, ['admin'])).toBe(false);
    });
  });
}); 