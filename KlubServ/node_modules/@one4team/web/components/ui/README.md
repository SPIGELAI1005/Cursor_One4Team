# One4Team UI Components

This directory contains the core UI components for the One4Team sports club management platform. All components follow our established coding standards and design system.

## Design System

Our design system is built on:
- **Tailwind CSS** for styling
- **Radix UI** for accessible primitives
- **Shadcn/ui** for component patterns
- **One4Team Brand Colors**: Blue (#1757FF), Green (#29C468)

## Component Guidelines

### Naming Convention
- Use PascalCase for component names
- Use kebab-case for file names
- Export components as named exports

### Props Interface
- Define TypeScript interfaces for all props
- Use descriptive prop names
- Include JSDoc comments for complex props

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use design system colors and tokens

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## Available Components

### Core Components
- `Button` - Primary, secondary, and variant buttons
- `Input` - Text input with validation states
- `Label` - Form labels with proper associations
- `Card` - Content containers with headers and actions

### Navigation
- `Breadcrumb` - Page navigation breadcrumbs
- `Navigation` - Main navigation components

### Data Display
- `Table` - Data tables with sorting and pagination
- `Badge` - Status and category indicators
- `Avatar` - User profile images

### Feedback
- `Alert` - Success, error, warning, and info messages
- `Toast` - Temporary notification messages
- `Progress` - Loading and progress indicators

### Layout
- `Container` - Responsive layout containers
- `Grid` - CSS Grid layout components
- `Stack` - Vertical and horizontal spacing

## Usage Examples

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

## Development

### Adding New Components
1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Implement component with Tailwind styling
4. Add JSDoc documentation
5. Export from index file
6. Update this README

### Testing
- Write unit tests for all components
- Test accessibility features
- Verify responsive behavior
- Check cross-browser compatibility

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [One4Team Design System](https://design.one4team.com) 