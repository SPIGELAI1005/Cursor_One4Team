"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

const getTestimonials = (t: any) => [
  {
    quote: t.testimonials.testimonials.maria.quote,
    author: t.testimonials.testimonials.maria.author,
    role: t.testimonials.testimonials.maria.role,
    club: t.testimonials.testimonials.maria.club,
    rating: 5,
    image: "/Maria Schmidt.jpg", // Profile image for Maria Schmidt
  },
  {
    quote: t.testimonials.testimonials.thomas.quote,
    author: t.testimonials.testimonials.thomas.author,
    role: t.testimonials.testimonials.thomas.role,
    club: t.testimonials.testimonials.thomas.club,
    rating: 5,
    image: "/Thomas Weber.jpg", // Profile image for Thomas Weber
  },
  {
    quote: t.testimonials.testimonials.anna.quote,
    author: t.testimonials.testimonials.anna.author,
    role: t.testimonials.testimonials.anna.role,
    club: t.testimonials.testimonials.anna.club,
    rating: 5,
    image: "/Anna Müller.jpg", // Profile image for Anna Müller
  },
]

const clubLogos = [
  {
    name: "TSV 1860 München",
    logo: "/1860.jpeg",
    fallback: "1860",
    color: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    name: "FC Grün-Weiss Grobenzell",
    logo: "/Grobenzell.png", 
    fallback: "FC GW",
    color: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    name: "SV München Untermenzing",
    logo: "/logo_svu.webp",
    fallback: "SVU",
    color: "bg-purple-50", 
    textColor: "text-purple-600",
  },
  {
    name: "TSV Allach 09",
    logo: "/TSV Allach 09.png",
    fallback: "TSV",
    color: "bg-orange-50",
    textColor: "text-orange-600",
  },
]

export default function Testimonials() {
  const { t } = useLanguage()
  const testimonials = getTestimonials(t)
  
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
                     <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
             {t.testimonials.title.includes('everywhere') ? (
               <>
                 {t.testimonials.title.split('everywhere')[0]} <span className="text-blue-600">everywhere</span>
               </>
             ) : (
               <>
                 {t.testimonials.title.split('überall')[0]} <span className="text-blue-600">überall</span>
               </>
             )}
           </h2>
          <p className="text-xl text-gray-600">{t.testimonials.subtitle.split('One4Team')[0]}<span className="text-blue-600">One4Team</span>{t.testimonials.subtitle.split('One4Team')[1]}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 group-hover:text-gray-900 transition-colors duration-300">
                "{testimonial.quote}"
              </blockquote>

                             {/* Author */}
               <div className="flex items-center">
                 <div className="flex-shrink-0">
                   <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                     <Image
                       src={testimonial.image}
                       alt={testimonial.author}
                       width={40}
                       height={40}
                       className="object-cover w-full h-full"
                       onError={(e) => {
                         // Fallback to initials if image fails to load
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         const parent = target.parentElement;
                         if (parent) {
                           parent.innerHTML = `<span class="text-blue-600 font-semibold text-sm">${testimonial.author.split(' ').map((n: string) => n[0]).join('')}</span>`;
                         }
                       }}
                     />
                   </div>
                 </div>
                 <div className="ml-3">
                   <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                   <p className="text-sm text-gray-500">{testimonial.role}</p>
                   <p className="text-xs text-blue-600 font-medium">{testimonial.club}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">{t.testimonials.joinClubs.split('One4Team')[0]}<span className="text-blue-600">One4Team</span>{t.testimonials.joinClubs.split('One4Team')[1]}</p>
                     <div className="flex items-center justify-center space-x-8 opacity-80">
             {clubLogos.map((club, index) => (
               <div key={index} className="relative group">
                 <div className="w-24 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-all duration-300 hover:scale-105 overflow-hidden">
                   <Image
                     src={club.logo}
                     alt={club.name}
                     width={80}
                     height={40}
                     className="object-contain max-w-full max-h-full"
                     onError={(e) => {
                       // Fallback to text if image fails to load
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       const parent = target.parentElement;
                       if (parent) {
                         parent.innerHTML = `<div class="text-xs font-semibold ${club.textColor}">${club.fallback}</div>`;
                       }
                     }}
                   />
                 </div>
                 {/* Tooltip */}
                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                   {club.name}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  )
} 