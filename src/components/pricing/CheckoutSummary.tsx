import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, CheckCircle, CreditCard, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface CheckoutSummaryProps {
  selectedPlan: string;
  memberCount: number;
  billingCycle: "monthly" | "yearly";
  onClose: () => void;
}

const planDetails = {
  starter: { name: "Starter Club", basePrice: 14, memberPrice: 1, color: "green" },
  growth: { name: "Growth Club", basePrice: 28, memberPrice: 1, color: "blue" },
  pro: { name: "Pro Team", basePrice: 56, memberPrice: 3, color: "orange" },
  champion: { name: "Champion Club", basePrice: 112, memberPrice: 4, color: "red" },
  bespoke: { name: "Bespoke Club", basePrice: 0, memberPrice: 4, color: "gray" }
};

export default function CheckoutSummary({ 
  selectedPlan, 
  memberCount, 
  billingCycle, 
  onClose 
}: CheckoutSummaryProps) {
  const plan = planDetails[selectedPlan as keyof typeof planDetails];
  
  if (!plan) return null;

  const calculateSubtotal = () => {
    if (selectedPlan === 'bespoke') return 0;
    
    const basePrice = plan.basePrice;
    const memberPrice = memberCount * plan.memberPrice;
    const monthly = basePrice + memberPrice;
    
    if (billingCycle === 'yearly') {
      return monthly * 12;
    }
    
    return Math.round(monthly * 1.25); // 25% more for monthly
  };

  const calculateDiscount = () => {
    const discountThresholds = {
      starter: 499,
      growth: 999,
      pro: 1999,
      champion: 2999,
      bespoke: 3999
    };

    const threshold = discountThresholds[selectedPlan as keyof typeof discountThresholds];
    return memberCount > threshold ? 15 : 0;
  };

  const subtotal = calculateSubtotal();
  const discountPercent = calculateDiscount();
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selected Plan */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-semibold">{plan.name}</div>
              <div className="text-sm text-muted-foreground">
                {memberCount} members • {billingCycle} billing
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${
                plan.color === 'blue' ? 'border-blue-300 text-blue-700' :
                plan.color === 'orange' ? 'border-orange-300 text-orange-700' :
                plan.color === 'red' ? 'border-red-300 text-red-700' :
                plan.color === 'green' ? 'border-green-300 text-green-700' :
                'border-gray-300 text-gray-700'
              }`}
            >
              {selectedPlan === 'growth' ? 'Popular' : 
               selectedPlan === 'bespoke' ? 'Custom' : 'Selected'}
            </Badge>
          </div>

          {/* Cost Breakdown */}
          {selectedPlan !== 'bespoke' ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Base plan ({billingCycle})</span>
                <span>€{plan.basePrice * (billingCycle === 'yearly' ? 12 : Math.round(1.25))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{memberCount} members × €{plan.memberPrice}</span>
                <span>€{memberCount * plan.memberPrice * (billingCycle === 'yearly' ? 12 : Math.round(1.25))}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Volume discount ({discountPercent}%)</span>
                  <span>-€{discountAmount}</span>
                </div>
              )}
              
              {billingCycle === 'yearly' && (
                <div className="flex justify-between text-primary">
                  <span>Annual savings (25%)</span>
                  <span className="font-semibold">Included ✓</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{total}/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Plus applicable taxes
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <div className="text-lg font-semibold">Custom Pricing</div>
              <p className="text-sm text-muted-foreground">
                Let's discuss a tailored solution for your organization
              </p>
            </div>
          )}

          {/* Trial Notice */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">14-day free trial included</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              No charges until trial ends. Cancel anytime.
            </p>
          </div>

          {/* Security */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure checkout • GDPR compliant • Cancel anytime</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          {selectedPlan === 'bespoke' ? (
            <Button className="w-full" size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Contact Sales Team
            </Button>
          ) : (
            <Link to="/register" className="w-full">
              <Button className="w-full" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                Continue to Registration
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
            Back to Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}