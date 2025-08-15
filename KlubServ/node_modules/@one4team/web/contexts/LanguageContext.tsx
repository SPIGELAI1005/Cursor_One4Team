"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { getTranslation, Translations } from '@/lib/translations'

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  
  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('one4team-language', language)
    }
  }

  const t = getTranslation(currentLanguage)

  const value = {
    currentLanguage,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 