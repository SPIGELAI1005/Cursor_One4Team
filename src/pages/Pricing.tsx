import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import BrandName from "@/components/BrandName";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, CheckCircle, Star, Users, Clock, Shield, Zap } from "lucide-react";
import PricingTiers from "@/components/pricing/PricingTiers";
import PriceCalculator from "@/components/pricing/PriceCalculator";
import FeatureComparison from "@/components/pricing/FeatureComparison";
import ExplainerVideo from "@/components/pricing/ExplainerVideo";
import EmailCapture from "@/components/pricing/EmailCapture";
import CheckoutSummary from "@/components/pricing/CheckoutSummary";
import PriceList from "@/components/pricing/PriceList";
import PromoBanner from "@/components/pricing/PromoBanner";
import TestimonialWall from "@/components/pricing/TestimonialWall";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function Pricing() {
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(50);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <>
      <Helmet>
        <title>Pricing - One4Team Sports Club Management</title>
        <meta 
          name="description" 
          content="Choose the perfect One4Team plan for your sports club. Transparent pricing starting from €14/year with flexible member-based billing." 
        />
        <meta name="keywords" content="sports club pricing, club management software, membership billing, One4Team plans" />
        <link rel="canonical" href={`${window.location.origin}/pricing`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <Link to="/" className="flex items-center gap-2">
                <BrandName className="text-xl font-bold" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Promo Banner */}
        <PromoBanner />

        <main className="container mx-auto px-4 py-8 space-y-16">
          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by 500+ sports clubs
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Choose the perfect plan for your{" "}
              <span className="gold-gradient-text">sports club</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Transparent pricing that scales with your club. Start with our free trial and upgrade as you grow.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </section>

        {/* Price List */}
        <PriceList billingCycle={billingCycle} />

        {/* Explainer Video */}
        <ExplainerVideo />

          {/* Price Calculator */}
          <PriceCalculator 
            memberCount={memberCount}
            setMemberCount={setMemberCount}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
          />

          {/* Pricing Tiers */}
          <PricingTiers 
            memberCount={memberCount}
            billingCycle={billingCycle}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />

          {/* Feature Comparison */}
          <FeatureComparison />

          {/* Benefits Section */}
          <section className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why choose <BrandName className="inline" />?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built specifically for sports clubs by people who understand your challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Member Management</h3>
                <p className="text-sm text-muted-foreground">
                  Complete member profiles, registrations, and communications
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  Automated billing, scheduling, and administrative tasks
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level security with full compliance guarantee
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Get started in minutes, not weeks. No technical knowledge required
                </p>
              </div>
            </div>
          </section>

          {/* Testimonial Wall */}
          <TestimonialWall />

          {/* Email Capture */}
          <EmailCapture />

          {/* Final CTA */}
          <section className="text-center bg-primary/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to transform your sports club?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of clubs already using One4Team to streamline operations and grow their membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </section>
        </main>

        {/* Checkout Summary */}
        {selectedPlan && (
          <CheckoutSummary 
            selectedPlan={selectedPlan}
            memberCount={memberCount}
            billingCycle={billingCycle}
            onClose={() => setSelectedPlan(null)}
          />
        )}
      </div>
    </>
  );
}