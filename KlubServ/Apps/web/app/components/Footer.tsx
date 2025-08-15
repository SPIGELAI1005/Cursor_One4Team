"use client"

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import One4TeamText from "@/components/One4TeamText"

export default function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/one4team-logo.svg"
                alt="One4Team"
                width={140}
                height={42}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.product}</h3>
                         <ul className="space-y-2 text-gray-400">
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.features}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.navigation.pricing}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.security}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.integrations}
                 </a>
               </li>
             </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.support}</h3>
                         <ul className="space-y-2 text-gray-400">
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.helpCenter}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.contactUs}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.navigation.bookDemo}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.systemStatus}
                 </a>
               </li>
             </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.legal}</h3>
                         <ul className="space-y-2 text-gray-400">
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.termsOfService}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.privacyPolicy}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.gdpr}
                 </a>
               </li>
               <li>
                 <a href="#" className="hover:text-white transition-colors">
                   {t.footer.imprint}
                 </a>
               </li>
             </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
                                     <div className="text-gray-400 text-sm">
              © 2024 <One4TeamText size="sm" variant="default" className="text-blue-400" />. All rights reserved. v2.1.0
            </div>
             <div className="mt-4 md:mt-0">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t.navigation.bookDemo}</Button>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 