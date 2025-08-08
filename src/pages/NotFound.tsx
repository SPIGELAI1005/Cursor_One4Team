import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-[hsl(var(--header))] text-[hsl(var(--header-foreground))]">
        <div className="container mx-auto flex h-12 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/708afae6-09f9-40e1-b977-18f42b832348.png" alt="One4Team logo" className="h-7 w-auto" />
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 grid place-items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-base md:text-xl text-muted-foreground mb-4">Oops! Page not found</p>
          <a href="/" className="underline text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))]">
            Return to Home
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
