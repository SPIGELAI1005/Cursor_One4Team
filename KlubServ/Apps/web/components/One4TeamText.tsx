import React from "react";
import { cn } from "@/lib/utils";

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

  return (
    <span className={cn(sizeClasses[size], variantClasses[variant], className)}>
      One<span className="text-[#1757FF]">4</span>Team
    </span>
  );
};

export default One4TeamText; 