
'use client';
import Image from 'next/image';
import { Header } from '@/components/header';
import { getProductById } from '@/lib/products';
import { ArrowLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import BuyWithCoinsButton from '../buy-with-coins-button';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import AddToWishlistButton from '../../shop/add-to-wishlist-button';
import { StarRating } from '@/components/star-rating';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoin } from '@/context/coin-context';
import { useAuth } from '@/firebase';

function ProductDetails({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [coinCost, setCoinCost] = useState(0);
    const { user } = useAuth();
    const { coins: userCoins } = useCoin();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const p = await getProductById(id);
            if (p) {
                 const numericPrice = Number(String(p.price).replace(/[^\d.]/g, '')) || 0;
                 setCoinCost(Math.floor(numericPrice / 10));
                 setProduct(p);
            } else {
                setProduct(null);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);
    
    const canAfford = userCoins >= coinCost;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 flex-1" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20 glass-card">
                <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
                <p className="text-white/70 mt-2">The item you are looking for does not exist.</p>
                <Button asChild variant="link" className="mt-4 text-primary">
                    <Link href="/coinshop">Back to Coin Shop</Link>
                </Button>
            </div>
        );
    }
  
    const productImage = PlaceHolderImages.find(p => p.imageUrl === product.imageUrl);
  
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="glass-card overflow-hidden">
            <div className="relative aspect-square w-full">
              <Image
                src={productImage?.imageUrl || product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={productImage?.imageHint || 'cosmetics accessories'}
                priority
              />
              <AddToWishlistButton product={{...product, price: `${coinCost} Coins`}} />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{product.name}</h1>
             <div className="flex items-center gap-4 mt-2 mb-4">
                <div className="flex items-center gap-1.5 text-2xl text-primary font-bold">
                    <Coins className="h-6 w-6" />
                    <span>{coinCost}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} />
                    <span className="text-sm text-white/80 ml-1">({product.rating})</span>
                </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              This is an exclusive item available only in the Coin Shop! Use your earned coins to redeem this amazing product.
            </p>

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
              {user && (
                 canAfford ? (
                    <BuyWithCoinsButton product={{...product, price: `${coinCost} Coins`}} />
                 ) : (
                    <Button
                      disabled
                      className="flex-1 h-12 bg-gray-600 text-gray-300 cursor-not-allowed"
                    >
                      Not Enough Coins
                    </Button>
                 )
              )}
               {!user && (
                <Button asChild className="flex-1 h-12">
                  <Link href="/login">Login to Purchase</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="flex-1 h-12 glass-button text-base font-semibold">
                 <Link href="/coinshop">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
    );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pt-20 sm:pt-24 pb-16 md:pb-24">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href="/coinshop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coin Shop
            </Link>
          </Button>
        </div>
        <ProductDetails id={id} />
      </main>
    </div>
  );
}
