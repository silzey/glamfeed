'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCoin } from '@/context/coin-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { PageLoader } from '@/components/page-loader';
import { Loader2, Coins } from 'lucide-react';

export default function BuyWithCoinsButton({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const { coins, setCoins } = useCoin();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const price = parseInt(product.price.replace(' Coins', ''), 10);

  const handleBuyNow = () => {
    if (!product) return;

    if (coins < price) {
        toast({
            variant: 'destructive',
            title: 'Not enough coins!',
            description: `You need ${price - coins} more coins to purchase this item.`,
        });
        return;
    }

    setIsRedirecting(true);
    
    // The timeout simulates a network request before redirecting
    setTimeout(() => {
        setCoins(coins - price);
        toast({
            title: 'Purchase Successful!',
            description: `You've purchased ${product.name} for ${price} coins.`
        })
        router.push('/wallet');
    }, 1500);
  }

  return (
    <>
      {isRedirecting && <PageLoader />}
      <Button
        size="lg"
        onClick={handleBuyNow}
        disabled={isRedirecting}
        className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
        style={{boxShadow: '0 0 15px 2px hsla(var(--primary), 0.3)'}}
      >
        {isRedirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Coins className="mr-2 h-5 w-5" />}
        {isRedirecting ? 'Processing...' : 'Buy with Coins'}
      </Button>
    </>
  );
}
