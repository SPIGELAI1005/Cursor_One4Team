"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import One4TeamText from "@/components/One4TeamText";
import { 
  CheckCircle, 
  Mail, 
  Users, 
  Settings, 
  ArrowRight,
  Trophy,
  Shield,
  Zap,
  Calendar,
  CreditCard
} from "lucide-react";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const nextSteps = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Verify Your Email",
      description: "Check your inbox for a verification email and click the link to activate your account.",
      action: "Resend Email",
      href: "#"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Invite Your Team",
      description: "Add coaches, trainers, and staff members to help manage your club.",
      action: "Invite Members",
      href: "/dashboard/members"
    },
    {
      icon: <Settings className="w-6 h-6 text-purple-600" />,
      title: "Customize Your Club",
      description: "Set up your club's branding, colors, and basic information.",
      action: "Customize",
      href: "/dashboard/settings"
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      title: "Create Your First Event",
      description: "Schedule training sessions, matches, or club meetings.",
      action: "Create Event",
      href: "/dashboard/events"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & GDPR Compliant",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Easy to Use",
      description: "Intuitive interface designed for sports clubs"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Proven Solution",
      description: "Trusted by thousands of clubs worldwide"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <One4TeamText size="2xl" variant="bold" />! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your club account has been created successfully. You're now ready to start managing your sports club like a pro!
          </p>
          <Badge variant="secondary" className="text-sm">
            Redirecting to dashboard in {countdown} seconds...
          </Badge>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started Quickly
            </CardTitle>
            <CardDescription>
              Here are the most important things to do first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <Button variant="outline" size="sm" className="text-xs">
                      {step.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Clubs Choose <One4TeamText size="lg" variant="bold" /></CardTitle>
            <CardDescription>
              Everything you need to run your sports club efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help Getting Started?</CardTitle>
            <CardDescription>
              We're here to help you make the most of <One4TeamText size="md" variant="default" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📚 Documentation</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to use every feature
                </p>
                <Button variant="outline" size="sm">
                  Read Docs
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎥 Video Tutorials</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Watch step-by-step guides
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">💬 Live Support</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get help from our team
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => router.push("/dashboard")}
            className="flex items-center"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push("/support")}
          >
            Get Help
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Questions? Email us at{" "}
                            <a href="mailto:support@one4team.com" className="text-blue-600 hover:underline">
                  support@one4team.com
            </a>
          </p>
          <p className="mt-1">
            Or call us at{" "}
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">
              +1 (234) 567-890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 