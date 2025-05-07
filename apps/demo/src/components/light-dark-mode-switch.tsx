import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@vonreyher-media/cvrocket';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const enabled = saved === 'dark' || (saved === null && prefersDark);

    document.body.classList.toggle('dark', enabled);
    setIsDark(enabled);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.body.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <Button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full p-2 transition-colors hover:bg-muted/50"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 " />
      )}
    </Button>
  );
}
