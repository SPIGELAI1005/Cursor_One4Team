"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Club Manager",
    club: "FC Bayern Munich Youth",
    content: "One4Team has completely transformed how we manage our youth teams. The member management is intuitive, and the communication tools keep everyone connected. It's been a game-changer for our club.",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    name: "Michael Chen",
    role: "President",
    club: "Tennis Club Berlin",
    content: "The payment processing and scheduling features have saved us hours every week. Our members love the easy-to-use interface, and our administrative overhead has decreased significantly.",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    name: "Emma Rodriguez",
    role: "Head Coach",
    club: "Swimming Association Hamburg",
    content: "As a coach, I love how easy it is to track training progress and communicate with my athletes. The platform has made our club more professional and organized than ever before.",
    rating: 5,
    image: "/placeholder.svg"
  }
]

const clubLogos = [
  { name: "FC Bayern Munich", logo: "/placeholder.svg" },
  { name: "Tennis Club Berlin", logo: "/placeholder.svg" },
  { name: "Swimming Association Hamburg", logo: "/placeholder.svg" },
  { name: "Basketball Club Frankfurt", logo: "/placeholder.svg" },
  { name: "Athletics Club Munich", logo: "/placeholder.svg" },
  { name: "Volleyball Team Cologne", logo: "/placeholder.svg" }
]

export default function GuestTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Sports Clubs Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of sports clubs that have already transformed their operations with One4Team.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.club}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Club Logos */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Clubs Using One4Team
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clubLogos.map((club, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">
                  {club.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Active Clubs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
} 