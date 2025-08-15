import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Crown, Diamond } from "lucide-react";
import { Link } from "react-router-dom";

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
    icon: <Star className="h-6 w-6" />,
    nickname: "Perfect for small clubs",
    description: "Essential features for grassroots clubs getting started",
    basePrice: 14,
    memberPrice: 1,
    features: [
      "Unlimited members",
      "Basic member management",
      "Simple scheduling",
      "Email notifications",
      "Basic reporting",
      "Community support"
    ]
  },
  {
    id: "growth",
    name: "Growth Club",
    icon: <Zap className="h-6 w-6" />,
    nickname: "Most popular choice",
    description: "Advanced features for growing clubs",
    basePrice: 28,
    memberPrice: 1,
    popular: true,
    features: [
      "Unlimited members",
      "Advanced member management",
      "Team scheduling & calendar",
      "Payment processing",
      "Communication tools",
      "Custom forms",
      "Priority support"
    ]
  },
  {
    id: "pro",
    name: "Pro Team",
    icon: <Crown className="h-6 w-6" />,
    nickname: "For serious clubs",
    description: "Professional tools for established teams",
    basePrice: 56,
    memberPrice: 3,
    features: [
      "Unlimited members",
      "Multi-team management",
      "Advanced analytics",
      "E-commerce integration",
      "Website builder",
      "API access",
      "Phone support"
    ]
  },
  {
    id: "champion",
    name: "Champion Club",
    icon: <Diamond className="h-6 w-6" />,
    nickname: "Elite performance",
    description: "Enterprise features for large organizations",
    basePrice: 112,
    memberPrice: 4,
    features: [
      "Unlimited members",
      "White-label solution",
      "Advanced integrations",
      "Custom workflows",
      "Dedicated manager",
      "Training & onboarding",
      "24/7 premium support"
    ]
  },
  {
    id: "bespoke",
    name: "Bespoke Club",
    icon: <Diamond className="h-6 w-6" />,
    nickname: "Tailored solution",
    description: "Custom solution for unique requirements",
    basePrice: 0, // Custom pricing
    memberPrice: 4,
    enterprise: true,
    features: [
      "Custom development",
      "Unlimited everything",
      "Personal consultant",
      "Custom integrations",
      "On-premise deployment",
      "SLA guarantee",
      "White-glove service"
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
          Choose your perfect plan
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          All plans include our core features. Scale up as your club grows with transparent, member-based pricing.
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
                  Most Popular
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
                  {tier.nickname}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {formatPrice(tier)}
                    {!tier.enterprise && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  
                  {!tier.enterprise && (
                    <div className="text-xs text-muted-foreground mt-1">
                      €{tier.basePrice} base + €{tier.memberPrice}/member/{billingCycle === 'yearly' ? 'year' : 'month'}
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {discount}% discount applied
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.description}
                </p>
                
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
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
                    Contact Sales
                  </Button>
                ) : (
                  <Link to="/register" className="w-full">
                    <Button 
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => setSelectedPlan(tier.id)}
                    >
                      Select Plan
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
          💡 <strong>Save 25%</strong> with yearly billing. All plans include a 14-day free trial with no credit card required.
        </p>
      </div>
    </section>
  );
}