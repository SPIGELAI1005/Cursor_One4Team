"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, CreditCard, MessageSquare, ShoppingBag, Globe, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Member Management",
    description: "Easily manage club members, track memberships, and handle registrations with our intuitive interface.",
    color: "text-blue-600"
  },
  {
    icon: Calendar,
    title: "Schedule & Events",
    description: "Create and manage training sessions, events, and competitions with our comprehensive calendar system.",
    color: "text-green-600"
  },
  {
    icon: CreditCard,
    title: "Payments & Invoices",
    description: "Process payments, generate invoices, and track financial transactions with integrated payment processing.",
    color: "text-purple-600"
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    description: "Keep everyone connected with built-in messaging, announcements, and team communication tools.",
    color: "text-orange-600"
  },
  {
    icon: ShoppingBag,
    title: "Public Shop",
    description: "Sell club merchandise, equipment, and tickets through your own branded online shop.",
    color: "text-red-600"
  },
  {
    icon: Globe,
    title: "Custom Club Website",
    description: "Create a professional website for your club with customizable templates and branding.",
    color: "text-indigo-600"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Bank-level security with GDPR compliance to protect your club's and members' data.",
    color: "text-emerald-600"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Get insights into your club's performance with detailed analytics and reporting tools.",
    color: "text-cyan-600"
  }
]

export default function GuestFeatures() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything your club needs, in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From member management to online payments, One4Team provides all the tools you need to run your sports club efficiently and professionally.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors duration-300 mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to transform your club?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of sports clubs that have already streamlined their operations with One4Team. Start your free trial today.
          </p>
          <Link
            href="/register/club"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
} 