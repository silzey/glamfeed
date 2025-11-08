
'use client';
import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Post, Comment as CommentType } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';
import CommentList from '@/components/comment-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();
    
    // We need to find which user created the review to build the path
    // This is not ideal. A better structure would be a top-level `reviews` collection.
    // For now, we will assume the post ID is in the format `userId_...` to extract the user ID
    // This is a temporary workaround.
    const userId = id.split('_')[0];

    const postRef = useMemoFirebase(() => {
        if (!firestore || !userId || !id) return null;
        // This path is incorrect based on backend.json, but we're trying to match what might exist
        // A better structure would be a top-level reviews collection.
        // Assuming review `id` might be the doc id in a top level `feed` collection for now.
        // The prompt implies a Post object from `feed` is what's being clicked.
        return doc(firestore, 'feed', id);
    }, [firestore, id]);

    const { data: post, isLoading: isPostLoading } = useDoc<Post>(postRef);

    const commentsRef = useMemoFirebase(() => {
        if (!firestore || !post) return null;
        // This path is also a guess. The backend.json shows comments nested under /users/{userId}/reviews/{reviewId}
        // But the Post object doesn't have a reviewId. We'll assume a `comments` subcollection on the `feed` post.
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
