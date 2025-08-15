import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'One4Team - Sports Club Management Platform',
  description: 'Run your sports club smarter. Memberships. Payments. Communication. One platform.',
  keywords: 'sports club management, member management, club administration, team management',
  openGraph: {
    title: 'One4Team - Sports Club Management Platform',
    description: 'The all-in-one solution that makes managing your sports club effortless',
    type: 'website',
  },
}

export default function MarketingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  One<span className="text-blue-600">4</span>Team
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Support
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/sign-in" className="text-gray-600 hover:text-blue-600 font-medium">
                Log In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Run your sports club <span className="text-blue-600">smarter</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Memberships. Payments. Communication. One platform.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                The all-in-one solution that makes managing your sports club effortless, so you can focus on what matters most – your community.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/sign-up"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
                >
                  Book a Demo
                </Link>
                <a
                  href="#features"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-200 px-8 py-3 rounded-md font-medium bg-transparent transition-all duration-300 inline-block flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                  See Features
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Bank-level Security
                </div>
              </div>
            </div>

            {/* Visual - Sports Field Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/5 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    One<span className="text-blue-600">4</span>Team Platform
                  </h3>
                  <p className="text-gray-600">Complete sports club management solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything your club needs in <span className="text-blue-600">one place</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From member management to financial tracking, One<span className="text-blue-600">4</span>Team provides all the tools you need to run your sports club efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Members */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Members</h3>
              <p className="text-gray-600 mb-4">
                Manage member profiles, registrations, and club hierarchy with ease.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            {/* Feature 2: Payments & Invoices */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payments & Invoices</h3>
              <p className="text-gray-600 mb-4">
                Automated billing, payment tracking, and financial reporting.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            {/* Feature 3: Communication Tools */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Communication Tools</h3>
              <p className="text-gray-600 mb-4">
                Keep everyone connected with announcements, messaging, and notifications.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            {/* Feature 4: Team Shop */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Shop</h3>
              <p className="text-gray-600 mb-4">
                Sell merchandise, equipment, and tickets directly through your platform.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            {/* Feature 5: Website Builder */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Website Builder</h3>
              <p className="text-gray-600 mb-4">
                Create a professional club website without any technical knowledge.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>

            {/* Feature 6: Reports */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-600 mb-4">
                Get insights into membership trends, finances, and club performance.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why choose One<span className="text-blue-600">4</span>Team?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built specifically for sports clubs, by people who understand the unique challenges of club management.
              </p>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Centralized club administration</h3>
                    <p className="text-gray-600">All your club operations in one unified platform</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy for everyone - from admins to players</h3>
                    <p className="text-gray-600">Intuitive interface that anyone can use without training</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">GDPR-compliant and secure</h3>
                    <p className="text-gray-600">Bank-level security with full compliance guarantee</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Works on all devices</h3>
                    <p className="text-gray-600">Perfect experience on desktop, tablet, and mobile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    One<span className="text-blue-600">4</span>Team Platform
                  </h3>
                  <p className="text-gray-600 text-sm">Complete sports club management solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by sports clubs across Germany
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join 500+ clubs that already use One<span className="text-blue-600">4</span>Team
          </p>
          
          {/* Club Logos */}
          <div className="flex justify-center items-center space-x-8">
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/1860.jpeg" 
                alt="TSV 1860 München" 
                width={64} 
                height={64}
                className="object-contain p-2"
              />
            </div>
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/Grobenzell.png" 
                alt="FC Grün-Weiss Grobenzell" 
                width={64} 
                height={64}
                className="object-contain p-2"
              />
            </div>
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo_svu.webp" 
                alt="SV München Untermenzing" 
                width={64} 
                height={64}
                className="object-contain p-2"
              />
            </div>
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/TSV Allach 09.png" 
                alt="TSV Allach 09" 
                width={64} 
                height={64}
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your sports club?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of clubs already using One<span className="text-blue-200">4</span>Team to streamline their operations and grow their membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-up"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md font-medium transition-all duration-300 inline-block"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">4</span>
                </div>
                <span className="text-xl font-bold">
                  One<span className="text-blue-400">4</span>Team
                </span>
              </div>
              <p className="text-gray-400">
                The smart platform for sports clubs. Manage your club efficiently with our comprehensive tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/sign-up" className="hover:text-white">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/impressum" className="hover:text-white">Legal Notice</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 One<span className="text-blue-400">4</span>Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
