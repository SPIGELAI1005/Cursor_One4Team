# One4Team UI Package

A comprehensive UI component library for the One4Team sports club management platform. Built with React, TypeScript, Tailwind CSS, and Radix UI primitives.

## 🚀 Features

- **TypeScript First**: Full TypeScript support with comprehensive type definitions
- **Accessible**: Built on Radix UI primitives for excellent accessibility
- **Customizable**: Flexible theming with Tailwind CSS and CSS variables
- **Responsive**: Mobile-first design with responsive breakpoints
- **Consistent**: Unified design system across all components

## 📦 Installation

```bash
npm install @one4team/ui
```

## 🎨 Design System

### Colors
- **Primary**: `#1757FF` (One4Team Blue)
- **Secondary**: `#29C468` (One4Team Green)
- **Accent**: `#FF6B35` (Orange)
- **Neutral**: Gray scale from 50-900

### Typography
- **Font Family**: Inter (system fallback)
- **Font Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
- **Font Weights**: 400, 500, 600, 700

### Spacing
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 🧩 Components

### Core Components

#### Button
```tsx
import { Button } from '@one4team/ui'

<Button variant="primary" size="md">
  Click me
</Button>
```

#### Input
```tsx
import { Input } from '@one4team/ui'

<Input 
  type="email" 
  placeholder="Enter your email"
  error={hasError}
  helperText="Please enter a valid email"
/>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@one4team/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Badge
```tsx
import { Badge } from '@one4team/ui'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

#### Avatar
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@one4team/ui'

<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Alert
```tsx
import { Alert, AlertTitle, AlertDescription } from '@one4team/ui'

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your action was completed successfully.
  </AlertDescription>
</Alert>
```

#### Table
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@one4team/ui'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Custom Hooks

#### useLocalStorage
```tsx
import { useLocalStorage } from '@one4team/ui'

const [value, setValue] = useLocalStorage('key', 'default')
```

#### useDebounce
```tsx
import { useDebounce } from '@one4team/ui'

const debouncedValue = useDebounce(value, 500)
```

#### useMediaQuery
```tsx
import { useMediaQuery } from '@one4team/ui'

const isMobile = useMediaQuery('(max-width: 768px)')
```

#### useClickOutside
```tsx
import { useClickOutside } from '@one4team/ui'

const ref = useRef<HTMLDivElement>(null)
useClickOutside(ref, () => setIsOpen(false))
```

## 🎯 Usage Examples

### Form with Validation
```tsx
import { Input, Label, Button, Alert } from '@one4team/ui'

function ContactForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    // Submit form
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Data Table with Actions
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  Badge,
  Button 
} from '@one4team/ui'

function MembersTable({ members }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.name}</TableCell>
            <TableCell>
              <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                {member.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## 🎨 Theming

### CSS Variables
```css
:root {
  --one4team-primary: #1757FF;
  --one4team-secondary: #29C468;
  --one4team-accent: #FF6B35;
}
```

### Custom Theme
```tsx
import { Theme } from '@one4team/ui'

const customTheme: Theme = {
  name: 'custom',
  colors: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    accent: '#your-accent-color',
    background: '#your-background-color',
    foreground: '#your-foreground-color',
    muted: '#your-muted-color',
    border: '#your-border-color',
  }
}
```

## 📱 Responsive Design

All components are built with mobile-first responsive design:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader**: Optimized for screen readers
- **Color Contrast**: WCAG AA compliant color contrast ratios
- **Focus Management**: Proper focus management and visible focus indicators

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 API Reference

### Button
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Button variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| disabled | `boolean` | `false` | Disabled state |

### Input
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `string` | `'text'` | Input type |
| error | `boolean` | `false` | Error state |
| helperText | `string` | - | Helper text below input |

### Badge
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info'` | `'default'` | Badge variant |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community 