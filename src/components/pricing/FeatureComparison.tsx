import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/i18n/I18nProvider";

interface Feature {
  category: string;
  name: string;
  description?: string;
  starter: boolean | string;
  growth: boolean | string;
  pro: boolean | string;
  champion: boolean | string;
  bespoke: boolean | string;
}

const features: Feature[] = [
  // Core Features
  {
    category: "Core Features",
    name: "Member Management",
    description: "Manage member profiles, registrations, and data",
    starter: true,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Core Features", 
    name: "Member Limit",
    starter: "Unlimited",
    growth: "Unlimited", 
    pro: "Unlimited",
    champion: "Unlimited",
    bespoke: "Unlimited"
  },
  {
    category: "Core Features",
    name: "Team Management",
    starter: "Basic",
    growth: "Advanced",
    pro: "Multi-team",
    champion: "Enterprise",
    bespoke: "Custom"
  },
  {
    category: "Core Features",
    name: "Scheduling & Calendar",
    starter: true,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },

  // Communication
  {
    category: "Communication",
    name: "Email Notifications",
    starter: true,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Communication",
    name: "SMS Notifications", 
    starter: false,
    growth: "100/month",
    pro: "500/month",
    champion: "Unlimited",
    bespoke: "Unlimited"
  },
  {
    category: "Communication",
    name: "In-app Messaging",
    starter: false,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Communication",
    name: "Push Notifications",
    starter: false,
    growth: false,
    pro: true,
    champion: true,
    bespoke: true
  },

  // Payments & Billing
  {
    category: "Payments & Billing",
    name: "Payment Processing",
    starter: false,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Payments & Billing",
    name: "Automated Billing",
    starter: false,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Payments & Billing",
    name: "Invoice Generation",
    starter: false,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Payments & Billing",
    name: "Financial Reporting",
    starter: "Basic",
    growth: "Advanced",
    pro: "Advanced",
    champion: "Enterprise",
    bespoke: "Custom"
  },

  // Advanced Features
  {
    category: "Advanced Features",
    name: "Website Builder",
    starter: false,
    growth: false,
    pro: true,
    champion: true,
    bespoke: "Custom"
  },
  {
    category: "Advanced Features",
    name: "E-commerce Integration",
    starter: false,
    growth: false,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Advanced Features",
    name: "API Access",
    starter: false,
    growth: false,
    pro: "Standard",
    champion: "Full",
    bespoke: "Unlimited"
  },
  {
    category: "Advanced Features",
    name: "Custom Integrations",
    starter: false,
    growth: false,
    pro: false,
    champion: "Limited",
    bespoke: "Unlimited"
  },
  {
    category: "Advanced Features",
    name: "White-label Solution",
    starter: false,
    growth: false,
    pro: false,
    champion: true,
    bespoke: true
  },

  // Support
  {
    category: "Support",
    name: "Community Support",
    starter: true,
    growth: true,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Support",
    name: "Email Support",
    starter: "Business hours",
    growth: "Priority",
    pro: "Priority", 
    champion: "24/7",
    bespoke: "24/7 Premium"
  },
  {
    category: "Support",
    name: "Phone Support",
    starter: false,
    growth: false,
    pro: true,
    champion: true,
    bespoke: true
  },
  {
    category: "Support",
    name: "Dedicated Manager",
    starter: false,
    growth: false,
    pro: false,
    champion: true,
    bespoke: true
  }
];

const plans = [
  { id: "starter", name: "Starter Club", color: "green" },
  { id: "growth", name: "Growth Club", color: "blue" },
  { id: "pro", name: "Pro Team", color: "orange" },
  { id: "champion", name: "Champion Club", color: "red" },
  { id: "bespoke", name: "Bespoke Club", color: "gray" }
];

export default function FeatureComparison() {
  const { t } = useI18n();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Core Features"]);
  
  const categories = [...new Set(features.map(f => f.category))];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderFeatureValue = (value: boolean | string, planColor: string) => {
    if (value === true) {
      return <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-gray-400 mx-auto" />;
    }
    return (
      <span className={`text-sm font-medium ${
        planColor === 'green' ? 'text-green-600' :
        planColor === 'blue' ? 'text-blue-600' :
        planColor === 'orange' ? 'text-orange-600' :
        planColor === 'red' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {value}
      </span>
    );
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t("pricing.features.title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("pricing.features.subtitle")}
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center">Feature Comparison</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Features</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center p-4 font-semibold min-w-[140px]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <React.Fragment key={category}>
                    <tr 
                      className="border-b bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      <td className="p-4 font-semibold flex items-center gap-2">
                        {expandedCategories.includes(category) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                        {category}
                      </td>
                      <td colSpan={5}></td>
                    </tr>
                    
                    {expandedCategories.includes(category) && 
                      features
                        .filter(f => f.category === category)
                        .map((feature, index) => (
                          <tr key={index} className="border-b hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span>{feature.name}</span>
                                {feature.description && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{feature.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {renderFeatureValue(feature.starter, "green")}
                            </td>
                            <td className="p-4 text-center">
                              {renderFeatureValue(feature.growth, "blue")}
                            </td>
                            <td className="p-4 text-center">
                              {renderFeatureValue(feature.pro, "orange")}
                            </td>
                            <td className="p-4 text-center">
                              {renderFeatureValue(feature.champion, "red")}
                            </td>
                            <td className="p-4 text-center">
                              {renderFeatureValue(feature.bespoke, "gray")}
                            </td>
                          </tr>
                        ))
                    }
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {categories.map(category => (
              <div key={category} className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto font-semibold"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {expandedCategories.includes(category) ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                
                {expandedCategories.includes(category) && (
                  <div className="space-y-3 pl-4">
                    {features
                      .filter(f => f.category === category)
                      .map((feature, index) => (
                        <Card key={index} className="p-4">
                          <div className="font-medium mb-3 flex items-center gap-2">
                            {feature.name}
                            {feature.description && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{feature.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {plans.map(plan => (
                              <div key={plan.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="font-medium">{plan.name.split(' ')[0]}</span>
                                {renderFeatureValue(feature[plan.id as keyof Feature] as boolean | string, plan.color)}
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}