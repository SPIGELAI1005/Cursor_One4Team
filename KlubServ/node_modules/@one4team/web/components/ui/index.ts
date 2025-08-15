// If using the shared UI package, import specific pieces selectively to avoid bundling issues
// export * from '@one4team/ui';
// Core UI Components
export { Button, buttonVariants } from "./button"
export { Input } from "./input"
export { Textarea } from "./textarea"
export { Label } from "./label"
export { Select, SelectTrigger, SelectValue, SelectContent, SelectLabel, SelectItem, SelectSeparator } from "./select"
export { Checkbox } from "./checkbox"
export { Separator } from "./separator"

// Layout Components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card"

// Display Components
export { Badge, badgeVariants } from "./badge"
export { Avatar, AvatarImage, AvatarFallback } from "./avatar"

// Interactive Components
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
export { Progress } from "./progress"

// Calendar Components
export { Calendar } from "./calendar"
export { CalendarEventModal } from "./calendar-event-modal"
export { CalendarWidget } from "./calendar-widget"

// Re-export types for convenience
export type { ButtonProps } from "./button"
export type { InputProps } from "./input"
export type { LabelProps } from "./label"
export type { SelectProps, SelectTriggerProps, SelectValueProps, SelectContentProps, SelectLabelProps, SelectItemProps, SelectSeparatorProps } from "./select"
export type { CardProps, CardHeaderProps, CardFooterProps, CardTitleProps, CardDescriptionProps, CardContentProps } from "./card"
export type { BadgeProps } from "./badge"
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from "./avatar"
// Local components don’t export types; keep runtime exports only.
export type { CalendarEvent, CalendarView } from "./calendar" 