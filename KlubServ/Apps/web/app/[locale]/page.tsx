'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CheckCircle2, Shield, Smartphone, Zap, Menu, Users, CreditCard, Calendar, MessageSquare, BarChart3, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';

// Brand components
const BrandName = ({ className = "" }: { className?: string }) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getLogoColors = () => {
    // Default to light mode colors to prevent hydration mismatch
    if (!mounted) {
      return {
        one: 'text-black',
        four: 'gradient-text hover-animate',
        team: 'text-black'
      };
    }
    
    // For system mode, we need to handle it differently
    if (theme === 'system') {
      // In system mode, "One" and "Team" should be blue-600, "4" should be neon green-blue
      return {
        one: 'text-blue-600',
        four: 'gradient-text hover-animate system',
        team: 'text-blue-600'
      };
    }
    
    // For light and dark modes, use resolvedTheme for accurate detection
    const currentTheme = resolvedTheme || theme;
    
    switch (currentTheme) {
      case 'light':
        return {
          one: 'text-black',
          four: 'gradient-text hover-animate',
          team: 'text-black'
        };
      case 'dark':
        return {
          one: 'text-white',
          four: 'gradient-text hover-animate',
          team: 'text-white'
        };
      default:
        // Fallback to system mode colors
        return {
          one: 'text-blue-600',
          four: 'gradient-text hover-animate system',
          team: 'text-blue-600'
        };
    }
  };

  const colors = getLogoColors();

  return (
    <Link href="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      <span className={`font-bold text-xl ${colors.one}`}>
        One
        <span className={`mx-0.5 ${colors.four}`}>4</span>
        <span className={colors.team}>Team</span>
      </span>
    </Link>
  );
};

// Hero Image Loop Component
const HeroImageLoop = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/lovable-uploads/f7fa8228-e4e5-4d57-9ef5-8a3452f44a83.png",
    "/lovable-uploads/e754b695-0c4d-4d3c-9144-a0bd29d4c8e0.png",
    "/lovable-uploads/995a1999-b3c9-44db-b414-ef702e8fc559.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl shadow-2xl">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Hero image ${index + 1}`}
          className={`absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain transition-all duration-2000 ease-out transform ${
            index === currentImage 
              ? 'opacity-100 scale-100 translate-x-0' 
              : index < currentImage 
                ? 'opacity-0 scale-95 -translate-x-4' 
                : 'opacity-0 scale-105 translate-x-4'
          }`}
          style={{
            filter: 'brightness(0.9) contrast(1.1)',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
      
             {/* Slide indicators */}
       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
         {images.map((_, index) => (
           <button
             key={index}
             className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
               index === currentImage 
                 ? 'bg-white scale-125 shadow-lg ring-2 ring-white/20' 
                 : 'bg-white/50 hover:bg-white/75 hover:scale-110'
             }`}
             onClick={() => setCurrentImage(index)}
           />
         ))}
       </div>
    </div>
  );
};

export default function LandingPage() {
  const navT = useTranslations('navigation');
  const heroT = useTranslations('hero');
  const featuresT = useTranslations('features');
  const statsT = useTranslations('stats');
  const ctaT = useTranslations('cta');
  const footerT = useTranslations('footer');
  const whyT = useTranslations('why');
  const testimonialsT = useTranslations('testimonials');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [slide, setSlide] = useState(0);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsInView, setStatsInView] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    void el.offsetWidth; // force reflow
    el.style.transition = "width 3000ms linear";
    el.style.width = "100%";
  }, [slide]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/90 text-foreground backdrop-blur">
        <div className="container mx-auto relative flex h-14 items-center justify-between px-4">
          <div className="absolute right-4 md:hidden">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-7 w-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 border-l border-orange-400/40">
                  <nav className="mt-6 grid gap-4 text-base">
                    <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">{navT('features')}</a>
                    <a href="#why" className="text-muted-foreground hover:text-foreground transition-colors">{navT('whyOne4Team')}</a>
                    <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">{navT('testimonials')}</a>
                    <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">{navT('pricing')}</Link>
                    <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">{navT('signIn')}</Link>
                                         <Link href="/dashboard" className={`font-medium hover:underline ${
                       mounted && theme === 'system' ? 'text-cyan-400' : 'text-secondary'
                     }`}>{navT('goToDashboard')}</Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BrandName />
          </div>
                     <nav className="hidden md:flex items-center gap-6">
             <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{navT('features')}</a>
             <a href="#why" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{navT('whyOne4Team')}</a>
             <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{navT('testimonials')}</a>
             <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{navT('pricing')}</Link>
             <div className="flex items-center gap-2">
               <ThemeToggle />
               <LanguageToggle />
             </div>
             <Link href="/sign-in">
               <Button variant="ghost" size="sm">{navT('signIn')}</Button>
             </Link>
                                                        <Link href="/dashboard">
                                 <Button size="sm" className={`font-medium px-4 py-2 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-700 ease-out ${
                   mounted && theme === 'system' 
                     ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-black hover:from-green-300 hover:via-cyan-300 hover:to-blue-400' 
                     : 'accent-button'
                 }`}>{navT('goToDashboard')}</Button>
              </Link>
           </nav>
        </div>
      </header>

      <main className="pt-14">
                 {/* Hero Section */}
                                     <section className={`relative overflow-hidden ${mounted && theme === 'system' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-yellow-50 via-background to-orange-50 dark:from-yellow-900/10 dark:via-background dark:to-orange-900/10'}`}>
           <div className="container mx-auto px-4 py-10 md:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                                 <div className="space-y-4">
                                       {heroT('tagline') && (
                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                             mounted && theme === 'system' 
                               ? 'bg-gradient-to-r from-green-400/10 via-cyan-400/10 to-blue-500/10 text-cyan-400' 
                               : 'golden-gradient/10'
                           }`}>
                   <Zap className="h-4 w-4" />
                   {heroT('tagline')}
                 </div>
                    )}
                                 <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-montserrat">
                   {heroT('headline')}{" "}
                   <span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>
                     {heroT('smarter')}
                   </span>
                 </h1>
                                       <p className="text-xl text-muted-foreground max-w-2xl whitespace-pre-line font-montserrat">
                      {heroT('description')}
                    </p>
                </div>
                
                                 <div className="flex flex-col sm:flex-row gap-4">
                                 <Link href="/dashboard">
                                       <Button size="lg" className={`w-full sm:w-auto font-medium px-4 py-2 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-700 ease-out ${
                      mounted && theme === 'system' 
                        ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-black hover:from-green-300 hover:via-cyan-300 hover:to-blue-400' 
                        : 'accent-button'
                    }`}>
                      {heroT('getStartedFree')}
                    </Button>
                 </Link>
                <Link href="/pricing">
                  <button 
                    className="w-full sm:w-auto h-11 px-8 rounded-md text-base font-medium transition-all duration-300 custom-outline-button border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 red-hover"
                  >
                    {heroT('viewPricing')}
                  </button>
                </Link>
                 </div>

                                                      <div className="flex items-center gap-8 text-sm text-muted-foreground">
                     <div className="flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4 text-green-500" />
                       <span>{heroT('trustIndicators.freeTrial')}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4 text-green-500" />
                       <span>{heroT('trustIndicators.noCreditCard')}</span>
                     </div>
                   </div>
              </div>
              
              <div className="relative">
                <HeroImageLoop />
              </div>
            </div>
          </div>
        </section>

                 {/* Features Section */}
         <section id="features" className="py-16 bg-background">
           <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-12">
                                                 <h2 className="text-3xl md:text-4xl font-bold font-montserrat">
                  {featuresT('title')}{" "}
                  <span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>
                    {featuresT('inOnePlace')}
                  </span>
                </h2>
                                 <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-montserrat">
                   {featuresT('subtitle').replace('One4Team', '')}
                   <span className="font-bold">
                     One<span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>4</span>Team
                   </span>
                   {" "}{featuresT('subtitle').split('One4Team')[1]}
                 </p>
              </div>

                           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Users,
                    title: featuresT('memberManagement.title'),
                    description: featuresT('memberManagement.description')
                  },
                  {
                    icon: CreditCard,
                    title: featuresT('paymentProcessing.title'),
                    description: featuresT('paymentProcessing.description')
                  },
                  {
                    icon: Calendar,
                    title: featuresT('scheduleManagement.title'),
                    description: featuresT('scheduleManagement.description')
                  },
                  {
                    icon: MessageSquare,
                    title: featuresT('communication.title'),
                    description: featuresT('communication.description')
                  },
                  {
                    icon: BarChart3,
                    title: featuresT('analytics.title'),
                    description: featuresT('analytics.description')
                  },
                  {
                    icon: Lock,
                    title: featuresT('security.title'),
                    description: featuresT('security.description')
                  }
                ].map((feature, index) => (
                                     <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 group">
                     <CardHeader className="pb-3">
                       <div className="mb-3">
                         <feature.icon className={`w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${mounted && theme === 'system' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-amber-500 group-hover:text-amber-400'}`} />
                       </div>
                       <CardTitle className="text-lg font-montserrat group-hover:text-foreground transition-colors duration-300">{feature.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <p className="text-sm text-muted-foreground font-montserrat group-hover:text-muted-foreground/80 transition-colors duration-300">{feature.description}</p>
                     </CardContent>
                   </Card>
                ))}
             </div>
           </div>
                   </section>

                   {/* Why Choose One4Team Section */}
          <section id="why" className="py-20 bg-background">
            <div className="container mx-auto px-4">
              {/* Header Section */}
                                            <div className="text-center space-y-4 mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold font-montserrat">
                   {whyT('title').replace('One4Team', '').replace('?', '')}
                   <span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>One4Team</span>
                   ?
                 </h2>
                 <p className="text-lg text-muted-foreground font-montserrat max-w-3xl mx-auto">
                   {whyT('subtitle')}
                 </p>
               </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Section - Features */}
                <div className="space-y-6">
                                     {[
                     {
                       icon: Zap,
                       title: whyT('features.centralized.title'),
                       description: whyT('features.centralized.description')
                     },
                     {
                       icon: Smartphone,
                       title: whyT('features.easy.title'),
                       description: whyT('features.easy.description')
                     },
                     {
                       icon: Shield,
                       title: whyT('features.secure.title'),
                       description: whyT('features.secure.description')
                     },
                     {
                       icon: Calendar,
                       title: whyT('features.devices.title'),
                       description: whyT('features.devices.description')
                     }
                   ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 mt-1">
                        <feature.icon className={`w-6 h-6 transition-all duration-300 group-hover:scale-110 ${mounted && theme === 'system' ? 'text-cyan-400' : 'text-amber-500'}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg font-montserrat group-hover:text-foreground transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground font-montserrat">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Section - KPIs */}
                <div className="bg-card border rounded-lg p-6 h-full flex flex-col">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                                         {[
                       { title: whyT('kpis.members'), percentage: 87 },
                       { title: whyT('kpis.matches'), percentage: 92 },
                       { title: whyT('kpis.tickets'), percentage: 78 },
                       { title: whyT('kpis.shop'), percentage: 65 }
                     ].map((kpi, index) => (
                      <div key={index} className="bg-background/50 border rounded-lg p-3 space-y-2 group hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-xs font-montserrat group-hover:text-foreground transition-colors">{kpi.title}</h4>
                          <span className={`text-xl font-bold transition-all duration-300 group-hover:scale-110 ${
                            mounted && theme === 'system' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-amber-500 group-hover:text-amber-400'
                          }`}>
                            {kpi.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg ${
                              mounted && theme === 'system' 
                                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 group-hover:from-cyan-300 group-hover:to-cyan-400' 
                                : 'bg-gradient-to-r from-amber-400 to-amber-500 group-hover:from-amber-300 group-hover:to-amber-400'
                            }`}
                            style={{ width: `${kpi.percentage}%` }}
                          />
                        </div>
                                                 <p className="text-xs text-muted-foreground font-montserrat group-hover:text-foreground/80 transition-colors">
                           {kpi.percentage}% {whyT('kpis.complete')}
                         </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

         {/* Testimonials Section */}
         <section id="testimonials" className="py-20 bg-background">
           <div className="container mx-auto px-4">
                           <div className="text-center space-y-4 mb-12">
                                 <h2 className="text-3xl md:text-4xl font-bold font-montserrat">
                   {testimonialsT('title')}{" "}
                   <span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>
                     {testimonialsT('everywhere')}
                   </span>
                 </h2>
                <p className="text-lg text-muted-foreground font-montserrat max-w-3xl mx-auto">
                  {testimonialsT('subtitle').replace('One4Team', '')}
                  <span className="font-bold">
                    One<span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>4</span>Team
                  </span>
                  .
                </p>
              </div>

             {/* Testimonial Cards */}
             <div className="grid md:grid-cols-3 gap-6 mb-12">
                                                               {[
                   {
                     quote: testimonialsT('quotes.maria'),
                     author: "Maria Schmidt",
                     role: "Club Manager",
                     club: "FC Grün-Weiss Grobenzell",
                     initials: "MS",
                     image: "/testimonial-avatars/maria-schmidt.jpg.jpg"
                   },
                   {
                     quote: testimonialsT('quotes.thomas'),
                     author: "Thomas Weber",
                     role: "President",
                     club: "TSV 1860 München",
                     initials: "TW",
                     image: "/testimonial-avatars/thomas-weber.jpg.jpg"
                   },
                   {
                     quote: testimonialsT('quotes.anna'),
                     author: "Anna Müller",
                     role: "Treasurer",
                     club: "SV München Untermenzing",
                     initials: "AM",
                     image: "/testimonial-avatars/anna-müller.jpg.jpg"
                   }
                 ].map((testimonial, index) => (
                 <Card key={index} className="p-6 bg-card border hover:shadow-lg transition-all duration-300 group">
                   <CardContent className="space-y-4">
                     {/* Star Rating */}
                     <div className="flex text-amber-400">
                       {[...Array(5)].map((_, i) => (
                         <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                       ))}
                     </div>
                     
                     {/* Quote */}
                     <blockquote className="text-muted-foreground italic font-montserrat">
                       "{testimonial.quote}"
                     </blockquote>
                     
                                           {/* Author Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-muted">
                          <img 
                            src={testimonial.image}
                            alt={`${testimonial.author} - ${testimonial.role}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'w-12 h-12 bg-muted rounded-full flex items-center justify-center border-2 border-muted';
                                parent.innerHTML = `<span class="text-sm font-semibold text-foreground">${testimonial.initials}</span>`;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground font-montserrat">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-muted-foreground font-montserrat">
                            {testimonial.role}, {testimonial.club}
                          </div>
                        </div>
                      </div>
                   </CardContent>
                 </Card>
               ))}
             </div>

             {/* CTA and Club Logos */}
             <div className="text-center space-y-8">
                               <p className="text-lg text-muted-foreground font-montserrat">
                  {testimonialsT('joinText').replace('One4Team', '')}
                  <span className="font-bold">
                    One<span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>4</span>Team
                  </span>
                </p>
               
                               {/* Club Logos */}
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    {
                      name: "TSV Allach 09",
                      image: "/club-logos/TSV Allach 09.png"
                    },
                    {
                      name: "FC Grün-Weiss Grobenzell",
                      image: "/club-logos/Grobenzell.png"
                    },
                    {
                      name: "FC Augsburg",
                      image: "/club-logos/FCA.png"
                    },
                    {
                      name: "1860 München",
                      image: "/club-logos/1860.jpeg"
                    }
                  ].map((club, index) => (
                                         <div key={index} className="flex flex-col items-center gap-2 p-4 bg-card border rounded-lg hover:shadow-lg transition-all duration-300 group">
                       <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg p-2 border overflow-hidden">
                         <img 
                           src={club.image}
                           alt={`${club.name} logo`}
                           className="w-12 h-12 object-contain"
                           onError={(e) => {
                             // Fallback to initials if image fails to load
                             const target = e.target as HTMLImageElement;
                             target.style.display = 'none';
                             const parent = target.parentElement;
                             if (parent) {
                               parent.className = 'w-16 h-16 flex items-center justify-center bg-white rounded-lg p-2 border';
                               parent.innerHTML = `<div class="w-12 h-12 bg-muted rounded flex items-center justify-center"><span class="text-xs font-bold text-muted-foreground">${club.name.split(' ').map(word => word[0]).join('')}</span></div>`;
                             }
                           }}
                         />
                       </div>
                     </div>
                  ))}
                </div>
             </div>
           </div>
         </section>

         {/* Stats Section */}
                 <section ref={statsRef} className={`py-20 ${
           mounted && theme === 'system' 
             ? 'bg-gradient-to-r from-green-400/5 via-cyan-400/5 to-blue-500/5' 
             : 'golden-gradient/5'
         }`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: statsT('activeClubs') },
                { number: "50k+", label: statsT('members') },
                { number: "99.9%", label: statsT('uptime') },
                { number: "24/7", label: statsT('support') }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                                     <div className={`text-3xl md:text-4xl font-bold gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''} transition-all duration-1000 ${
                     statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                   }`}>
                     {stat.number}
                   </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
                 <section className={`py-20 text-white ${
           mounted && theme === 'system' 
             ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500' 
             : 'golden-gradient'
         }`}>
          <div className="container mx-auto px-4 text-center">
                         <div className="max-w-3xl mx-auto space-y-8">
                                                <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-black">
                   {ctaT('title')}
                 </h2>
                 <p className="text-xl opacity-90 font-montserrat text-black">
                   {ctaT('subtitle')}
                 </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                   <Link href="/dashboard">
                                         <Button size="lg" className={`w-full sm:w-auto font-medium px-4 py-2 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-700 ease-out ${
                       mounted && theme === 'system' 
                         ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-black hover:from-green-300 hover:via-cyan-300 hover:to-blue-400' 
                         : 'accent-button'
                     }`}>
                       {ctaT('startFreeTrial')}
                     </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className={`w-full sm:w-auto border-white text-white hover:bg-white ${
                      mounted && theme === 'system' 
                        ? 'hover:text-cyan-600' 
                        : 'hover:text-orange-500'
                    }`}>
                      {ctaT('viewPricingPlans')}
                    </Button>
                  </Link>
               </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
                     <div className="grid md:grid-cols-4 gap-8">
             <div className="space-y-4">
               <BrandName />
                               <p className="text-sm text-muted-foreground font-montserrat">
                  {footerT('description')}
                </p>
             </div>
             <div className="space-y-4">
                               <h3 className="font-semibold font-montserrat">{footerT('product')}</h3>
                <div className="space-y-2 text-sm">
                  <Link href="#features" className="block text-muted-foreground hover:text-foreground font-montserrat">{navT('features')}</Link>
                  <Link href="/pricing" className="block text-muted-foreground hover:text-foreground font-montserrat">{navT('pricing')}</Link>
                  <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground font-montserrat">{navT('goToDashboard')}</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold font-montserrat">{footerT('company')}</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/about" className="block text-muted-foreground hover:text-foreground font-montserrat">{footerT('about')}</Link>
                  <Link href="/contact" className="block text-muted-foreground hover:text-foreground font-montserrat">{footerT('contact')}</Link>
                  <Link href="/support" className="block text-muted-foreground hover:text-foreground font-montserrat">{footerT('support')}</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold font-montserrat">{footerT('legal')}</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/privacy" className="block text-muted-foreground hover:text-foreground font-montserrat">{footerT('privacy')}</Link>
                  <Link href="/terms" className="block text-muted-foreground hover:text-foreground font-montserrat">{footerT('terms')}</Link>
                </div>
             </div>
           </div>
                       <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground font-montserrat">
              {footerT('copyright')}
            </div>
        </div>
      </footer>
    </>
  );
} 