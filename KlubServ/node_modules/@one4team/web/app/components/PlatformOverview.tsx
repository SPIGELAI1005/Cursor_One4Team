"use client"

import { Users, CreditCard, MessageSquare, ShoppingBag, Globe, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"

export default function PlatformOverview() {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: Users,
      title: t.features.members.title,
      description: t.features.members.description,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: CreditCard,
      title: t.features.payments.title,
      description: t.features.payments.description,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: MessageSquare,
      title: t.features.communication.title,
      description: t.features.communication.description,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: ShoppingBag,
      title: t.features.teamShop.title,
      description: t.features.teamShop.description,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Globe,
      title: t.features.websiteBuilder.title,
      description: t.features.websiteBuilder.description,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: BarChart3,
      title: t.features.reports.title,
      description: t.features.reports.description,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    ]
  
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.features.title.split('... ')[0]}... <span className="text-blue-600">{t.features.title.split('... ')[1]}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.features.subtitle.split('One4Team')[0]}<span className="text-blue-600">One4Team</span>{t.features.subtitle.split('One4Team')[1]}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {feature.title === "Members" ? (
                <Link href="/app">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 group-hover:translate-x-1 transition-transform duration-300">
                    Try Member Area →
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 group-hover:translate-x-1 transition-transform duration-300">
                  {t.features.learnMore}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 