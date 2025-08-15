// =============================================================================
// GLOBAL TYPE DEFINITIONS FOR ONE4TEAM UI PACKAGE
// =============================================================================

declare global {
  // Extend React types
  namespace React {
    interface HTMLAttributes<T> {
      'data-testid'?: string
    }
  }

  // Extend CSS properties
  interface CSSProperties {
    '--one4team-primary'?: string
    '--one4team-secondary'?: string
    '--one4team-accent'?: string
  }
}

// One4Team specific types
export interface One4TeamUser {
  id: string
  name: string
  email: string
  role: 'member' | 'trainer' | 'admin'
  clubId: string
  avatar?: string
}

export interface One4TeamClub {
  id: string
  name: string
  subdomain: string
  logo?: string
  settings: ClubSettings
}

export interface ClubSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'de'
  timezone: string
  currency: string
}

export interface One4TeamEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  location?: string
  type: 'training' | 'match' | 'meeting' | 'other'
  participants: string[]
  clubId: string
}

export interface One4TeamPayment {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  type: 'subscription' | 'one-time' | 'refund'
  description: string
  userId: string
  clubId: string
  createdAt: Date
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  'data-testid'?: string
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'skeleton'
}

export interface ErrorProps extends BaseComponentProps {
  title?: string
  message?: string
  retry?: () => void
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// API types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Theme types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
}

export {} 