"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl animate-glow"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-blue-50 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-blue-700/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {t.hero.title.split(' ').slice(0, -1).join(' ')} <span className="text-blue-600">{t.hero.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <p className="mt-4 text-lg text-gray-500">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t.navigation.bookDemo}
              </Button>
                             <Button
                 size="lg"
                 variant="outline"
                 className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-200 px-8 py-3 bg-transparent transition-all duration-300"
               >
                 <Play className="w-4 h-4 mr-2" />
                 {t.hero.seeFeatures}
               </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {t.hero.gdprCompliant}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {t.hero.bankLevelSecurity}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 