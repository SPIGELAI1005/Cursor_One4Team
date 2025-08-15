import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, TrendingUp, Trophy, Medal, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  nickname: string;
  description: string;
  basePrice: number;
  memberPrice: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Club",
    icon: <Target className="h-6 w-6" />,
    nickname: "pricing.nickname.starter",
    description: "pricing.desc.starter",
    basePrice: 14,
    memberPrice: 1,
    features: [
      "feature.unlimitedMembers",
      "feature.basicMemberManagement",
      "feature.simpleScheduling",
      "feature.emailNotifications",
      "feature.basicReporting",
      "feature.communitySupport"
    ]
  },
  {
    id: "growth",
    name: "Growth Club",
    icon: <TrendingUp className="h-6 w-6" />,
    nickname: "pricing.nickname.growth",
    description: "pricing.desc.growth",
    basePrice: 28,
    memberPrice: 2,
    popular: true,
    features: [
      "feature.unlimitedMembers",
      "feature.advancedMemberManagement",
      "feature.teamSchedulingCalendar",
      "feature.paymentProcessing",
      "feature.communicationTools",
      "feature.customForms",
      "feature.prioritySupport"
    ]
  },
  {
    id: "pro",
    name: "Pro Team",
    icon: <Trophy className="h-6 w-6" />,
    nickname: "pricing.nickname.pro",
    description: "pricing.desc.pro",
    basePrice: 56,
    memberPrice: 3,
    features: [
      "feature.unlimitedMembers",
      "feature.multiTeamManagement",
      "feature.advancedAnalytics",
      "feature.ecommerceIntegration",
      "feature.websiteBuilder",
      "feature.apiAccess",
      "feature.phoneSupport"
    ]
  },
  {
    id: "champion",
    name: "Champion Club",
    icon: <Medal className="h-6 w-6" />,
    nickname: "pricing.nickname.champion",
    description: "pricing.desc.champion",
    basePrice: 112,
    memberPrice: 4,
    features: [
      "feature.unlimitedMembers",
      "feature.whiteLabelSolution",
      "feature.advancedIntegrations",
      "feature.customWorkflows",
      "feature.dedicatedManager",
      "feature.trainingOnboarding",
      "feature.premiumSupport"
    ]
  },
  {
    id: "bespoke",
    name: "Bespoke Club",
    icon: <Gem className="h-6 w-6" />,
    nickname: "pricing.nickname.bespoke",
    description: "pricing.desc.bespoke",
    basePrice: 0, // Custom pricing
    memberPrice: 4,
    enterprise: true,
    features: [
      "feature.customDevelopment",
      "feature.unlimitedEverything",
      "feature.personalConsultant",
      "feature.customIntegrations",
      "feature.onPremiseDeployment",
      "feature.slaGuarantee",
      "feature.whiteGloveService"
    ]
  }
];

interface PricingTiersProps {
  memberCount: number;
  billingCycle: "monthly" | "yearly";
  selectedPlan: string | null;
  setSelectedPlan: (plan: string) => void;
}

export default function PricingTiers({ 
  memberCount, 
  billingCycle, 
  selectedPlan, 
  setSelectedPlan 
}: PricingTiersProps) {
  const { t } = useI18n();
  
  const calculatePrice = (tier: PricingTier) => {
    if (tier.enterprise) return "Custom";
    
    if (billingCycle === "yearly") {
      // Yearly pricing: base price + member count * member price (both already yearly)
      return tier.basePrice + (memberCount * tier.memberPrice);
    } else {
      // Monthly pricing: 25% more than yearly equivalent
      const yearlyTotal = tier.basePrice + (memberCount * tier.memberPrice);
      const monthlyBase = Math.round(tier.basePrice * 1.25);
      const monthlyMemberPrice = Math.round(tier.memberPrice * 1.25 * 100) / 100; // Round to 2 decimals
      return Math.round(monthlyBase + (memberCount * monthlyMemberPrice));
    }
  };

  const calculateDiscount = (tier: PricingTier) => {
    const discountThresholds = {
      starter: 499,
      growth: 999,
      pro: 1999,
      champion: 2999,
      bespoke: 3999
    };

    return memberCount > discountThresholds[tier.id as keyof typeof discountThresholds] ? 15 : 0;
  };

  const formatPrice = (tier: PricingTier) => {
    const price = calculatePrice(tier);
    if (price === "Custom") return "Custom";
    
    const discount = calculateDiscount(tier);
    const finalPrice = discount > 0 ? Math.round(price * 0.85) : price;
    
    return `€${finalPrice}`;
  };

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t("pricing.tiers.title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("pricing.tiers.subtitle")}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {pricingTiers.map((tier) => {
          const discount = calculateDiscount(tier);
          const isSelected = selectedPlan === tier.id;
          
          return (
            <Card 
              key={tier.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                tier.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
              } ${isSelected ? 'ring-2 ring-secondary' : ''}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  {t("pricing.mostPopular")}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  tier.id === 'starter' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                  tier.id === 'growth' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                  tier.id === 'pro' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' :
                  tier.id === 'champion' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                }`}>
                  {tier.icon}
                </div>
                
                <CardTitle className="text-xl mb-1">{tier.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {t(tier.nickname)}
                </CardDescription>
                
                <div className="mt-4">
                  {tier.enterprise ? (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">{t("pricing.custom")}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("pricing.tailoredSolution")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        + €{billingCycle === 'yearly' ? tier.memberPrice : Math.round(tier.memberPrice * 1.25 * 100) / 100}/{t("pricing.perMember")}/{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        {formatPrice(tier)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        €{tier.basePrice} {t("pricing.basePrice")} + €{billingCycle === 'yearly' ? tier.memberPrice : Math.round(tier.memberPrice * 1.25 * 100) / 100}/{t("pricing.perMember")}/{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
                      </div>
                      
                      {discount > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {discount}% discount applied
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {t(tier.description)}
                </p>
                
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-0">
                {tier.enterprise ? (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSelectedPlan(tier.id)}
                  >
                    {t("pricing.contactSales")}
                  </Button>
                ) : (
                  <Link to="/register" className="w-full">
                    <Button 
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => setSelectedPlan(tier.id)}
                    >
                      {t("pricing.selectPlan")}
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Billing Cycle Note */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
        <p>
          💡 {t("pricing.saveYearly")}
        </p>
      </div>
    </section>
  );
}