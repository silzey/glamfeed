'use client';

import { Header } from '@/components/header';
import { Shield, Lock, UserX, BarChart2, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
            <Shield
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
              />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy & Safety</h1>
                <p className="text-md sm:text-lg text-white/70">
                    Control your privacy settings and preferences.
                </p>
            </div>
        </div>
        
        <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Account Privacy</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Lock className="h-6 w-6 text-white/70" />
                        <div>
                            <p className="font-medium">Private Account</p>
                            <p className="text-sm text-white/60">When your account is private, only people you approve can see your posts.</p>
                        </div>
                    </div>
                    <Switch id="private-account-switch" className="data-[state=checked]:bg-primary"/>
                </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
                 <h2 className="text-xl font-semibold text-white">Content Safety</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <UserX className="h-6 w-6 text-white/70" />
                        <div>
                            <p className="font-medium">Blocked Accounts</p>
                            <p className="text-sm text-white/60">Manage the accounts you've blocked.</p>
                        </div>
                    </div>
                    <span className="text-sm text-white/80">3 accounts</span>
                </div>
            </div>

             <Separator className="bg-white/10" />

             <div className="space-y-4">
                 <h2 className="text-xl font-semibold text-white">Data & Analytics</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <BarChart2 className="h-6 w-6 text-white/70" />
                        <div>
                            <p className="font-medium">Share Analytics</p>
                            <p className="text-sm text-white/60">Allow us to use your data to improve our services.</p>
                        </div>
                    </div>
                    <Switch id="analytics-switch" defaultChecked className="data-[state=checked]:bg-primary"/>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
