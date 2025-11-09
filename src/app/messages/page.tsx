'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Mail, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Conversation {
    id: string;
    user: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    lastMessage: string;
    time: string;
    unread: number;
}

const mockConversations: Conversation[] = [
    {
        id: 'convo-1',
        user: { id: 'user-2', name: 'Ben Styles', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
        lastMessage: "Yeah, it's amazing! You should try it.",
        time: '5m ago',
        unread: 2
    },
    {
        id: 'convo-2',
        user: { id: 'user-3', name: 'Aisha Glow', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
        lastMessage: 'Just saw your new post, love it!',
        time: '1h ago',
        unread: 0
    },
    {
        id: 'convo-3',
        user: { id: 'user-4', name: 'Marco Looks', avatarUrl: 'https://i.pravatar.cc/150?u=user-4' },
        lastMessage: 'Down to collab next week?',
        time: 'Yesterday',
        unread: 1
    }
];

export default function MessagesPage() {
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
                    <Mail
                        className="h-10 w-10 text-primary"
                        style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
                    />
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Messages</h1>
                        <p className="text-md sm:text-lg text-white/70">
                        Your recent conversations.
                        </p>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="p-4 border-b border-white/10">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                            <Input placeholder="Search conversations..." className="bg-black/40 pl-10" />
                        </div>
                    </div>
                    <ul className="divide-y divide-white/10">
                        {mockConversations.map(convo => (
                            <li key={convo.id}>
                                <Link href={`/messages/${convo.user.id}`} className="block hover:bg-white/5 transition-colors">
                                    <div className="p-4 flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-white/20">
                                            <AvatarImage src={convo.user.avatarUrl} alt={convo.user.name} />
                                            <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <p className="font-bold text-white">{convo.user.name}</p>
                                                <p className="text-xs text-white/60">{convo.time}</p>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <p className="text-sm text-white/70 truncate pr-4">{convo.lastMessage}</p>
                                                {convo.unread > 0 && (
                                                    <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                        {convo.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
