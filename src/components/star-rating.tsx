'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  setRating?: (rating: number) => void;
};

export function StarRating({ rating, setRating }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!setRating;

  return (
    <div className={cn('flex items-center', isInteractive && 'cursor-pointer')}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn(
            'h-5 w-5',
            star <= (hoverRating || rating)
              ? 'text-primary fill-primary'
              : 'text-white/30',
            isInteractive && 'transition-transform duration-200 hover:scale-125'
          )}
          onClick={() => isInteractive && setRating(star)}
          onMouseEnter={() => isInteractive && setHoverRating(star)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
        />
      ))}
    </div>
  );
}
