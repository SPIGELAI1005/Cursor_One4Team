"use client"

import { Shield, Smartphone, Users, Zap, Calendar, Ticket, ShoppingBag } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"



export default function WhyOne4Team() {
  const { t } = useLanguage()
  
  const benefits = [
    {
      icon: Zap,
      title: t.whyChoose.benefits.centralized.title,
      description: t.whyChoose.benefits.centralized.description,
    },
    {
      icon: Users,
      title: t.whyChoose.benefits.easyToUse.title,
      description: t.whyChoose.benefits.easyToUse.description,
    },
    {
      icon: Shield,
      title: t.whyChoose.benefits.secure.title,
      description: t.whyChoose.benefits.secure.description,
    },
    {
      icon: Smartphone,
      title: t.whyChoose.benefits.responsive.title,
      description: t.whyChoose.benefits.responsive.description,
    },
  ]

  const dashboardMetrics = [
    {
      icon: Users,
      title: t.whyChoose.metrics.members.title,
      percentage: 87,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      progressColor: "bg-blue-600",
      completeText: t.whyChoose.metrics.members.complete,
    },
    {
      icon: Calendar,
      title: t.whyChoose.metrics.matches.title,
      percentage: 92,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      progressColor: "bg-green-600",
      completeText: t.whyChoose.metrics.matches.complete,
    },
    {
      icon: Ticket,
      title: t.whyChoose.metrics.tickets.title,
      percentage: 78,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      progressColor: "bg-purple-600",
      completeText: t.whyChoose.metrics.tickets.complete,
    },
    {
      icon: ShoppingBag,
      title: t.whyChoose.metrics.shop.title,
      percentage: 65,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      progressColor: "bg-orange-600",
      completeText: t.whyChoose.metrics.shop.complete,
    },
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t.whyChoose.title.split('One4Team')[0]}<span className="text-blue-600">One4Team</span>{t.whyChoose.title.split('One4Team')[1]}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t.whyChoose.subtitle}
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Dashboard */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 via-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {dashboardMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                        <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{metric.title}</div>
                        <div className="text-lg font-bold text-gray-900">{metric.percentage}%</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`${metric.progressColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                    
                    {/* Progress Text */}
                    <div className="text-xs text-gray-500">
                      {metric.percentage}% {metric.completeText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-700/5 rounded-2xl blur-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 