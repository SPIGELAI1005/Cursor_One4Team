import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "de";

type Dict = Record<string, string>;

type Translations = Record<Lang, Dict>;

const translations: Translations = {
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.why": "Why One4Team",
    "nav.testimonials": "Testimonials",
    "nav.pricing": "Pricing",
    "nav.goDashboard": "Go to Dashboard",

    // Landing - Hero
    "landing.hero.title1": "Run your sports club",
    "landing.hero.title2": "Smarter",
    "landing.hero.lead.short": "Memberships. Payments. Communication. One platform. Built for clubs of any size.",
    "landing.hero.lead.long": "Memberships. Payments. Communication. One platform. Built for clubs of any size.",
    "landing.cta.start": "Start Free Trial",
    "landing.cta.features": "See Features",
    "landing.badge.gdpr": "GDPR compliant",
    "landing.badge.security": "Bank‑level security",

    // Landing - Features section
    "landing.features.heading": "Everything your club needs in one place",
    "landing.features.heading.base": "Everything your club needs",
    "landing.features.heading.emph": "in one place",
    "landing.features.lead": "From member management to financial tracking, One4Team provides all the tools you need to run your club efficiently.",
    "landing.features.lead.pre": "From member management to financial tracking, ",
    "landing.features.lead.post": " provides all the tools you need to run your club efficiently.",
    "landing.features.members.title": "Members",
    "landing.features.members.desc": "Manage member profiles, registrations, and club hierarchy with ease.",
    "landing.features.payments.title": "Payments & Invoices",
    "landing.features.payments.desc": "Automated billing, payment tracking, and financial reporting.",
    "landing.features.comm.title": "Communication Tools",
    "landing.features.comm.desc": "Announcements, messaging, and notifications to keep everyone aligned.",
    "landing.features.shop.title": "Team Shop",
    "landing.features.shop.desc": "Sell merchandise, equipment, and tickets directly through your platform.",
    "landing.features.website.title": "Website Builder",
    "landing.features.website.desc": "Create a professional club website without technical knowledge.",
    "landing.features.reports.title": "Reports",
    "landing.features.reports.desc": "Insights into membership trends, finances, and performance.",

    // Landing - Why
    "landing.why.heading": "Why choose One4Team?",
    "landing.why.lead": "Built specifically for sports clubs, by people who understand the unique challenges of club management.",
    "landing.why.b1.title": "Centralized club administration",
    "landing.why.b1.desc": "All your club operations in one unified platform",
    "landing.why.b2.title": "Easy for everyone",
    "landing.why.b2.desc": "Intuitive interface that anyone can use without training",
    "landing.why.b3.title": "GDPR-compliant and secure",
    "landing.why.b3.desc": "Bank‑level security with full compliance guarantee",
    "landing.why.b4.title": "Works on all devices",
    "landing.why.b4.desc": "Perfect experience on desktop, tablet and mobile",

    // Landing - Metrics
    "landing.metrics.members": "Number of Members",
    "landing.metrics.matches": "Matches Planned vs. Played",
    "landing.metrics.tickets": "Number of Tickets Sold",
    "landing.metrics.shop": "Items in Shop",
    "landing.metrics.complete": "complete",

    // Landing - Testimonials
    "landing.testimonials.heading": "Trusted by clubs everywhere",
    "landing.testimonials.sub.pre": "See what club managers are saying about ",
    "landing.testimonials.sub.post": ".",
    "landing.testimonials.q1": "One4Team has revolutionized the way we manage our club. Everything is now in one place – memberships, payments, communication. It's a real game‑changer!",
    "landing.testimonials.q2": "The platform is incredibly intuitive. Our members love the simple registration process and our admin team saves hours every week on manual tasks.",
    "landing.testimonials.q3": "Finally a solution that understands sports clubs! Payment tracking and member management are exactly what we needed.",
    "landing.testimonials.role.manager": "Club Manager",
    "landing.testimonials.role.president": "President",
    "landing.testimonials.role.treasurer": "Treasurer",
    "landing.testimonials.join": "Join 500+ clubs that already use One4Team",

    // Landing - CTA bottom
    "landing.cta2.heading": "Ready to transform your sports club?",
    "landing.cta2.lead": "Join clubs already using One4Team to streamline operations and grow their membership.",
    "landing.cta2.contact": "Contact Sales",


    // Dashboard / Index
    "index.hero.title": "One4Team Sports Club Dashboard",
    "index.hero.sub": "Memberships. Payments. Communication. One Platform.",
    "index.card.members": "Total Members",
    "index.card.revenue": "Revenue This Month",
    "index.card.todo": "To‑Do",
    "index.todo.1": "Send payment reminders",
    "index.todo.2": "Publish U12 training schedule",
    "index.todo.3": "Approve 5 new members",
    "index.card.upcoming": "Upcoming Trainings",
    "index.card.activity": "Member Activity by Team",

    // Schedules
    "schedules.title": "Schedules",
    "schedules.selectDate": "Select Date",
    "schedules.upcoming": "Upcoming Sessions",
    "schedules.item.1": "Today, 18:00 – U16 Fitness",
    "schedules.item.2": "Tomorrow, 17:30 – Seniors Match Prep",
    "schedules.item.3": "Fri, 16:00 – U12 Drills",

    // Not Found
    "notfound.title": "Oops! Page not found",
    "notfound.back": "Return to Home",

    // Sidebar
    "sidebar.main": "Main",
    "sidebar.home": "Home",
    "sidebar.dashboard": "Dashboard",
    "sidebar.members": "Members",
    "sidebar.teams": "Teams",
    "sidebar.schedules": "Schedules",
    "sidebar.payments": "Payments",
    "sidebar.communication": "Communication",
    "sidebar.reports": "Reports",
    "sidebar.settings": "Settings",

    // Header Search placeholder
    "header.search": "Search members, teams, schedules...",

    // Pricing Page
    "pricing.title": "Pricing Plans",
    "pricing.hero.title": "Simple, transparent pricing",
    "pricing.hero.subtitle": "Choose the perfect plan for your sports club. Scale up as you grow with member-based pricing.",
    "pricing.transparent.title": "Transparent Pricing Structure",
    "pricing.transparent.subtitle": "Simple, predictable pricing that scales with your club. No hidden fees, no surprises.",
    "pricing.tiers.title": "Choose your perfect plan",
    "pricing.tiers.subtitle": "All plans include our core features. Scale up as your club grows with transparent, member-based pricing.",
    "pricing.features.title": "Compare all features",
    "pricing.features.subtitle": "See exactly what's included in each plan. All features are designed specifically for sports clubs.",
    "pricing.plan.starter": "Starter Club",
    "pricing.plan.growth": "Growth Club",
    "pricing.plan.pro": "Pro Team",
    "pricing.plan.champion": "Champion Club",
    "pricing.plan.bespoke": "Bespoke Club",
    "pricing.nickname.starter": "Perfect for small clubs",
    "pricing.nickname.growth": "Most popular choice",
    "pricing.nickname.pro": "For serious clubs",
    "pricing.nickname.champion": "Elite performance",
    "pricing.nickname.bespoke": "Tailored solution",
    "pricing.desc.starter": "Essential features for grassroots clubs getting started",
    "pricing.desc.growth": "Advanced features for growing clubs",
    "pricing.desc.pro": "Professional tools for established teams",
    "pricing.desc.champion": "Enterprise features for large organizations",
    "pricing.desc.bespoke": "Custom solution for unique requirements",
    "pricing.basePrice": "base price",
    "pricing.perMember": "per member",
    "pricing.perYear": "year",
    "pricing.perMonth": "month",
    "pricing.selectPlan": "Select Plan",
    "pricing.contactSales": "Contact Sales",
    "pricing.mostPopular": "Most Popular",
    "pricing.custom": "Custom",
    "pricing.tailoredSolution": "Tailored solution",
    "pricing.example": "Example: 50 members on Growth Club =",
    "pricing.saveYearly": "Save 25% with yearly billing. All plans include a 14-day free trial with no credit card required.",
  },
  de: {
    // Navigation
    "nav.features": "Funktionen",
    "nav.why": "Warum One4Team",
    "nav.testimonials": "Referenzen",
    "nav.pricing": "Preise",
    "nav.goDashboard": "Zum Dashboard",

    // Landing - Hero
    "landing.hero.title1": "Führe deinen Sportverein",
    "landing.hero.title2": "smarter",
    "landing.hero.lead.short": "Mitgliedschaften. Zahlungen. Kommunikation. Eine Plattform. Für Vereine jeder Größe.",
    "landing.hero.lead.long": "Mitgliedschaften. Zahlungen. Kommunikation. Eine Plattform. Für Vereine jeder Größe.",
    "landing.cta.start": "Kostenlos testen",
    "landing.cta.features": "Funktionen ansehen",
    "landing.badge.gdpr": "DSGVO‑konform",
    "landing.badge.security": "Sicher auf Bankniveau",

    // Landing - Features section
    "landing.features.heading": "Alles, was euer Verein braucht – an einem Ort",
    "landing.features.heading.base": "Alles, was euer Verein braucht,",
    "landing.features.heading.emph": "an einem Ort",
    "landing.features.lead": "Von der Mitgliederverwaltung bis zur Finanzübersicht: One4Team bietet alle Werkzeuge, um euren Verein effizient zu führen.",
    "landing.features.lead.pre": "Von der Mitgliederverwaltung bis zur Finanzübersicht: ",
    "landing.features.lead.post": " bietet alle Werkzeuge, um euren Verein effizient zu führen.",
    "landing.features.members.title": "Mitglieder",
    "landing.features.members.desc": "Mitgliedsprofile, Anmeldungen und Vereinsstruktur mühelos verwalten.",
    "landing.features.payments.title": "Zahlungen & Rechnungen",
    "landing.features.payments.desc": "Automatisches Abrechnen, Zahlungstracking und Finanzberichte.",
    "landing.features.comm.title": "Kommunikationstools",
    "landing.features.comm.desc": "Ankündigungen, Nachrichten und Benachrichtigungen halten alle auf dem Laufenden.",
    "landing.features.shop.title": "Vereinsshop",
    "landing.features.shop.desc": "Merchandise, Ausrüstung und Tickets direkt über eure Plattform verkaufen.",
    "landing.features.website.title": "Webseiten‑Baukasten",
    "landing.features.website.desc": "Erstellt eine professionelle Vereinswebsite ohne technische Kenntnisse.",
    "landing.features.reports.title": "Berichte",
    "landing.features.reports.desc": "Einblicke in Mitgliederentwicklung, Finanzen und Leistung.",

    // Landing - Why
    "landing.why.heading": "Warum One4Team?",
    "landing.why.lead": "Speziell für Sportvereine entwickelt – von Menschen, die die Herausforderungen im Vereinsalltag kennen.",
    "landing.why.b1.title": "Zentrale Vereinsverwaltung",
    "landing.why.b1.desc": "Alle Vereinsprozesse auf einer Plattform",
    "landing.why.b2.title": "Einfach für alle",
    "landing.why.b2.desc": "Intuitive Oberfläche – ganz ohne Schulung nutzbar",
    "landing.why.b3.title": "DSGVO‑konform und sicher",
    "landing.why.b3.desc": "Sicherheit auf Bankniveau mit voller Compliance‑Garantie",
    "landing.why.b4.title": "Auf allen Geräten",
    "landing.why.b4.desc": "Optimale Nutzung auf Desktop, Tablet und Smartphone",

    // Landing - Metrics
    "landing.metrics.members": "Anzahl der Mitglieder",
    "landing.metrics.matches": "Geplante vs. gespielte Spiele",
    "landing.metrics.tickets": "Verkaufte Tickets",
    "landing.metrics.shop": "Artikel im Shop",
    "landing.metrics.complete": "abgeschlossen",

    // Landing - Testimonials
    "landing.testimonials.heading": "Vertrauen von Vereinen überall",
    "landing.testimonials.sub.pre": "Das sagen Vereinsmanager über ",
    "landing.testimonials.sub.post": ".",
    "landing.testimonials.q1": "One4Team hat unsere Vereinsverwaltung revolutioniert. Alles an einem Ort – Mitgliedschaften, Zahlungen, Kommunikation. Ein echter Game‑Changer!",
    "landing.testimonials.q2": "Die Plattform ist unglaublich intuitiv. Unsere Mitglieder lieben die einfache Anmeldung und unser Admin‑Team spart jede Woche Stunden an manueller Arbeit.",
    "landing.testimonials.q3": "Endlich eine Lösung, die Sportvereine versteht! Zahlungsnachverfolgung und Mitgliederverwaltung sind genau das, was wir brauchen.",
    "landing.testimonials.role.manager": "Vereinsmanagerin",
    "landing.testimonials.role.president": "Präsident",
    "landing.testimonials.role.treasurer": "Kassiererin",
    "landing.testimonials.join": "Schließe dich 500+ Vereinen an, die One4Team bereits nutzen",

    // Landing - CTA bottom
    "landing.cta2.heading": "Bereit, euren Sportverein zu transformieren?",
    "landing.cta2.lead": "Schließe dich Vereinen an, die mit One4Team Prozesse vereinfachen und wachsen.",
    "landing.cta2.contact": "Vertrieb kontaktieren",


    // Dashboard / Index
    "index.hero.title": "One4Team Vereins‑Dashboard",
    "index.hero.sub": "Mitgliedschaften. Zahlungen. Kommunikation. Eine Plattform.",
    "index.card.members": "Mitglieder insgesamt",
    "index.card.revenue": "Umsatz in diesem Monat",
    "index.card.todo": "To‑do",
    "index.todo.1": "Zahlungserinnerungen versenden",
    "index.todo.2": "U12‑Trainingsplan veröffentlichen",
    "index.todo.3": "5 neue Mitglieder freigeben",
    "index.card.upcoming": "Bevorstehende Trainings",
    "index.card.activity": "Mitgliederaktivität nach Team",

    // Schedules
    "schedules.title": "Termine",
    "schedules.selectDate": "Datum auswählen",
    "schedules.upcoming": "Bevorstehende Einheiten",
    "schedules.item.1": "Heute, 18:00 – U16 Fitness",
    "schedules.item.2": "Morgen, 17:30 – Senioren Spielvorbereitung",
    "schedules.item.3": "Fr, 16:00 – U12 Techniktraining",

    // Not Found
    "notfound.title": "Ups! Seite nicht gefunden",
    "notfound.back": "Zur Startseite",

    // Sidebar
    "sidebar.main": "Allgemein",
    "sidebar.home": "Startseite",
    "sidebar.dashboard": "Dashboard",
    "sidebar.members": "Mitglieder",
    "sidebar.teams": "Teams",
    "sidebar.schedules": "Termine",
    "sidebar.payments": "Zahlungen",
    "sidebar.communication": "Kommunikation",
    "sidebar.reports": "Berichte",
    "sidebar.settings": "Einstellungen",

    // Header Search placeholder
    "header.search": "Mitglieder, Teams, Termine suchen...",

    // Pricing Page
    "pricing.title": "Preispläne",
    "pricing.hero.title": "Einfache, transparente Preise",
    "pricing.hero.subtitle": "Wähle den perfekten Plan für deinen Sportverein. Wachse mit mitgliederbasierten Preisen.",
    "pricing.transparent.title": "Transparente Preisstruktur",
    "pricing.transparent.subtitle": "Einfache, vorhersehbare Preise, die mit eurem Verein wachsen. Keine versteckten Gebühren, keine Überraschungen.",
    "pricing.tiers.title": "Wähle deinen perfekten Plan",
    "pricing.tiers.subtitle": "Alle Pläne enthalten unsere Kernfunktionen. Wachse mit transparenten, mitgliederbasierten Preisen.",
    "pricing.features.title": "Alle Funktionen vergleichen",
    "pricing.features.subtitle": "Seht genau, was in jedem Plan enthalten ist. Alle Funktionen sind speziell für Sportvereine entwickelt.",
    "pricing.plan.starter": "Starter Club",
    "pricing.plan.growth": "Growth Club",
    "pricing.plan.pro": "Pro Team",
    "pricing.plan.champion": "Champion Club",
    "pricing.plan.bespoke": "Bespoke Club",
    "pricing.nickname.starter": "Perfekt für kleine Vereine",
    "pricing.nickname.growth": "Beliebteste Wahl",
    "pricing.nickname.pro": "Für ernsthafte Vereine",
    "pricing.nickname.champion": "Elite Performance",
    "pricing.nickname.bespoke": "Maßgeschneiderte Lösung",
    "pricing.desc.starter": "Wesentliche Funktionen für Grassroots-Vereine beim Start",
    "pricing.desc.growth": "Erweiterte Funktionen für wachsende Vereine",
    "pricing.desc.pro": "Professionelle Tools für etablierte Teams",
    "pricing.desc.champion": "Enterprise-Funktionen für große Organisationen",
    "pricing.desc.bespoke": "Individuelle Lösung für einzigartige Anforderungen",
    "pricing.basePrice": "Grundpreis",
    "pricing.perMember": "pro Mitglied",
    "pricing.perYear": "Jahr",
    "pricing.perMonth": "Monat",
    "pricing.selectPlan": "Plan wählen",
    "pricing.contactSales": "Vertrieb kontaktieren",
    "pricing.mostPopular": "Beliebteste",
    "pricing.custom": "Individuell",
    "pricing.tailoredSolution": "Maßgeschneiderte Lösung",
    "pricing.example": "Beispiel: 50 Mitglieder im Growth Club =",
    "pricing.saveYearly": "Spare 25% mit jährlicher Abrechnung. Alle Pläne beinhalten eine 14-tägige kostenlose Testversion ohne Kreditkarte.",

    // Footer
    "footer.tagline": "Eine Plattform. Für euer Team.",
    "footer.product": "Produkt",
    "footer.pricing": "Preise",
    "footer.getStarted": "Loslegen",
    "footer.company": "Unternehmen",
    "footer.about": "Über uns",
    "footer.privacy": "Datenschutz",
    "footer.legal": "Impressum",
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      const initial = stored ?? (navigator.language.startsWith("de") ? "de" : "en");
      setLangState(initial);
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  }, []);

  const t = useCallback((key: string) => {
    const dict = translations[lang] || translations.en;
    return dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
