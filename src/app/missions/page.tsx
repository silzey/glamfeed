'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Award, CheckCircle2, Repeat, Users, ArrowLeft, Heart, UserPlus, Share2, Store, Coins, CalendarDays, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const dailyMissions = [
    { id: 1, title: 'Post a review', progress: 0, goal: 1, reward: 50, icon: <Award className="h-6 w-6 text-primary"/> },
    { id: 2, title: 'Comment on 5 posts', progress: 2, goal: 5, reward: 25, icon: <Users className="h-6 w-6 text-primary"/> },
    { id: 3, title: 'Watch an ad', progress: 1, goal: 1, reward: 15, icon: <Award className="h-6 w-6 text-primary"/> },
    { id: 4, title: 'Daily login', progress: 1, goal: 1, reward: 10, icon: <Award className="h-6 w-6 text-primary"/> },
    { id: 9, title: 'Like 10 posts', progress: 3, goal: 10, reward: 20, icon: <Heart className="h-6 w-6 text-primary"/> },
    { id: 10, title: 'Follow 2 new creators', progress: 1, goal: 2, reward: 30, icon: <UserPlus className="h-6 w-6 text-primary"/> },
    { id: 11, title: 'Share a post', progress: 0, goal: 1, reward: 15, icon: <Share2 className="h-6 w-6 text-primary"/> },
    { id: 12, title: 'Visit the Coin Shop', progress: 0, goal: 1, reward: 5, icon: <Store className="h-6 w-6 text-primary"/> },
];

const weeklyMissions = [
    { id: 5, title: 'Get 25 likes on your posts', progress: 15, goal: 25, reward: 100, icon: <Users className="h-6 w-6 text-primary"/> },
    { id: 6, title: 'Post 3 times this week', progress: 1, goal: 3, reward: 150, icon: <Award className="h-6 w-6 text-primary"/> },
    { id: 7, title: 'Refer a friend', progress: 0, goal: 1, reward: 100, icon: <Users className="h-6 w-6 text-primary"/> },
    { id: 8, title: 'Earn 500 coins', progress: 125, goal: 500, reward: 200, icon: <Coins className="h-6 w-6 text-primary"/> },
    { id: 13, title: 'Have a post featured', progress: 0, goal: 1, reward: 500, icon: <Award className="h-6 w-6 text-primary"/> },
    { id: 14, title: 'Log in 7 days in a row', progress: 3, goal: 7, reward: 75, icon: <CalendarDays className="h-6 w-6 text-primary"/> },
    { id: 15, title: 'Spend 1000 coins', progress: 220, goal: 1000, reward: 50, icon: <ShoppingCart className="h-6 w-6 text-primary"/> },
];


export default function MissionsPage() {
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
            <Award
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Missions</h1>
                <p className="text-md sm:text-lg text-white/70">
                    Complete challenges to earn coins.
                </p>
            </div>
        </div>
        
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Repeat className="h-6 w-6 text-primary"/> Daily Missions</h2>
                 <div className="space-y-4">
                    {dailyMissions.map(mission => {
                        const isCompleted = mission.progress >= mission.goal;
                        return (
                            <Card key={mission.id} className="glass-card">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                                        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-400"/> : mission.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white/90">{mission.title}</p>
                                        <p className="text-sm text-amber-400 font-bold">+ {mission.reward} Coins</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Progress value={(mission.progress / mission.goal) * 100} className="h-2"/>
                                            <span className="text-xs font-mono text-white/70">{mission.progress}/{mission.goal}</span>
                                        </div>
                                    </div>
                                    <Button disabled={!isCompleted} className="glass-button w-24">
                                        {isCompleted ? "Claimed" : "Claim"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

             <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Users className="h-6 w-6 text-primary"/> Weekly Challenges</h2>
                 <div className="space-y-4">
                    {weeklyMissions.map(mission => {
                        const isCompleted = mission.progress >= mission.goal;
                        return (
                            <Card key={mission.id} className="glass-card">
                                <CardContent className="p-4 flex items-center gap-4">
                                     <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                                        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-400"/> : mission.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white/90">{mission.title}</p>
                                        <p className="text-sm text-amber-400 font-bold">+ {mission.reward} Coins</p>
                                         <div className="flex items-center gap-2 mt-1">
                                            <Progress value={(mission.progress / mission.goal) * 100} className="h-2"/>
                                            <span className="text-xs font-mono text-white/70">{mission.progress}/{mission.goal}</span>
                                        </div>
                                    </div>
                                    <Button disabled={!isCompleted} className="glass-button w-24">
                                       {isCompleted ? "Claimed" : "Claim"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
