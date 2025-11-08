'use client';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import type { Post, AppUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from './page-loader';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';


type ReviewCardProps = {
  post: Post;
};

export function ReviewCard({ post }: ReviewCardProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { user: currentUser, isUserLoading } = useUser();
    const [isNavigating, setIsNavigating] = useState(false);
    
    const [author, setAuthor] = useState<AppUser | null>(null);
    
    useEffect(() => {
        if (!post.userId || !firestore) {
            return;
        }

        const docRef = doc(firestore, 'users', post.userId);
        getDoc(docRef)
            .then(userDoc => {
                if (userDoc.exists()) {
                    setAuthor({ uid: userDoc.id, ...userDoc.data() } as AppUser);
                }
            })
            .catch(serverError => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
            });
            
    }, [post.userId, firestore]);

    if (isUserLoading || !post) {
         return (
            <div className="glass-card h-full flex flex-col group overflow-hidden card p-4 space-y-4">
                <Skeleton className="relative aspect-video w-full rounded" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        );
    }

    const handleAvatarClick = () => {
        if (!author?.uid) return;
        setIsNavigating(true);
        router.push(`/users/${author.uid}`);
    };

    const getFormattedDate = () => {
      if (!post.createdAt) return 'just now';
      // @ts-ignore
      if (typeof post.createdAt.toDate === 'function') {
        // @ts-ignore
        return formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true });
      }
      try {
        return formatDistanceToNow(new Date(post.createdAt as any), { addSuffix: true });
      } catch (e) {
        return 'a while ago';
      }
    };

    return (
    <>
    {isNavigating && <PageLoader />}
    <div className={cn("glass-card h-full flex flex-col group overflow-hidden card min-h-[550px]")}>
      <span className="glow"></span>
      <div className="inner">
        {post.photoUrl && (
            <div className="relative aspect-[4/3] w-full">
                <Image
                    src={post.photoUrl}
                    alt={post.caption || 'Feed post'}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
        )}

        <div className={cn("flex flex-col flex-1 justify-between p-4")}>
            <div>
                 <div className="flex flex-row items-center gap-4">
                    {author ? (
                        <button onClick={handleAvatarClick} className="cursor-pointer" disabled={!author.uid}>
                            <Avatar className="border-2 border-white/50 hover:border-primary transition-colors">
                            <AvatarImage src={author.avatarUrl} alt={author.name} />
                            <AvatarFallback>
                                {author.name ? author.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </AvatarFallback>
                            </Avatar>
                        </button>
                    ) : (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    )}
                    <div className="text-shadow-lg">
                        <button onClick={handleAvatarClick} className="cursor-pointer" disabled={!author?.uid}>
                            <p className="text-sm text-white/80 hover:underline">{author ? `by ${author.name}`: 'Loading...'}</p>
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-primary line-clamp-3">{post.caption}</p>
                </div>
            </div>

             <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-3">
                <p className="text-xs text-white/60">
                    {getFormattedDate()}
                </p>
                <div className="flex items-center -mr-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                        <Heart className="h-4 w-4" />
                        <span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                        <MessageCircle className="h-4 w-4" />
                        <span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                        <Share2 className="h-4 w-4" />
                        <span>0</span>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
