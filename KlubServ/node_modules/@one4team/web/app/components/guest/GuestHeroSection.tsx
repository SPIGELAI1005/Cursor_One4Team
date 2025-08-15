"use client"

import { Button } from "@/components/ui/button"
import { Play, Users, Calendar, CreditCard, MessageSquare, ShoppingBag, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function GuestHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-blue-700/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The Smart Platform for <span className="text-blue-600">Sports Clubs</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Manage your members, schedule, shop, payments, and more — all in one place.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Streamline your club operations with our comprehensive management solution designed specifically for sports organizations.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Register Club
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-200 px-8 py-3 bg-transparent transition-all duration-300"
                >
                  Log In
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Bank-Level Security
              </div>
            </div>

            {/* Quick feature highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Member Management</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Schedule & Events</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Payment Processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Team Communication</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Online Shop</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Custom Website</span>
              </div>
            </div>
          </div>

          {/* Visual - Sports Field Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="relative">
                <Image
                  src="/sports-field-hero.jpg"
                  alt="Two men on a vibrant green sports field - one wearing a Nike jacket, the other wearing a One4Team polo shirt, representing sports club management"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-2xl border border-gray-100 object-cover"
                  priority
                />
                {/* Glow effect around the image */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-700/20 blur-xl -z-10"></div>
              </div>
              
              {/* Floating stats cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Clubs</div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 