import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    toast({
      title: "Success!",
      description: "Check your inbox for your free trial access link.",
    });
  };

  if (isSubmitted) {
    return (
      <section className="max-w-2xl mx-auto">
        <Card className="text-center p-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
              Check your inbox!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Click the link in your email to start your 14-day free trial. 
              {clubName && ` We'll have ${clubName} ready for you!`}
            </p>
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
              >
                Send another email
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Start your free trial
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get instant access to One4Team. No credit card required, no setup fees, cancel anytime.
          </p>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-name" className="text-base font-semibold">
                Club Name (Optional)
              </Label>
              <Input
                id="club-name"
                type="text"
                placeholder="Your Sports Club"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                We'll pre-configure your account with your club details
              </p>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up your trial...
                </div>
              ) : (
                "Get Free Trial Access"
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                ✅ 14-day free trial • ✅ No credit card required • ✅ Cancel anytime
              </p>
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="text-2xl">🔒</div>
          <div className="text-sm font-medium">GDPR Compliant</div>
          <div className="text-xs text-muted-foreground">Your data is protected</div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl">⚡</div>
          <div className="text-sm font-medium">Instant Setup</div>
          <div className="text-xs text-muted-foreground">Ready in 2 minutes</div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl">💬</div>
          <div className="text-sm font-medium">Expert Support</div>
          <div className="text-xs text-muted-foreground">We're here to help</div>
        </div>
      </div>
    </section>
  );
}