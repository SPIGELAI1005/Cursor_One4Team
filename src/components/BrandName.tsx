import React from "react";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
}

export default function BrandName({ className }: BrandNameProps) {
  return (
    <span className={cn("inline-flex items-baseline font-semibold", className)}>
      <span className="text-foreground">One</span>
      <span className="gold-gradient-text mx-0.5">4</span>
      <span className="text-foreground">Team</span>
    </span>
  );
}
