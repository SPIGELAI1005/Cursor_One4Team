import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  size?: "icon" | "default" | "sm" | "lg";
  className?: string;
  iconClassName?: string;
}

export default function ThemeToggle({ size = "icon", className, iconClassName }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialDark = stored ? stored === "dark" : document.documentElement.classList.contains("dark") || prefersDark;
      applyTheme(initialDark);
      setIsDark(initialDark);
    } catch {
      // no-op
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (dark: boolean) => {
    const el = document.documentElement;
    if (dark) el.classList.add("dark");
    else el.classList.remove("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
  };

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn(className)}
    >
      {isDark ? (
        <Sun className={cn("h-5 w-5", iconClassName)} />
      ) : (
        <Moon className={cn("h-5 w-5", iconClassName)} />
      )}
    </Button>
  );
}
