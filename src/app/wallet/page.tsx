'use client';
import { Header } from '@/components/header';
import { Wallet, ArrowUpRight, ArrowDownLeft, Star, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useCoin } from '@/context/coin-context';
import { useRouter } from 'next/navigation';
import GlamCard from '@/components/glam-card';

const mockTransactions: Omit<Transaction, 'uid' | 'action'>[] = [
  { id: '1', type: 'earn', description: 'Post Upload Reward', amount: 50, date: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: '2', type: 'earn', description: 'Daily Login Bonus', amount: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: '3', type: 'spend', description: 'Purchased: Celestial Shine Lipstick', amount: -220, date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: '4', type: 'earn', description: 'Ad Watched', amount: 15, date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '5', type: 'earn', description: 'Mission: "First Comment"', amount: 5, date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: '6', type: 'spend', description: 'Gift to @samjones', amount: -50, date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

const getLevel = (coins: number) => {
    if (coins >= 15000) return { name: 'Platinum', progress: 100 };
    if (coins >= 5000) return { name: 'Gold', progress: ((coins - 5000) / (15000-5000)) * 100, nextLevelIn: 15000-coins };
    if (coins >= 1000) return { name: 'Silver', progress: ((coins - 1000) / (5000-1000)) * 100, nextLevelIn: 5000-coins };
    return { name: 'Bronze', progress: (coins / 1000) * 100, nextLevelIn: 1000-coins };
}

export default function WalletPage() {
    const { coins } = useCoin();
    const levelInfo = getLevel(coins);
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
            <Wallet
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Wallet</h1>
                <p className="text-md sm:text-lg text-white/70">
                    Your balance, transactions, and earnings.
                </p>
            </div>
        </div>
        
        <GlamCard />

        <Card className="glass-card mb-6 text-center">
            <CardHeader>
                <CardDescription>Total Balance</CardDescription>
                <CardTitle className="text-5xl font-bold flex items-center justify-center gap-3">
                    <Wallet className="h-10 w-10"/>
                    {coins.toLocaleString()}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
                <Button asChild className="glass-button h-12 text-sm" style={{'--glow-color': 'hsl(var(--primary))'} as React.CSSProperties}><Link href="/missions"><Star className="mr-2"/>Earn Coins</Link></Button>
                <Button asChild className="glass-button h-12 text-sm"><Link href="/coinshop"><ArrowUpRight className="mr-2"/>Spend Coins</Link></Button>
                <Button asChild className="glass-button h-12 text-sm"><Link href="/cash-out"><ArrowUpRight className="mr-2"/>Cash Out</Link></Button>
            </CardContent>
        </Card>

        <Card className="glass-card mb-6">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                     <Award className="h-6 w-6"/>
                     Level: {levelInfo.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={levelInfo.progress} className="h-3" />
                <p className="text-xs text-white/70 mt-2 text-center">
                    {levelInfo.nextLevelIn ? `${levelInfo.nextLevelIn.toLocaleString()} coins until next level!` : "You've reached the max level!"}
                </p>
            </CardContent>
        </Card>

        <div className="glass-card p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <ul className="divide-y divide-white/10">
                {mockTransactions.map(tx => (
                    <li key={tx.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-green-400" /> : <ArrowUpRight className="h-4 w-4 text-red-400" />}
                            </div>
                            <div>
                                <p className="font-medium text-white/90">{tx.description}</p>
                                <p className="text-xs text-white/60">{format(new Date(tx.date), "MMM d, yyyy 'at' h:mm a")}</p>
                            </div>
                        </div>
                        <p className={`font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
      </main>
    </div>
  );
}
