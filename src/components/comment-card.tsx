
'use client';
import { useState, useEffect } from 'react';
import type { Comment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useMemoFirebase, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, increment, collection, query, where, writeBatch } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AppUser } from '@/firebase/provider';


type CommentCardProps = {
  comment: Comment;
};

export default function CommentCard({ comment }: CommentCardProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { user: currentUser, isUserLoading } = useAuth();
    const { toast } = useToast();
    const [isNavigating, setIsNavigating] = useState(false);
    const [author, setAuthor] = useState<AppUser | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes || 0);

    const commentLikesQuery = useMemoFirebase(() => {
        if (!firestore || !comment.reviewId || !comment.id || !currentUser?.uid) return null;
        return query(collection(firestore, `feed/${comment.reviewId}/comments/${comment.id}/likes`), where('userId', '==', currentUser.uid));
    }, [firestore, comment.reviewId, comment.id, currentUser?.uid]);

    const { data: commentLikes } = useCollection(commentLikesQuery);

     useEffect(() => {
        if (commentLikes) {
            setIsLiked(commentLikes.length > 0);
        }
    }, [commentLikes]);


    useEffect(() => {
        if (isUserLoading || !firestore) return;

        const fetchAuthor = async () => {
            if (comment.userId) {
                const userDoc = await getDoc(doc(firestore, 'users', comment.userId));
                if (userDoc.exists()) {
                    setAuthor({ uid: userDoc.id, ...userDoc.data() } as AppUser);
                }
            }
        };
        fetchAuthor();
    }, [comment.userId, firestore, isUserLoading]);
    
    if (isUserLoading || !author) {
      return <div className="flex gap-4 py-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    }
    
    const handleAvatarClick = () => {
        if (!author?.uid) return;
        setIsNavigating(true);
        router.push(`/users/${author.uid}`);
    };
    
    const handleLike = async () => {
        if (!firestore || !currentUser || !comment.reviewId || !comment.id) {
            toast({
                variant: 'destructive',
                title: 'You must be logged in to like a comment.'
            });
            router.push('/login');
            return;
        }

        const commentRef = doc(firestore, 'feed', comment.reviewId, 'comments', comment.id);
        const likeRef = doc(firestore, `feed/${comment.reviewId}/comments/${comment.id}/likes`, currentUser.uid);
        const batch = writeBatch(firestore);
        
        if (isLiked) {
            batch.delete(likeRef);
            batch.update(commentRef, { likes: increment(-1) });
            setLikeCount(prev => prev - 1);
        } else {
            batch.set(likeRef, { userId: currentUser.uid });
            batch.update(commentRef, { likes: increment(1) });
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);

        await batch.commit();
    };

    const getFormattedDate = () => {
      if (!comment.createdAt) return 'just now';
      // @ts-ignore
      if (typeof comment.createdAt.toDate === 'function') {
        // @ts-ignore
        return formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true });
      }
      try {
        return formatDistanceToNow(new Date(comment.createdAt as any), { addSuffix: true });
      } catch (e) {
        return 'a while ago';
      }
    };

    return (
        <>
        {isNavigating && null}
        <div className="flex gap-4 py-4">
            <button onClick={handleAvatarClick} className="cursor-pointer" disabled={!author.uid}>
                <Avatar className="h-10 w-10 border-2 border-white/20 hover:border-primary transition-colors">
                    <AvatarImage src={author.avatarUrl} alt={author.name} />
                    <AvatarFallback>
                    {author.name ? author.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                </Avatar>
            </button>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                         <button onClick={handleAvatarClick} className="cursor-pointer" disabled={!author.uid}>
                            <span className="font-bold text-white hover:underline">{author.name}</span>
                        </button>
                        <span className="ml-2 text-xs text-white/60">
                         {getFormattedDate()}
                        </span>
                    </div>
                </div>
                <p className="mt-1 text-white/90">{comment.text}</p>
                <div className="mt-2 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white px-2">
                        <Heart className={cn("h-4 w-4", isLiked && "text-red-500 fill-current")} />
                        <span>{likeCount}</span>
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}
