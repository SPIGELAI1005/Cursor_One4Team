// =============================================================================
// SHARED UI COMPONENTS FOR ONE4TEAM
// =============================================================================

// Core utilities
export { cn, formatCurrency, formatDate, formatRelativeTime, getInitials, truncateText } from './lib/utils'
export { buttonVariants } from './lib/button-variants'

// UI Components
export { Button } from './components/button'
export { Input } from './components/input'
export { Label } from './components/label'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/card'
export { Badge, badgeVariants } from './components/badge'
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar'
export { Alert, AlertTitle, AlertDescription } from './components/alert'
export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption 
} from './components/table'

// Custom Hooks
export { useLocalStorage } from './hooks/useLocalStorage'
export { useDebounce } from './hooks/useDebounce'
export { useMediaQuery } from './hooks/useMediaQuery'
export { useClickOutside } from './hooks/useClickOutside' 