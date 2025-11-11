'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Coins } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function BuyWithCoinsButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);

  const handleBuy = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please sign in to redeem this product.',
      });
      router.push('/login');
      return;
    }

    setIsBuying(true);
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User profile not found.');
      }

      const userData = userSnap.data();
      const userCoins = userData.coins || 0;
      
      const productPrice = Math.floor(
        parseInt(product.price.replace(/[^\d]/g, ''))
      );

      if (userCoins < productPrice) {
        toast({
          variant: 'destructive',
          title: 'Not Enough Coins',
          description: 'You don’t have enough coins to buy this item.',
        });
        setIsBuying(false);
        return;
      }

      // Deduct coins
      const newBalance = userCoins - productPrice;
      await updateDoc(userRef, { coins: newBalance });

      // Record purchase
      const purchaseRef = doc(
        collection(firestore, 'purchases'),
        `${user.uid}_${product.id}_${Date.now()}`
      );

      await setDoc(purchaseRef, {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        cost: productPrice,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Purchase Successful 🎉',
        description: `You bought ${product.name} for ${productPrice} coins.`,
      });

      router.push('/profile/purchases');
    } catch (error: any) {
      console.error('Error purchasing product:', error);
      toast({
        variant: 'destructive',
        title: 'Purchase Failed',
        description:
          error.message || 'An error occurred while processing your purchase.',
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={isBuying}
      size="lg"
      className="flex-1 h-12 bg-primary text-white font-semibold hover:bg-primary/90"
    >
      {isBuying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
        </>
      ) : (
        <>
          <Coins className="mr-2 h-5 w-5" /> Buy with Coins
        </>
      )}
    </Button>
  );
}
