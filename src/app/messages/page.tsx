
'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Mail, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Conversation } from '@/lib/types';
import { PageLoader } from '@/components/page-loader';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
    const router = useRouter();
    const { user: authUser, isUserLoading } = useAuth();
    const firestore = useFirestore();

    const conversationsQuery = useMemoFirebase(() => {
        if (!firestore || !authUser) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', authUser.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );
    }, [firestore, authUser]);

    const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);

    if (isUserLoading || areConversationsLoading) {
        return <PageLoader />;
    }
    
    if (!authUser) {
      router.push('/login');
      return <PageLoader />;
    }

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
                    {conversations && conversations.length > 0 ? (
                        <ul className="divide-y divide-white/10">
                            {conversations.map(convo => {
                                const otherParticipant = convo.participantDetails.find(p => p.id !== authUser.uid);
                                if (!otherParticipant) return null;

                                const unreadCount = convo.unreadCounts?.[authUser.uid] || 0;

                                return (
                                <li key={convo.id}>
                                    <Link href={`/messages/${otherParticipant.id}`} className="block hover:bg-white/5 transition-colors">
                                        <div className="p-4 flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white/20">
                                                <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} />
                                                <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="font-bold text-white">{otherParticipant.name}</p>
                                                    {convo.lastMessageTimestamp && (
                                                        <p className="text-xs text-white/60">
                                                            {formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <p className="text-sm text-white/70 truncate pr-4">{convo.lastMessage}</p>
                                                    {unreadCount > 0 && (
                                                        <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                             <p className="text-lg text-white/70">No conversations yet.</p>
                             <p className="text-sm text-white/60 mt-1">Start a chat from a user's profile.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
