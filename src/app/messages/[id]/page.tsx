
'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { ArrowLeft, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AppUser, Conversation } from '@/lib/types';
import { useAuth } from '@/firebase';
import { PageLoader } from '@/components/page-loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { Chat } from '@/components/chat';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';


export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const { user: authUser, isUserLoading } = useAuth();
    const firestore = useFirestore();
    
    const otherUserId = params.id as string; 
    
    const otherUserDocRef = useMemoFirebase(() => {
        if (!firestore || !otherUserId) return null;
        return doc(firestore, 'users', otherUserId);
    }, [firestore, otherUserId]);

    const { data: otherUser, isLoading: isLoadingOtherUser } = useDoc<AppUser>(otherUserDocRef);
    
    const conversationsQuery = useMemoFirebase(() => {
        if (!firestore || !authUser) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', authUser.uid)
        );
    }, [firestore, authUser]);

    const { data: conversations, isLoading: isLoadingConversations } = useCollection<Conversation>(conversationsQuery);
    
    const conversationId = useMemo(() => {
        if (!authUser || !otherUserId) return null;
        return [authUser.uid, otherUserId].sort().join('_');
    }, [authUser, otherUserId]);
    
    useEffect(() => {
        if (!isUserLoading && otherUserId === authUser?.uid) {
            router.push('/messages');
        }
    }, [otherUserId, authUser, isUserLoading, router]);

    if (isLoadingOtherUser || isUserLoading || !authUser || !conversationId) {
        return <PageLoader />;
    }
    
    if (!otherUser) {
         return (
          <div className="flex min-h-screen w-full flex-col bg-black text-white">
            <Header />
            <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
              <h1 className="text-2xl font-bold">User not found</h1>
              <Button variant="link" onClick={() => router.push('/messages')} className="mt-4 text-primary">
                Back to Messages
              </Button>
            </main>
          </div>
        );
    }
    
    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
            <Header />
             <div className="flex items-center gap-2 p-2 sm:p-4 border-b border-border mt-16 sm:mt-20 bg-background/80 backdrop-blur-sm sticky top-16 sm:top-20 z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                 <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-border">
                                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                                <AvatarFallback>{otherUser.name ? otherUser.name.charAt(0) : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <h2 className="text-lg font-semibold">{otherUser.name}</h2>
                            </div>
                        </button>
                    </PopoverTrigger>
                     <PopoverContent className="w-80 bg-popover border-border text-popover-foreground">
                         <div className="space-y-2">
                             <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4"/> Switch Conversation</h3>
                             <div className="max-h-60 overflow-y-auto">
                                {conversations?.map(convo => {
                                    const convoUser = convo.participantDetails.find(p => p.id !== authUser.uid);
                                    if (!convoUser) return null;
                                    return (
                                        <Link href={`/messages/${convoUser.id}`} key={convo.id}>
                                             <div className="p-2 flex items-center gap-3 hover:bg-muted rounded-md">
                                                 <Avatar className="h-9 w-9">
                                                    <AvatarImage src={convoUser.avatarUrl} />
                                                    <AvatarFallback>{convoUser.name.charAt(0)}</AvatarFallback>
                                                 </Avatar>
                                                 <span className="text-sm font-medium">{convoUser.name}</span>
                                             </div>
                                        </Link>
                                    )
                                })}
                            </div>
                         </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Suspense fallback={<PageLoader />}>
                <Chat chatId={conversationId} otherUser={otherUser} />
            </Suspense>
        </div>
    );
}
