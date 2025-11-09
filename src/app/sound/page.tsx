
'use client';

import { Header } from '@/components/header';
import { Volume2, Music, Mic, ArrowLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SoundPage() {
    const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-20 sm:pt-24 flex-1">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <Volume2
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Sound</h1>
                 <p className="text-md sm:text-lg text-white/70">
                    Manage your audio and sound preferences.
                </p>
            </div>
        </div>
        
        <div className="glass-card p-6 md:p-8 space-y-6">
             <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Volume</h2>
                 <div className="flex items-center gap-4">
                    <Volume2 className="h-6 w-6 text-white/70" />
                    <Slider defaultValue={[75]} max={100} step={1} />
                </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Playback</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Music className="h-6 w-6 text-white/70" />
                        <div>
                            <p className="font-medium">In-App Sounds</p>
                            <p className="text-sm text-white/60">Enable sounds for likes and notifications.</p>
                        </div>
                    </div>
                    <Switch id="in-app-sounds-switch" defaultChecked className="data-[state=checked]:bg-primary"/>
                </div>
            </div>
            
            <Separator className="bg-white/10" />

            <div className="space-y-4">
                 <h2 className="text-xl font-semibold text-white">Input</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Mic className="h-6 w-6 text-white/70" />
                        <div>
                            <p className="font-medium">Microphone Access</p>
                            <p className="text-sm text-white/60">Allow app to use microphone for videos.</p>
                        </div>
                    </div>
                    <Switch id="mic-access-switch" defaultChecked className="data-[state=checked]:bg-primary"/>
                </div>
            </div>

        </div>

      </main>
    </div>
  );
}
