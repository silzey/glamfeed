'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { ArrowLeft, Star, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/page-loader';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { StarRating } from '@/components/star-rating';
import AddToWishlistButton from '../add-to-wishlist-button';
import BuyButton from '../buy-button';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProducts().then(allProducts => {
      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl">Product not found</h1>
        <Button onClick={() => router.push('/shop')} className="mt-4">Back to Shop</Button>
      </div>
    );
  }
  
  const price = (parseInt(product.price) / 100).toFixed(2);

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="glass-card overflow-hidden">
                 <div className="relative aspect-square w-full">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <AddToWishlistButton product={product} />
                </div>
            </div>
            
            <div className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-semibold text-primary">{product.brand}</p>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <StarRating rating={product.rating} readOnly />
                        <span className="ml-2 text-sm text-white/70">({product.rating.toFixed(1)})</span>
                    </div>
                     <span className="text-white/50">|</span>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified Product</span>
                    </div>
                </div>

                <p className="text-4xl font-bold text-white">${price}</p>
                
                <p className="text-white/80 text-sm leading-relaxed">
                    This is a placeholder description. The {product.name} by {product.brand} is a top-rated product loved by our community. It's known for its exceptional quality and long-lasting effects.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <BuyButton product={product} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
