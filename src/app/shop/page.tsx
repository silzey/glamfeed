
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Store, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getProducts } from '@/lib/products';
import AddToWishlistButton from './add-to-wishlist-button';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { StarRating } from '@/components/star-rating';


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(prods => {
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white">
              <Link href="/reviews">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <Store
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Shop</h1>
                <p className="text-md sm:text-lg text-white/70">
                Browse and purchase recommended products.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map(product => {
                const productImage = PlaceHolderImages.find(p => p.imageUrl === product.imageUrl);
                const isCoin = product.price.includes('Coins');
                const price = isCoin ? (parseInt(product.price) / 100).toFixed(2) : (parseInt(product.price) / 100).toFixed(2);
                
                return (
                    <Link href={`/shop/${product.id}`} key={product.id} className="block group">
                        <div className="glass-card overflow-hidden h-full flex flex-col">
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={productImage?.imageUrl || product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={productImage?.imageHint || 'cosmetics accessories'}
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <AddToWishlistButton product={product} />
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h3 className="font-semibold truncate text-white">{product.name}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm text-primary font-bold">${price}</p>
                                    <StarRating rating={product.rating} />
                                </div>
                                <Button className="w-full mt-auto pt-2 glass-button h-9">View Details</Button>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
      </main>
    </div>
  );
}
