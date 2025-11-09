
'use client';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useAuth, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { Post, Comment as CommentType } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';
import CommentList from '@/components/comment-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ReviewDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const firestore = useFirestore();
    const { user, isUserLoading: isAuthLoading } = useAuth();
    const { toast } = useToast();

    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const postRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'feed', id);
    }, [firestore, id]);

    const { data: post, isLoading: isPostLoading } = useDoc<Post>(postRef);

    const commentsRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return collection(firestore, 'feed', id, 'comments');
    }, [firestore, id]);

    const { data: comments, isLoading: areCommentsLoading } = useCollection<CommentType>(commentsRef);
    
    const handleCommentSubmit = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Please sign in to comment.' });
            router.push('/login');
            return;
        }
        if (!commentText.trim()) {
            toast({ variant: 'destructive', title: 'Comment cannot be empty.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const commentData = {
                text: commentText,
                userId: user.uid,
                createdAt: serverTimestamp(),
                likes: 0,
                reviewId: id, // Link back to the post
            };
            await addDocumentNonBlocking(commentsRef!, commentData);
            setCommentText('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to post comment.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPostLoading || areCommentsLoading || isAuthLoading) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <Skeleton className="h-[550px] w-full rounded-lg" />
                <div className="mt-8 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        );
    }
    
    if (!post) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
                <p className="text-white/80">Review not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <div className="space-y-8">
                <ReviewCard post={post} />
                <div className="glass-card p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 text-white">Comments ({comments?.length || 0})</h2>
                    {user && (
                        <div className="mb-6">
                            <Textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add your comment..."
                                className="bg-black/40 border-white/20"
                            />
                            <Button onClick={handleCommentSubmit} disabled={isSubmitting} className="mt-2">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post Comment
                            </Button>
                        </div>
                    )}
                    <CommentList comments={comments || []} />
                </div>
            </div>
        </div>
    );
}
