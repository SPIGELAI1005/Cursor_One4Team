"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { Logo } from "@/components/ui/logo"

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  const { currentLanguage, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" }
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo variant="full" size="md" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </a>
              <Link href="/shop" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Shop
              </Link>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </a>
              <Link href="/(marketing)" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Original Site
              </Link>
              
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {/* Dropdown Menu */}
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                          currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => handleLanguageChange(language.code)}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLanguage === language.code && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium">
                  Register Club
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  How It Works
                </a>
                <Link href="/shop" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Shop
                </Link>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </a>
                <Link href="/(marketing)" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Original Site
                </Link>
                
                {/* Mobile Language Selector */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600 font-medium">Language</span>
                  </div>
                  <div className="space-y-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        className={`w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 ${
                          currentLanguage === language.code 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleLanguageChange(language.code)}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLanguage === language.code && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                  <Link href="/sign-in">
                    <Button variant="ghost" className="justify-start text-gray-600 hover:text-blue-600 font-medium w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium w-full">
                      Register Club
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Click outside to close dropdown */}
      {isLanguageDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </>
  )
} 