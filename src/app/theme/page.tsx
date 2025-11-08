'use client';
import { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Contrast, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const themes = [
  { name: 'Glam Pink', hsl: '330 80% 60%' },
  { name: 'Sapphire', hsl: '210 80% 55%' },
  { name: 'Emerald', hsl: '150 80% 45%' },
  { name: 'Goldenrod', hsl: '45 80% 55%' },
  { name: 'Amethyst', hsl: '270 80% 60%' },
  { name: 'Ruby Red', hsl: '0 80% 55%' },
];

export default function ThemePage() {
  const [activeTheme, setActiveTheme] = useState('');
  const [mode, setMode] = useState('light');
  const router = useRouter();

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') || 'dark';
    const savedTheme = localStorage.getItem('theme-accent') || themes[0].hsl;
    setMode(savedMode);
    setActiveTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (activeTheme) {
      document.documentElement.style.setProperty('--primary', activeTheme);
      localStorage.setItem('theme-accent', activeTheme);
    }
  }, [activeTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode);
  }, [mode]);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <main className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-xl">
                <Palette
                    className="h-6 w-6 text-primary"
                />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Theme</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Customize the look and feel of the app.
                </p>
            </div>
        </div>

        <div className="space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                    <div className="flex gap-2 rounded-lg bg-secondary p-1">
                        <Button onClick={() => setMode('light')} variant={mode === 'light' ? 'outline' : 'ghost'} className="flex-1 bg-transparent data-[state=active]:bg-background data-[state=active]:text-foreground" data-state={mode === 'light' ? 'active' : 'inactive'}>
                            <Sun className="mr-2 h-4 w-4"/> Light
                        </Button>
                        <Button onClick={() => setMode('dark')} variant={mode === 'dark' ? 'outline' : 'ghost'} className="flex-1 bg-transparent data-[state=active]:bg-background data-[state=active]:text-foreground" data-state={mode === 'dark' ? 'active' : 'inactive'}>
                            <Moon className="mr-2 h-4 w-4"/> Dark
                        </Button>
                         <Button onClick={() => {}} variant="ghost" className="flex-1" disabled>
                            <Contrast className="mr-2 h-4 w-4"/> System
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Accent Color</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {themes.map(theme => (
                            <div key={theme.name} className="flex flex-col items-center gap-2">
                                 <button
                                    onClick={() => setActiveTheme(theme.hsl)}
                                    className={cn(
                                      "h-14 w-14 rounded-full border-2 flex items-center justify-center transition-all",
                                      activeTheme === theme.hsl ? 'border-primary' : 'border-transparent'
                                    )}
                                    style={{ 
                                        backgroundColor: `hsl(${theme.hsl})`
                                    }}
                                    aria-label={`Set theme to ${theme.name}`}
                                >
                                  {activeTheme === theme.hsl && <Check className="h-6 w-6 text-primary-foreground" />}
                                </button>
                                <p className="text-xs text-muted-foreground">{theme.name}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
