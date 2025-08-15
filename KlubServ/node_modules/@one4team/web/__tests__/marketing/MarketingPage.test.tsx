import { render, screen } from '@testing-library/react'
import MarketingPage from '../../../app/marketing/page'

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />
  }
})

describe('MarketingPage', () => {
  it('renders the main heading', () => {
    render(<MarketingPage />)
    expect(screen.getByText(/Run your sports club smarter/i)).toBeInTheDocument()
  })

  it('renders the value proposition', () => {
    render(<MarketingPage />)
    expect(screen.getByText(/Memberships\. Payments\. Communication\. One platform\./)).toBeInTheDocument()
  })

  it('renders all feature sections', () => {
    render(<MarketingPage />)
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Payments & Invoices')).toBeInTheDocument()
    expect(screen.getByText('Communication Tools')).toBeInTheDocument()
    expect(screen.getByText('Team Shop')).toBeInTheDocument()
    expect(screen.getByText('Website Builder')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<MarketingPage />)
    expect(screen.getByText('Book a Demo')).toBeInTheDocument()
    expect(screen.getByText('Start Free Trial')).toBeInTheDocument()
    expect(screen.getByText('Contact Sales')).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<MarketingPage />)
    expect(screen.getByText('GDPR Compliant')).toBeInTheDocument()
    expect(screen.getByText('Bank-level Security')).toBeInTheDocument()
  })

  it('renders social proof section', () => {
    render(<MarketingPage />)
    expect(screen.getByText(/Trusted by sports clubs across Germany/)).toBeInTheDocument()
    expect(screen.getByText(/Join 500\+ clubs that already use/)).toBeInTheDocument()
  })

  it('renders footer links', () => {
    render(<MarketingPage />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<MarketingPage />)
    const signInLink = screen.getByText('Log In')
    const signUpLink = screen.getByText('Get Started')
    
    expect(signInLink).toHaveAttribute('href', '/sign-in')
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })
})
