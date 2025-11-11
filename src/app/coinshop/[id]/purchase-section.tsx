
'use client';

import { useAuth } from '@/firebase';
import { useCoin } from '@/context/coin-context';
import { Button } from '@/components/ui/button';
import BuyWithCoinsButton from '../buy-with-coins-button';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Coins } from 'lucide-react';

interface PurchaseSectionProps {
  product: Product;
  coinCost: number;
}

export default function PurchaseSection({ product, coinCost }: PurchaseSectionProps) {
  const { user } = useAuth();
  const { coins: userCoins } = useCoin();

  const canAfford = userCoins >= coinCost;

  return (
    <>
      <div className="flex items-center gap-1.5 text-2xl text-primary font-bold my-4">
        <Coins className="h-6 w-6" />
        <span>{coinCost}</span>
      </div>

      {user ? (
        <div className="mt-4 text-white/70">
          Your Balance: <span className="font-bold">{userCoins}</span> Coins
        </div>
      ) : (
        <div className="mt-4 text-white/70">
          <Link href="/login" className="underline">
            Log in
          </Link>{' '}
          to check your balance.
        </div>
      )}
      
      <div className="flex gap-4 mt-8">
        {user ? (
           canAfford ? (
              <BuyWithCoinsButton product={product} />
           ) : (
              <Button
                disabled
                className="flex-1 h-12 bg-gray-600 text-gray-300 cursor-not-allowed"
              >
                Not Enough Coins
              </Button>
           )
        ) : (
          <Button asChild className="flex-1 h-12">
            <Link href="/login">Login to Purchase</Link>
          </Button>
        )}
         <Button size="lg" variant="outline" asChild className="flex-1 h-12 glass-button text-base font-semibold">
           <Link href="/coinshop">Cancel</Link>
         </Button>
      </div>
    </>
  );
}
