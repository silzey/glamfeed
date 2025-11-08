import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { PopulatedReview } from '@/lib/types';
import { StarRating } from './star-rating';
import { ReviewSummary } from './review-summary';
import { CardActions } from './like-button';

type ReviewCardProps = {
  review: PopulatedReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const { user, product } = review;
  const image = PlaceHolderImages.find(img => img.id === review.imageId);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar>
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </CardHeader>
      
      {image && (
        <div className="relative aspect-[3/4] w-full">
            <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
        </div>
      )}

      <CardFooter className="flex-col items-start gap-2 pt-4">
        <CardActions review={review} />
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">{product.brand}</p>
                    <p className="text-sm text-muted-foreground">{product.name}</p>
                </div>
                <StarRating rating={review.rating} readOnly />
            </div>
            <ReviewSummary text={review.text} />
            <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
      </CardFooter>
    </Card>
  );
}
