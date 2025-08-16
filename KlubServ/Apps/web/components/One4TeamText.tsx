import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface One4TeamTextProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'default' | 'bold' | 'semibold';
}

const One4TeamText: React.FC<One4TeamTextProps> = ({ 
  className = "",
  size = 'md',
  variant = 'default'
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  const variantClasses = {
    default: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const getLogoColors = () => {
    switch (theme) {
      case 'light':
        return {
          one: 'text-black',
          four: 'gradient-text hover-animate',
          team: 'text-black'
        };
      case 'dark':
        return {
          one: 'text-white',
          four: 'gradient-text hover-animate',
          team: 'text-white'
        };
      case 'system':
      default:
        return {
          one: 'text-blue-600',
          four: 'gradient-text hover-animate system',
          team: 'text-blue-600'
        };
    }
  };

  const colors = getLogoColors();

  return (
    <span className={cn(sizeClasses[size], variantClasses[variant], className)}>
      <span className={colors.one}>One</span>
      <span className={`mx-0.5 ${colors.four}`}>4</span>
      <span className={colors.team}>Team</span>
    </span>
  );
};

export default One4TeamText; 