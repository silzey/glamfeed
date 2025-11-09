'use client';
import type { Post } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';

type ReviewListProps = {
    posts: Post[];
};

export default function ReviewList({ posts }: ReviewListProps) {
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
                <ReviewCard key={post.id} post={post} />
            ))}
        </div>
    );
}
