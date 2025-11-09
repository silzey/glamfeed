
'use client';
import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Heart, ArrowLeft, Coins, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { WishlistContext } from '@/context/wishlist-context';
import type { WishlistItem } from '@/context/wishlist-context';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems } = useContext(WishlistContext);

  const isProduct = (item: WishlistItem) => item.price !== 'N/A';

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section
          id="wishlist"
          className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24"
        >
          <div className="mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
              </Button>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <Heart
              className="h-10 w-10 text-primary"
              style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Wishlist</h1>
              <p className="text-md sm:text-lg text-white/70">
                Your saved items and favorite posts.
              </p>
            </div>
          </div>
            {wishlistItems.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                        <Link href={isProduct(item) ? `/coinshop/${item.id}` : `/reviews/${item.id}`} key={item.id}>
                            <div className="glass-card overflow-hidden group h-full flex flex-col">
                                <div className="relative aspect-video w-full">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                                    {isProduct(item) ? (
                                        <div className="flex items-center justify-between mt-2 text-sm">
                                             <div className="flex items-center gap-1.5 text-primary font-bold">
                                                <Coins className="h-4 w-4" />
                                                <span>{item.price.replace(' Coins', '')}</span>
                                            </div>
                                             <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-amber-400 fill-amber-400"/>
                                                {/* @ts-ignore */}
                                                <span className="text-xs text-white/80">{item.rating || 5}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-white/60 mt-1">Review Post</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                 </div>
            ) : (
                <div className="text-center py-20 glass-card">
                    <p className="text-lg text-white/70">Your wishlist is empty.</p>
                    <p className="text-sm text-white/50 mt-2">Tap the heart icon on items to save them here.</p>
                </div>
            )}
        </section>
      </main>
    </div>
  );
}
