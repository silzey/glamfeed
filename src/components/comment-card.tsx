
'use client';
import { useState, useEffect } from 'react';
import type { Comment, AppUser } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { PageLoader } from './page-loader';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, increment } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type CommentCardProps = {
  comment: Comment;
};

export default function CommentCard({ comment }: CommentCardProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { user: currentUser, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isNavigating, setIsNavigating] = useState(false);
    const [author, setAuthor] = useState<AppUser | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes || 0);


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
    
    const handleLike = () => {
        if (!firestore || !currentUser) {
            toast({
                variant: 'destructive',
                title: 'You must be logged in to like a comment.'
            });
            router.push('/login');
            return;
        }

        // The path to the comment is complex. Assuming a structure for now.
        // A better structure would be a top level reviews collection.
        // This path is likely incorrect and needs to be adjusted based on final data model.
        // For now, this is a placeholder to show the logic.
        const postOwnerId = comment.reviewId.split('_')[0];
        if (!postOwnerId) {
            console.error("Could not determine post owner from reviewId");
            return;
        }
        const commentRef = doc(firestore, 'users', postOwnerId, 'reviews', comment.reviewId, 'comments', comment.id);
        
        const incrementValue = isLiked ? -1 : 1;
        
        // Optimistically update the UI
        setLikeCount(prev => prev + incrementValue);
        setIsLiked(!isLiked);

        updateDocumentNonBlocking(commentRef, {
            likes: increment(incrementValue)
        });
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
        {isNavigating && <PageLoader />}
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
