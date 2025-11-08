'use client';
import { createContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type WishlistItem = {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  rating?: number;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

export const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
});

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prevItems => {
      if (prevItems.find(i => i.id === item.id)) {
        toast({ title: 'Item is already in your wishlist.' });
        return prevItems;
      }
      toast({ title: 'Added to wishlist!', description: item.name });
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(i => i.id === id);
      if (itemToRemove) {
        toast({
          title: 'Removed from wishlist',
          description: itemToRemove.name,
          variant: 'destructive',
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
