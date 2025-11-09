'use client';

import { Header } from '@/components/header';
import { Compass, Zap, Palette, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const updates = [
    {
        Icon: Zap,
        title: "AI Moderation Live",
        version: "v1.1.0",
        description: "Our new AI-powered content moderation is now live, ensuring a safer and more relevant community experience for everyone.",
        date: "2024-07-15"
    },
    {
        Icon: Palette,
        title: "Theme Customization",
        version: "v1.2.0",
        description: "Express yourself! You can now customize the app's accent color and switch between light and dark modes in the settings.",
        date: "2024-08-01"
    },
    {
        Icon: Compass,
        title: "Coming Soon: Creator Analytics",
        version: "v1.3.0",
        description: "We're building a new analytics dashboard to give creators insights into their post performance and audience engagement.",
        date: "Coming Soon"
    }
];

export default function ExplorePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <Compass
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore Updates</h1>
            <p className="text-md sm:text-lg text-white/70">
              See what's new and what's coming next.
            </p>
          </div>
        </div>

        <div className="space-y-6">
            {updates.map((update, index) => (
                <div key={index} className="glass-card p-6 flex items-start gap-4">
                     <div className="p-3 bg-primary/20 rounded-lg">
                        <update.Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                            <h2 className="text-xl font-semibold text-white">{update.title}</h2>
                            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md">{update.version}</span>
                        </div>
                         <p className="text-sm text-white/80 mt-2">{update.description}</p>
                         <p className="text-xs text-white/50 mt-3">{update.date}</p>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
