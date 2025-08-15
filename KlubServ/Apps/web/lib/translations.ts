export interface Translations {
  navigation: {
    features: string
    pricing: string
    support: string
    logIn: string
    bookDemo: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    seeFeatures: string
    gdprCompliant: string
    bankLevelSecurity: string
  }
  footer: {
    description: string
    company: string
    product: string
    support: string
    legal: string
    features: string
    security: string
    integrations: string
    helpCenter: string
    contactUs: string
    systemStatus: string
    termsOfService: string
    privacyPolicy: string
    gdpr: string
    imprint: string
    copyright: string
  }
  login: {
    welcomeBack: string
    signInDescription: string
    email: string
    password: string
    emailPlaceholder: string
    passwordPlaceholder: string
    forgotPassword: string
    createAccount: string
    signIn: string
    signUp: string
    or: string
    resetPassword: string
    resetPasswordDescription: string
    sendResetLink: string
    backToSignIn: string
    checkYourEmail: string
    resetEmailSent: string
    didntReceiveEmail: string
    tryAgainDifferentEmail: string
    // Error messages
    invalidEmail: string
    passwordTooShort: string
    invalidCredentials: string
    accountNotFound: string
    incorrectPassword: string
    accountExists: string
    generalError: string
    resetEmailFailed: string
    createAccountFailed: string
  }
  common: {
    language: string
  }
  features: {
    title: string
    subtitle: string
    learnMore: string
    members: {
      title: string
      description: string
    }
    payments: {
      title: string
      description: string
    }
    communication: {
      title: string
      description: string
    }
    teamShop: {
      title: string
      description: string
    }
    websiteBuilder: {
      title: string
      description: string
    }
    reports: {
      title: string
      description: string
    }
  }
  whyChoose: {
    title: string
    subtitle: string
    benefits: {
      centralized: {
        title: string
        description: string
      }
      easyToUse: {
        title: string
        description: string
      }
      secure: {
        title: string
        description: string
      }
      responsive: {
        title: string
        description: string
      }
    }
    metrics: {
      members: {
        title: string
        complete: string
      }
      matches: {
        title: string
        complete: string
      }
      tickets: {
        title: string
        complete: string
      }
      shop: {
        title: string
        complete: string
      }
    }
  }
  testimonials: {
    title: string
    subtitle: string
    joinClubs: string
    testimonials: {
      maria: {
        quote: string
        author: string
        role: string
        club: string
      }
      thomas: {
        quote: string
        author: string
        role: string
        club: string
      }
      anna: {
        quote: string
        author: string
        role: string
        club: string
      }
    }
  }
}

export const translations: Record<string, Translations> = {
  en: {
    navigation: {
      features: "Features",
      pricing: "Pricing", 
      support: "Support",
      logIn: "Log In",
      bookDemo: "Book a Demo"
    },
    hero: {
      title: "Run your sports club smarter",
      subtitle: "Memberships. Payments. Communication. One platform.",
      description: "The all-in-one solution that makes managing your sports club effortless, so you can focus on what matters most – your community.",
      seeFeatures: "See Features",
      gdprCompliant: "GDPR Compliant",
      bankLevelSecurity: "Bank-level Security"
    },
    footer: {
      description: "The all-in-one platform for managing sports club memberships, payments, communication, and more.",
      company: "Company",
      product: "Product", 
      support: "Support",
      legal: "Legal",
      features: "Features",
      security: "Security",
      integrations: "Integrations",
      helpCenter: "Help Center",
      contactUs: "Contact Us",
      systemStatus: "System Status",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      gdpr: "GDPR",
      imprint: "Imprint",
      copyright: "© 2024 One4Team. All rights reserved. v2.1.0"
    },
    login: {
      welcomeBack: "Welcome Back",
       signInDescription: "Sign in to your One4Team account to continue",
      email: "Email Address",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot your password?",
      createAccount: "Don't have an account?",
      signIn: "Sign In",
      signUp: "Create Account",
      or: "Or",
      resetPassword: "Reset Password",
      resetPasswordDescription: "Enter your email address and we'll send you a link to reset your password",
      sendResetLink: "Send Reset Link",
      backToSignIn: "Back to Sign In",
      checkYourEmail: "Check Your Email",
      resetEmailSent: "We've sent a password reset link to",
      didntReceiveEmail: "Didn't receive the email? Check your spam folder or",
      tryAgainDifferentEmail: "try again with a different email address",
      // Error messages
      invalidEmail: "Please enter a valid email address",
      passwordTooShort: "Password must be at least 8 characters",
      invalidCredentials: "Invalid email or password",
      accountNotFound: "No account found with this email address",
      incorrectPassword: "Incorrect password",
      accountExists: "An account with this email already exists",
      generalError: "An error occurred. Please try again.",
      resetEmailFailed: "Failed to send reset email. Please try again.",
      createAccountFailed: "Failed to create account. Please try again."
    },
    common: {
      language: "Language"
    },
    features: {
      title: "Everything your club needs... in one place",
       subtitle: "From member management to financial tracking, One4Team provides all the tools you need to run your sports club efficiently.",
      learnMore: "Learn More →",
      members: {
        title: "Members",
        description: "Manage member profiles, registrations, and club hierarchy with ease."
      },
      payments: {
        title: "Payments & Invoices",
        description: "Automated billing, payment tracking, and financial reporting."
      },
      communication: {
        title: "Communication Tools",
        description: "Keep everyone connected with announcements, messaging, and notifications."
      },
      teamShop: {
        title: "Team Shop",
        description: "Sell merchandise, equipment, and tickets directly through your platform."
      },
      websiteBuilder: {
        title: "Website Builder",
        description: "Create a professional club website without any technical knowledge."
      },
      reports: {
        title: "Reports",
        description: "Get insights into membership trends, finances, and club performance."
      }
    },
    whyChoose: {
       title: "Why choose One4Team?",
      subtitle: "Built specifically for sports clubs, by people who understand the unique challenges of club management.",
      benefits: {
        centralized: {
          title: "Centralized club administration",
          description: "All your club operations in one unified platform"
        },
        easyToUse: {
          title: "Easy for everyone – from admins to players",
          description: "Intuitive interface that anyone can use without training"
        },
        secure: {
          title: "GDPR-compliant and secure",
          description: "Bank-level security with full compliance guarantee"
        },
        responsive: {
          title: "Works on all devices",
          description: "Perfect experience on desktop, tablet, and mobile"
        }
      },
      metrics: {
        members: {
          title: "Number of Members",
          complete: "complete"
        },
        matches: {
          title: "Matches Planned vs. Played",
          complete: "complete"
        },
        tickets: {
          title: "Number of Tickets Sold",
          complete: "complete"
        },
        shop: {
          title: "Number of Items in Shop",
          complete: "complete"
        }
      }
    },
    testimonials: {
      title: "Trusted by clubs everywhere",
       subtitle: "See what club managers are saying about One4Team",
joinClubs: "Join 500+ clubs already using One4Team",
      testimonials: {
        maria: {
           quote: "One4Team has transformed how we manage our club. Everything is now in one place - memberships, payments, communication. It's a game-changer!",
          author: "Maria Schmidt",
          role: "Club Manager",
          club: "FC Grün-Weiss Grobenzell"
        },
        thomas: {
          quote: "The platform is incredibly intuitive. Our members love the easy registration process and our admin team saves hours every week on manual tasks.",
          author: "Thomas Weber",
          role: "President",
          club: "TSV 1860 München"
        },
        anna: {
          quote: "Finally, a solution that understands sports clubs! The payment tracking and member management features are exactly what we needed.",
          author: "Anna Müller",
          role: "Treasurer",
          club: "SV München Untermenzing"
        }
      }
    }
  },
  de: {
    navigation: {
      features: "Funktionen",
      pricing: "Preise",
      support: "Support", 
      logIn: "Anmelden",
      bookDemo: "Demo buchen"
    },
    hero: {
      title: "Führen Sie Ihren Sportverein intelligenter",
      subtitle: "Mitgliedschaften. Zahlungen. Kommunikation. Eine Plattform.",
      description: "Die All-in-One-Lösung, die die Verwaltung Ihres Sportvereins mühelos macht, damit Sie sich auf das konzentrieren können, was am wichtigsten ist – Ihre Gemeinschaft.",
      seeFeatures: "Funktionen ansehen",
      gdprCompliant: "DSGVO-konform",
      bankLevelSecurity: "Bank-Level-Sicherheit"
    },
    footer: {
      description: "Die All-in-One-Plattform für die Verwaltung von Sportvereinsmitgliedschaften, Zahlungen, Kommunikation und mehr.",
      company: "Unternehmen",
      product: "Produkt",
      support: "Support", 
      legal: "Rechtliches",
      features: "Funktionen",
      security: "Sicherheit",
      integrations: "Integrationen",
      helpCenter: "Hilfecenter",
      contactUs: "Kontakt",
      systemStatus: "Systemstatus",
      termsOfService: "Nutzungsbedingungen",
      privacyPolicy: "Datenschutzrichtlinie",
      gdpr: "DSGVO",
      imprint: "Impressum",
      copyright: "© 2024 One4Team. Alle Rechte vorbehalten. v2.1.0"
    },
    login: {
      welcomeBack: "Willkommen zurück",
       signInDescription: "Melden Sie sich in Ihrem One4Team-Konto an, um fortzufahren",
      email: "E-Mail-Adresse",
      password: "Passwort",
      emailPlaceholder: "E-Mail-Adresse eingeben",
      passwordPlaceholder: "Passwort eingeben",
      forgotPassword: "Passwort vergessen?",
      createAccount: "Noch kein Konto?",
      signIn: "Anmelden",
      signUp: "Konto erstellen",
      or: "Oder",
      resetPassword: "Passwort zurücksetzen",
      resetPasswordDescription: "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts",
      sendResetLink: "Reset-Link senden",
      backToSignIn: "Zurück zur Anmeldung",
      checkYourEmail: "E-Mail prüfen",
      resetEmailSent: "Wir haben einen Link zum Zurücksetzen des Passworts an gesendet",
      didntReceiveEmail: "E-Mail nicht erhalten? Prüfen Sie Ihren Spam-Ordner oder",
      tryAgainDifferentEmail: "versuchen Sie es mit einer anderen E-Mail-Adresse",
      // Error messages
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      passwordTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
      invalidCredentials: "Ungültige E-Mail oder Passwort",
      accountNotFound: "Kein Konto mit dieser E-Mail-Adresse gefunden",
      incorrectPassword: "Falsches Passwort",
      accountExists: "Ein Konto mit dieser E-Mail-Adresse existiert bereits",
      generalError: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      resetEmailFailed: "Reset-E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      createAccountFailed: "Konto konnte nicht erstellt werden. Bitte versuchen Sie es erneut."
    },
    common: {
      language: "Sprache"
    },
    features: {
      title: "Alles, was Ihr Verein braucht... an einem Platz",
       subtitle: "Von der Mitgliederverwaltung bis zur Finanzverfolgung bietet One4Team alle Tools, die Sie für die effiziente Führung Ihres Sportvereins benötigen.",
      learnMore: "Mehr erfahren →",
      members: {
        title: "Mitglieder",
        description: "Verwalten Sie Mitgliederprofile, Registrierungen und Vereinshierarchie mühelos."
      },
      payments: {
        title: "Zahlungen & Rechnungen",
        description: "Automatisierte Abrechnung, Zahlungsverfolgung und Finanzberichte."
      },
      communication: {
        title: "Kommunikationstools",
        description: "Halten Sie alle mit Ankündigungen, Nachrichten und Benachrichtigungen verbunden."
      },
      teamShop: {
        title: "Team-Shop",
        description: "Verkaufen Sie Merchandise, Ausrüstung und Tickets direkt über Ihre Plattform."
      },
      websiteBuilder: {
        title: "Website-Builder",
        description: "Erstellen Sie eine professionelle Vereinswebsite ohne technische Kenntnisse."
      },
      reports: {
        title: "Berichte",
        description: "Erhalten Sie Einblicke in Mitgliederentwicklungen, Finanzen und Vereinsleistung."
      }
    },
    whyChoose: {
       title: "Warum One4Team wählen?",
      subtitle: "Speziell für Sportvereine entwickelt, von Menschen, die die einzigartigen Herausforderungen der Vereinsverwaltung verstehen.",
      benefits: {
        centralized: {
          title: "Zentralisierte Vereinsverwaltung",
          description: "Alle Ihre Vereinsabläufe in einer einheitlichen Plattform"
        },
        easyToUse: {
          title: "Einfach für alle – von Admins bis Spielern",
          description: "Intuitive Benutzeroberfläche, die jeder ohne Schulung nutzen kann"
        },
        secure: {
          title: "DSGVO-konform und sicher",
          description: "Bank-Level-Sicherheit mit vollständiger Compliance-Garantie"
        },
        responsive: {
          title: "Funktioniert auf allen Geräten",
          description: "Perfekte Erfahrung auf Desktop, Tablet und Mobilgerät"
        }
      },
      metrics: {
        members: {
          title: "Anzahl der Mitglieder",
          complete: "abgeschlossen"
        },
        matches: {
          title: "Geplante vs. gespielte Spiele",
          complete: "abgeschlossen"
        },
        tickets: {
          title: "Anzahl verkaufter Tickets",
          complete: "abgeschlossen"
        },
        shop: {
          title: "Anzahl Artikel im Shop",
          complete: "abgeschlossen"
        }
      }
    },
    testimonials: {
      title: "Vertraut von Vereinen überall",
       subtitle: "Sehen Sie, was Vereinsmanager über One4Team sagen",
joinClubs: "Schließen Sie sich 500+ Vereinen an, die bereits One4Team nutzen",
      testimonials: {
        maria: {
          quote: "One4Team hat die Art und Weise, wie wir unseren Verein verwalten, revolutioniert. Alles ist jetzt an einem Ort - Mitgliedschaften, Zahlungen, Kommunikation. Es ist ein echter Game-Changer!",
          author: "Maria Schmidt",
          role: "Vereinsmanagerin",
          club: "FC Grün-Weiss Grobenzell"
        },
        thomas: {
          quote: "Die Plattform ist unglaublich intuitiv. Unsere Mitglieder lieben den einfachen Registrierungsprozess und unser Admin-Team spart jede Woche Stunden bei manuellen Aufgaben.",
          author: "Thomas Weber",
          role: "Präsident",
          club: "TSV 1860 München"
        },
        anna: {
          quote: "Endlich eine Lösung, die Sportvereine versteht! Die Zahlungsverfolgung und Mitgliederverwaltung sind genau das, was wir brauchten.",
          author: "Anna Müller",
          role: "Schatzmeisterin",
          club: "SV München Untermenzing"
        }
      }
    }
  }
}

export function getTranslation(language: string): Translations {
  return translations[language] || translations.en
} 