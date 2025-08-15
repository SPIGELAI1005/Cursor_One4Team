import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calculator, Users, DollarSign } from "lucide-react";

interface PriceCalculatorProps {
  memberCount: number;
  setMemberCount: (count: number) => void;
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

export default function PriceCalculator({ 
  memberCount, 
  setMemberCount, 
  billingCycle, 
  setBillingCycle 
}: PriceCalculatorProps) {

  const handleMemberCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMemberCount(Math.max(1, Math.min(10000, value)));
  };

  const presetSizes = [
    { label: "Small Club", count: 25 },
    { label: "Medium Club", count: 100 },
    { label: "Large Club", count: 500 },
    { label: "Enterprise", count: 1000 }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Calculate your costs
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get an instant estimate based on your club size. Our transparent pricing scales with your membership.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Price Calculator</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <Label htmlFor="billing-toggle" className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
              Yearly <span className="text-primary font-semibold">(Save 25%)</span>
            </Label>
          </div>

          {/* Member Count Input */}
          <div className="space-y-3">
            <Label htmlFor="member-count" className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of Active Members
            </Label>
            
            <Input
              id="member-count"
              type="number"
              min="1"
              max="10000"
              value={memberCount}
              onChange={handleMemberCountChange}
              className="text-lg text-center font-semibold"
              placeholder="Enter member count"
            />
            
            {/* Preset Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetSizes.map((preset) => (
                <Button
                  key={preset.count}
                  variant="outline"
                  size="sm"
                  onClick={() => setMemberCount(preset.count)}
                  className={memberCount === preset.count ? 'ring-2 ring-primary' : ''}
                >
                  {preset.label}
                  <br />
                  <span className="text-xs opacity-70">{preset.count}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Cost Breakdown Preview */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <DollarSign className="h-4 w-4" />
              Estimated Costs ({billingCycle})
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Growth Club (Most Popular)</div>
                <div className="text-muted-foreground">
                  €28 base + €{memberCount} members = €{28 + memberCount * 1}/{billingCycle === 'yearly' ? 'year' : 'month'}
                </div>
                {billingCycle === 'monthly' && (
                  <div className="text-muted-foreground">
                    Monthly: €{Math.round((28 + memberCount * 1) * 1.25)}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Pro Team</div>
                <div className="text-muted-foreground">
                  €56 base + €{memberCount * 3} members = €{56 + memberCount * 3}/{billingCycle === 'yearly' ? 'year' : 'month'}
                </div>
                {billingCycle === 'monthly' && (
                  <div className="text-muted-foreground">
                    Monthly: €{Math.round((56 + memberCount * 3) * 1.25)}
                  </div>
                )}
              </div>
            </div>

            {/* Discount Notice */}
            {memberCount > 499 && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm">
                🎉 <strong>15% discount applied!</strong> Large clubs get automatic volume discounts.
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>💡 All plans include a 14-day free trial</p>
            <p>No setup fees • No contracts • Cancel anytime</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}