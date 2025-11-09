
'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CartContext } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { PageLoader } from '@/components/page-loader';
import { Loader2 } from 'lucide-react';

export default function BuyButton({ product }: { product: Product }) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { addToCart } = useContext(CartContext);

  const handleBuyNow = () => {
    if (!product) return;
    setIsRedirecting(true);
    
    // Add all product fields to cart item
    const cartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        price: (parseInt(product.price) / 100).toFixed(2),
        rating: product.rating,
    };
    addToCart(cartItem);

    // The timeout simulates a network request before redirecting
    setTimeout(() => {
        router.push('/checkout');
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
        {isRedirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        Buy Now
      </Button>
    </>
  );
}
