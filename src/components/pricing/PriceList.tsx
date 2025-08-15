import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Zap, Crown, Diamond, CheckCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface PriceListProps {
  billingCycle: "monthly" | "yearly";
}

const pricingPlans = [
  {
    id: "starter",
    name: "Starter Club",
    icon: <Star className="h-5 w-5" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    basePrice: { yearly: 14, monthly: 17.50 },
    memberPrice: { yearly: 1, monthly: 1.25 },
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
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    basePrice: { yearly: 28, monthly: 35 },
    memberPrice: { yearly: 2, monthly: 2.50 },
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
    icon: <Crown className="h-5 w-5" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    basePrice: { yearly: 56, monthly: 70 },
    memberPrice: { yearly: 3, monthly: 3.75 },
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
    icon: <Diamond className="h-5 w-5" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    basePrice: { yearly: 112, monthly: 140 },
    memberPrice: { yearly: 4, monthly: 5 },
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
    icon: <Diamond className="h-5 w-5" />,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-900/20",
    basePrice: { yearly: "Custom", monthly: "Custom" },
    memberPrice: { yearly: 4, monthly: 5 },
    isCustom: true,
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

export default function PriceList({ billingCycle }: PriceListProps) {
  const { t } = useI18n();
  
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t("pricing.transparent.title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("pricing.transparent.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className="text-center relative overflow-hidden h-full">
            <CardHeader className="pb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${plan.bgColor}`}>
                <div className={plan.color}>
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 flex flex-col h-full">
               {plan.isCustom ? (
                <div className="space-y-2">
                   <div className="text-2xl font-bold text-primary">{t("pricing.custom")}</div>
                   <div className="text-sm text-muted-foreground">
                     {t("pricing.tailoredSolution")}
                   </div>
                  <div className="text-lg font-semibold">
                    + €{plan.memberPrice[billingCycle]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("pricing.perMember")}/{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    €{plan.basePrice[billingCycle]}
                  </div>
                  <div className="text-sm font-medium">
                    {t("pricing.basePrice")}
                  </div>
                  <div className="text-lg font-semibold">
                    + €{plan.memberPrice[billingCycle]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("pricing.perMember")}/{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="flex-1 text-left">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          💡 {t("pricing.example")} €{billingCycle === 'yearly' ? '128' : '160'}/{billingCycle === 'yearly' ? t("pricing.perYear") : t("pricing.perMonth")}
        </div>
      </div>
    </section>
  );
}