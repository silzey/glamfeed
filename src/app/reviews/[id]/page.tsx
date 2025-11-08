
'use client';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase/hooks/use-firebase';
import { doc, collection } from 'firebase/firestore';
import { Post, Comment as CommentType } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';
import CommentList from '@/components/comment-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();
    
    // We are fetching from the top-level 'feed' collection, which is where posts are stored.
    const postRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'feed', id);
    }, [firestore, id]);

    const { data: post, isLoading: isPostLoading } = useDoc<Post>(postRef);

    // Comments are stored in a subcollection under each post in the 'feed'.
    const commentsRef = useMemoFirebase(() => {
        if (!firestore || !post) return null;
        return collection(firestore, 'feed', post.id, 'comments');
    }, [firestore, post]);

    const { data: comments, isLoading: areCommentsLoading } = useCollection<CommentType>(commentsRef);
    
    if (isPostLoading || areCommentsLoading) {
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
                    <h2 className="text-lg font-semibold mb-4 text-white">Comments</h2>
                    <CommentList comments={comments || []} />
                </div>
            </div>
        </div>
    );
}
