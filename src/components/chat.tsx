
'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import type { AppUser, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';


interface ChatProps {
    chatId: string;
    otherUser: AppUser;
}

export function Chat({ chatId, otherUser }: ChatProps) {
    const { user: currentUser } = useAuth();
    const firestore = useFirestore();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messagesCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'chats', chatId, 'messages');
    }, [firestore, chatId]);
    
    const messagesQuery = useMemoFirebase(() => {
        if (!messagesCollectionRef) return null;
        return query(messagesCollectionRef, orderBy('createdAt', 'asc'));
    }, [messagesCollectionRef]);
    
    const { data: messages, isLoading } = useCollection<Message>(messagesQuery);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !firestore || !messagesCollectionRef) return;
        
        const messageData: Omit<Message, 'id'> = {
            text: newMessage,
            senderId: currentUser.uid,
            createdAt: serverTimestamp(),
            isBot: false,
        };

        const tempMessage = newMessage;
        setNewMessage('');
        
        await addDocumentNonBlocking(messagesCollectionRef, messageData);
        
        // Also update or create the conversation document
        const conversationRef = doc(firestore, 'conversations', chatId);
        const convoDoc = await getDoc(conversationRef);

        const otherParticipant = {
          id: otherUser.uid,
          name: otherUser.name || 'User',
          avatarUrl: otherUser.avatarUrl || ''
        };
        
        const currentUserParticipant = {
            id: currentUser.uid,
            name: currentUser.name || 'User',
            avatarUrl: currentUser.avatarUrl || ''
        }
        
        if (convoDoc.exists()) {
             // Conversation exists, update it
             const currentUnread = convoDoc.data().unreadCounts?.[otherUser.uid] || 0;
             await setDoc(conversationRef, { 
                lastMessage: tempMessage,
                lastMessageTimestamp: serverTimestamp(),
                unreadCounts: {
                    ...convoDoc.data().unreadCounts,
                    [otherUser.uid]: currentUnread + 1,
                    [currentUser.uid]: 0 // reset sender's unread count
                }
             }, { merge: true });
        } else {
            // Conversation doesn't exist, create it
            await setDoc(conversationRef, {
                participants: [currentUser.uid, otherUser.uid],
                participantDetails: [currentUserParticipant, otherParticipant],
                lastMessage: tempMessage,
                lastMessageTimestamp: serverTimestamp(),
                unreadCounts: {
                    [otherUser.uid]: 1,
                    [currentUser.uid]: 0,
                },
                createdAt: serverTimestamp()
            });
        }
    };
    
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                           <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                               {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                               <Skeleton className="max-w-xs h-12 rounded-lg w-1/2" />
                               {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                           </div>
                        ))}
                    </div>
                ) : (
                     messages?.map((msg, index) => {
                        const isCurrentUser = msg.senderId === currentUser?.uid;
                        const userForAvatar = isCurrentUser ? currentUser : otherUser;
                        
                        return (
                            <div key={msg.id || index} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                                {!isCurrentUser && (
                                    <Avatar className="h-8 w-8 border-2 border-border">
                                        <AvatarImage src={userForAvatar?.avatarUrl} alt={userForAvatar?.name || 'User'} />
                                        <AvatarFallback>{userForAvatar?.name ? userForAvatar.name.charAt(0) : 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    'max-w-xs md:max-w-md rounded-2xl p-3',
                                    isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'
                                )}>
                                    <p className="text-sm">{msg.text}</p>
                                     {msg.createdAt && (
                                         <p className={cn(
                                            'text-xs mt-1',
                                            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70',
                                            !isCurrentUser && 'text-right'
                                        )}>
                                            {formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true })}
                                        </p>
                                     )}
                                </div>
                                {isCurrentUser && (
                                     <Avatar className="h-8 w-8 border-2 border-border">
                                        <AvatarImage src={userForAvatar?.avatarUrl} alt={userForAvatar?.name || 'User'} />
                                        <AvatarFallback>{userForAvatar?.name ? userForAvatar.name.charAt(0) : 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-muted border-transparent focus-visible:ring-primary focus-visible:ring-offset-0"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                        <SendHorizonal className="h-5 w-5"/>
                    </Button>
                     <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0">
                        <Bot className="h-5 w-5"/>
                    </Button>
                </form>
            </div>
        </div>
    );
}
