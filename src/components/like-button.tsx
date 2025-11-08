'use client';
import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PopulatedReview } from '@/lib/types';

type LikeButtonProps = {
  review: PopulatedReview;
};

export function CardActions({ review }: LikeButtonProps) {
  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleLikeClick} className="group h-9 w-9" aria-label={isLiked ? "Unlike" : "Like"}>
                <Heart
                className={cn(
                    'h-6 w-6 text-foreground/70 transition-all group-hover:scale-110',
                    isLiked ? 'fill-red-500 text-red-500' : ''
                )}
                />
            </Button>
        </div>
        <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="group h-9 w-9" aria-label="Comment">
                <MessageCircle
                className='h-6 w-6 text-foreground/70 transition-all group-hover:scale-110'
                />
            </Button>
        </div>
        <div className="flex-1 text-sm text-foreground/80">
            <p><span className="font-semibold">{likes.toLocaleString()} likes</span></p>
        </div>
    </div>
  );
}
