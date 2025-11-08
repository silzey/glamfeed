'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type StarRatingProps = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  starCount?: number;
  className?: string;
};

export function StarRating({ 
  rating, 
  onRatingChange, 
  readOnly = true, 
  starCount = 5,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(index);
  };

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(starCount)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            key={ratingValue}
            type="button"
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(ratingValue)}
            disabled={readOnly}
            className={cn('p-0.5', !readOnly && 'cursor-pointer')}
            aria-label={`Rate ${ratingValue} out of ${starCount}`}
          >
            <Star
              className={cn(
                'h-5 w-5 transition-colors',
                (hoverRating || rating) >= ratingValue
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
