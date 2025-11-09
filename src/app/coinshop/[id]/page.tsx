
'use client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { getProductById } from '@/lib/products';
import { ArrowLeft, Star, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import BuyWithCoinsButton from '../buy-with-coins-button';
import { Suspense, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import AddToWishlistButton from '../../shop/add-to-wishlist-button';
import { StarRating } from '@/components/star-rating';


function ProductDetails({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const p = await getProductById(id);
            if (p) {
                 const coinProduct = {...p, price: `${Math.floor(parseInt(p.price) / 10)} Coins`};
                 setProduct(coinProduct);
            } else {
                notFound();
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading || !product) {
        return null;
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
              <AddToWishlistButton product={product} />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{product.name}</h1>
             <div className="flex items-center gap-4 mt-2 mb-4">
                <div className="flex items-center gap-1.5 text-2xl text-primary font-bold">
                    <Coins className="h-6 w-6" />
                    <span>{product.price.replace(' Coins', '')}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} />
                    <span className="text-sm text-white/80 ml-1">({product.rating})</span>
                </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              This is an exclusive item available only in the Coin Shop! Use your earned coins to redeem this amazing product.
            </p>
            <div className="flex gap-4 mt-8">
              <BuyWithCoinsButton product={product} />
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
        <Suspense fallback={null}>
            <ProductDetails id={id} />
        </Suspense>
      </main>
    </div>
  );
}
