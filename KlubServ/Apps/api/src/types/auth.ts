export type UserRole = 'admin' | 'trainer' | 'member' | 'official' | 'finance' | 'support' | 'partner' | 'player' | 'press-news';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: UserRole[]; // Changed from single role to array of roles
  firstName?: string;
  lastName?: string;
  clubId?: string;
}

export interface RolePermissions {
  canManageUsers: boolean;
  canManageFinances: boolean;
  canManageClasses: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canAccessDashboard: boolean;
  canAccessMemberApp: boolean;
  canManageRoles: boolean;
  canViewAllData: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface RoleConfig {
  role: UserRole;
  permissions: RolePermissions;
  description: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    permissions: {
      canManageUsers: true,
      canManageFinances: true,
      canManageClasses: true,
      canViewReports: true,
      canManageSettings: true,
      canAccessDashboard: true,
      canAccessMemberApp: true,
      canManageRoles: true,
      canViewAllData: true,
    },
    description: 'Full system access with user management and financial control',
  },
  trainer: {
    role: 'trainer',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: true,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: true,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Can manage classes and view reports, limited admin access',
  },
  official: {
    role: 'official',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: false,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Read-only access to club information and internal documents',
  },
  member: {
    role: 'member',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessDashboard: false,
      canAccessMemberApp: true,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Basic member access to personal profile and payments',
  },
  finance: {
    role: 'finance',
    permissions: {
      canManageUsers: false,
      canManageFinances: true,
      canManageClasses: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: false,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Financial management and reporting access',
  },
  support: {
    role: 'support',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: true,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Support and customer service access',
  },
  partner: {
    role: 'partner',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: false,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Sponsorship partner access with limited visibility',
  },
  player: {
    role: 'player',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessDashboard: false,
      canAccessMemberApp: true,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Player access to personal profile and team information',
  },
  'press-news': {
    role: 'press-news',
    permissions: {
      canManageUsers: false,
      canManageFinances: false,
      canManageClasses: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessDashboard: true,
      canAccessMemberApp: false,
      canManageRoles: false,
      canViewAllData: false,
    },
    description: 'Press and news media access with public content visibility',
  },
};

export interface AuthError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_TOKEN' | 'MISSING_TOKEN';
  message: string;
  details?: any;
} 