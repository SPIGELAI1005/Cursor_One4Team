import React from 'react';
import { cn } from '@/lib/utils';
import LogoFour from '@/components/LogoFour';
import One4TeamText from '@/components/One4TeamText';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ variant = 'full', size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  if (variant === 'icon') {
    const iconSizes = {
      sm: 24,
      md: 32,
      lg: 48
    };
    return (
      <div className={cn('relative', className)}>
        <LogoFour 
          size={iconSizes[size]} 
          bgColor="#1757FF" 
          textColor="white" 
        />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <One4TeamText 
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} 
        variant="bold" 
        className={cn('text-blue-600', className)} 
      />
    );
  }

  // Full logo (default)
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48
  };
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('relative')}>
        <LogoFour 
          size={iconSizes[size]} 
          bgColor="#1757FF" 
          textColor="white" 
        />
      </div>
      <One4TeamText 
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} 
        variant="bold" 
        className="text-gray-900" 
      />
    </div>
  );
} 