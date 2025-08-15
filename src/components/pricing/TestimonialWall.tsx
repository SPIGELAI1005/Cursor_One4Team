import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  club: string;
  content: string;
  rating: number;
  avatar?: string;
  clubLogo?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Club Manager",
    club: "FC Dynamo Youth",
    content: "We scaled from 2 to 10 teams in one season thanks to One4Team. The member management system made everything so much easier to organize.",
    rating: 5,
    avatar: "/lovable-uploads/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Marcus Weber",
    role: "President",
    club: "Berlin Basketball Club",
    content: "The automated billing alone saves us 15 hours per month. Our treasurer can finally focus on strategy instead of chasing payments.",
    rating: 5,
    avatar: "/lovable-uploads/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Administrator",
    club: "Madrid Tennis Academy",
    content: "One4Team transformed our communication. Parents are always informed, coaches can focus on training, and our events are perfectly organized.",
    rating: 5,
    avatar: "/lovable-uploads/testimonial-3.jpg"
  },
  {
    id: 4,
    name: "James Mitchell",
    role: "Treasurer",
    club: "London Rugby United",
    content: "Finally a solution that understands sports clubs! The financial reporting gives us insights we never had before.",
    rating: 5
  },
  {
    id: 5,
    name: "Anna Kowalski",
    role: "Secretary",
    club: "Warsaw Volleyball Club",
    content: "The scheduling system is a game-changer. No more double bookings, no more confused parents. Everything just works.",
    rating: 5
  },
  {
    id: 6,
    name: "David Thompson",
    role: "Coach",
    club: "Manchester United Youth",
    content: "I can focus on coaching instead of paperwork. The mobile app makes it easy to update training schedules on the go.",
    rating: 5
  }
];

const clubLogos = [
  { name: "FC Barcelona Academy", logo: "/lovable-uploads/logo-barca.png" },
  { name: "Real Madrid CF", logo: "/lovable-uploads/logo-real.png" },
  { name: "Chelsea FC Foundation", logo: "/lovable-uploads/logo-chelsea.png" },
  { name: "Bayern München", logo: "/lovable-uploads/logo-bayern.png" },
  { name: "Ajax Amsterdam", logo: "/lovable-uploads/logo-ajax.png" },
  { name: "Juventus Academy", logo: "/lovable-uploads/logo-juventus.png" },
  { name: "Liverpool FC", logo: "/lovable-uploads/logo-liverpool.png" },
  { name: "Borussia Dortmund", logo: "/lovable-uploads/logo-dortmund.png" }
];

export default function TestimonialWall() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Trusted by 500+ sports clubs worldwide
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See what club managers, coaches, and administrators are saying about their One4Team experience.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Content */}
              <blockquote className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.club}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Club Logos Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Powering clubs from grassroots to professional
          </h3>
          <p className="text-sm text-muted-foreground">
            Trusted by youth academies, amateur clubs, and professional organizations
          </p>
        </div>
        
        {/* Logo Grid - Using placeholders since we don't have actual logos */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 opacity-60 hover:opacity-80 transition-opacity">
          {clubLogos.map((club, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center h-12 w-full bg-muted/50 rounded-lg"
              title={club.name}
            >
              <div className="text-xs font-medium text-muted-foreground text-center px-2">
                {club.name.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-muted/30 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Active Clubs</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">50k+</div>
            <div className="text-sm text-muted-foreground">Members Managed</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">4.9★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">40%</div>
            <div className="text-sm text-muted-foreground">Growth Increase</div>
          </div>
        </div>
      </div>
    </section>
  );
}