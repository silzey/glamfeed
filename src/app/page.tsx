'use client';
import { reviews, users, products } from '@/lib/data';
import { ReviewCard } from '@/components/review-card';
import type { PopulatedReview } from '@/lib/types';
import { useMemo } from 'react';
import { Post } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  // In a real app, this data fetching and joining would happen on the server/database.
  const populatedReviews: PopulatedReview[] = reviews.map(review => {
    const user = users.find(u => u.id === review.userId)!;
    const product = products.find(p => p.id === review.productId)!;
    return { ...review, user, product };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const posts: Post[] = useMemo(() => {
    return populatedReviews.map(review => {
        const image = PlaceHolderImages.find(img => img.id === review.imageId);
        return {
            id: review.id,
            userId: review.userId,
            caption: review.text,
            photoUrl: image?.imageUrl,
            createdAt: review.createdAt,
        };
    });
  }, [populatedReviews]);


  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-8">
        {posts.map(post => (
          <ReviewCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
