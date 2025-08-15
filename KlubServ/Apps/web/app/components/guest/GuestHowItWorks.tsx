"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Rocket, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up Your Club",
    description: "Create your club account in minutes. Add your club information, logo, and basic details to get started.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    features: [
      "Club profile setup",
      "Logo and branding",
      "Basic configuration"
    ]
  },
  {
    icon: Users,
    title: "Invite Members",
    description: "Send invitations to your existing members and start building your digital community.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    features: [
      "Bulk member import",
      "Email invitations",
      "Member registration"
    ]
  },
  {
    icon: Rocket,
    title: "Start Managing!",
    description: "Begin using all the features to manage your club operations efficiently and professionally.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    features: [
      "Full platform access",
      "Training and support",
      "Ongoing assistance"
    ]
  }
]

export default function GuestHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with One4Team is simple. Follow these three easy steps to transform your club management.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>
              
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
              )}
              
              <Card className="h-full border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Timeline for mobile */}
        <div className="lg:hidden mb-16">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-2">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center mb-3`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <div className="space-y-1">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of sports clubs that have already transformed their operations with One4Team. 
              Start your journey today and see the difference it makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-200 px-8 py-3 transition-all duration-300">
                  Log In to Existing Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 