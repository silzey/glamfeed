
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase/hooks/use-firebase';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import type { Post } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    setIsLoading(true);
    const postsQuery = query(
      collection(firestore, 'feed'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const newPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(newPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts in real-time:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);


  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="glass-card h-full flex flex-col group overflow-hidden card p-4 space-y-4">
                <Skeleton className="relative aspect-square w-full rounded" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-8">
        {posts?.map(post => (
          <ReviewCard key={post.id} post={post} />
        ))}
         {posts?.length === 0 && !isLoading && (
            <div className="text-center py-20 glass-card">
                <p className="text-lg text-white/70">The feed is empty.</p>
                <p className="text-sm text-white/50 mt-2">Looks like there's nothing here right now.</p>
            </div>
         )}
      </div>
    </div>
  );
}
