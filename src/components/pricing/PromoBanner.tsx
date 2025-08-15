import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Flame, Clock, Gift } from "lucide-react";

interface PromoBannerProps {
  type?: "discount" | "trial" | "limited";
  message?: string;
  ctaText?: string;
  endDate?: Date;
}

export default function PromoBanner({ 
  type = "discount",
  message,
  ctaText,
  endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const distance = end - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setIsVisible(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endDate]);

  const defaultMessages = {
    discount: "🔥 Early Bird Special: 20% OFF all plans until August 31st!",
    trial: "🎁 Free onboarding for the first 100 clubs this month!",
    limited: "⚡ Limited Time: Get 3 months free with annual plans!"
  };

  const defaultCTAs = {
    discount: "Claim Discount",
    trial: "Get Free Setup", 
    limited: "Get Bonus Months"
  };

  const bannerColors = {
    discount: "bg-red-600 text-white",
    trial: "bg-green-600 text-white",
    limited: "bg-primary text-primary-foreground"
  };

  const icons = {
    discount: <Flame className="h-4 w-4" />,
    trial: <Gift className="h-4 w-4" />,
    limited: <Clock className="h-4 w-4" />
  };

  if (!isVisible) return null;

  return (
    <div className={`${bannerColors[type]} relative`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            {icons[type]}
            <span>{message || defaultMessages[type]}</span>
          </div>
          
          {timeLeft && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs">
              <Clock className="h-3 w-3" />
              {timeLeft}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              className="text-xs h-7 px-3"
            >
              {ctaText || defaultCTAs[type]}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Animated gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
    </div>
  );
}