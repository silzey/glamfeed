'use client';
import { useAuth } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award } from 'lucide-react';
import { useCoin } from '@/context/coin-context';

const getLevelName = (coins: number) => {
    if (coins >= 15000) return 'Platinum';
    if (coins >= 5000) return 'Gold';
    if (coins >= 1000) return 'Silver';
    return 'Bronze';
}

export default function GlamCard() {
    const { user } = useAuth();
    const { coins } = useCoin();
    const levelName = getLevelName(coins);

    if (!user) {
        return null;
    }

    return (
        <Card className="glass-card mb-6 relative overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
                 <div 
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-[150%] bg-primary/20 -rotate-12"
                    style={{
                        filter: 'blur(60px)',
                        opacity: 0.7
                    }}
                />
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                    <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
                    <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <p className="text-sm text-white/70">@{user.username || user.email?.split('@')[0]}</p>
                </div>
                <div className="flex flex-col items-center gap-1 text-primary">
                    <Award className="h-8 w-8" />
                    <span className="text-xs font-bold">{levelName}</span>
                </div>
            </CardContent>
        </Card>
    );
}
