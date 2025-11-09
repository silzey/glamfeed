
'use client';
import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WishlistContext } from '@/context/wishlist-context';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

type AddToWishlistButtonProps = {
  product: Product;
};

export default function AddToWishlistButton({ product }: AddToWishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: (parseInt(product.price) / 100).toFixed(2),
        rating: product.rating,
    };

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  return (
    <Button
      onClick={handleWishlistClick}
      size="icon"
      variant="ghost"
      className={cn(
        "absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70",
        inWishlist ? "text-primary opacity-100" : "text-white opacity-0 group-hover:opacity-100"
      )}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
    </Button>
  );
}
