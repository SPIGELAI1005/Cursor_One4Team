import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  size?: "icon" | "default" | "sm" | "lg";
  className?: string;
  iconClassName?: string;
}

type Theme = "light" | "dark" | "neon";

export default function ThemeToggle({ size = "icon", className, iconClassName }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial: Theme = stored === "light" || stored === "dark" || stored === "neon"
        ? stored
        : prefersDark
        ? "dark"
        : "light";
      applyTheme(initial);
      setTheme(initial);
    } catch {
      // no-op
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (t: Theme) => {
    const el = document.documentElement;
    el.classList.remove("dark", "neon");
    if (t === "dark") el.classList.add("dark");
    if (t === "neon") el.classList.add("neon");
    try {
      localStorage.setItem("theme", t);
    } catch {
      // ignore storage errors
    }
  };

  const setAndApply = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  const icon = theme === "dark" ? (
    <Sun className={cn("h-5 w-5", iconClassName)} />
  ) : theme === "neon" ? (
    <Sparkles className={cn("h-5 w-5", iconClassName)} />
  ) : (
    <Moon className={cn("h-5 w-5", iconClassName)} />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          aria-label={`Toggle theme (current: ${theme})`}
          className={cn(className)}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setAndApply("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAndApply("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAndApply("neon")}>Neon</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
