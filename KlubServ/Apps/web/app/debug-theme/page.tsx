'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DebugTheme() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme Debug Information</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Theme State:</h2>
          <p><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
          <p><strong>Theme:</strong> {theme}</p>
          <p><strong>Resolved Theme:</strong> {resolvedTheme}</p>
          <p><strong>Is System Mode:</strong> {mounted && theme === 'system' ? 'Yes' : 'No'}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Gradient Text Test:</h2>
          <p className="text-2xl">
            This is <span className={`gradient-text hover-animate ${mounted && theme === 'system' ? 'system' : ''}`}>smarter</span> text
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Applied classes: gradient-text hover-animate {mounted && theme === 'system' ? 'system' : ''}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Expected Colors:</h2>
          <div className="space-y-2">
            <div>
              <strong>Light Mode:</strong> Golden gradient (#D4AF37, #F7E27A, #D4AF37)
            </div>
            <div>
              <strong>Dark Mode:</strong> Golden gradient (#F7E27A, #D4AF37, #F7E27A)
            </div>
            <div>
              <strong>System Mode:</strong> Neon green-blue gradient (#00ff88, #00d4ff, #00ff88)
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check the "Theme" value above</li>
            <li>If it's not "system", use the theme toggle in the header to switch to system mode</li>
            <li>The "smarter" text should change from golden to neon green-blue</li>
            <li>If it doesn't change, there might be a CSS caching issue</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
