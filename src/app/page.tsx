
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from '@/firebase/hooks/use-firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Post } from '@/lib/types';
import { ReviewCard } from '@/components/review-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 5;

export default function Home() {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (lastDoc: QueryDocumentSnapshot<DocumentData> | null) => {
    if (!firestore) return;

    let postsQuery;
    if (lastDoc) {
      postsQuery = query(
        collection(firestore, 'feed'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    } else {
      postsQuery = query(
        collection(firestore, 'feed'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
    }

    try {
      const documentSnapshots = await getDocs(postsQuery);
      const newPosts = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      
      setPosts(prevPosts => lastDoc ? [...prevPosts, ...newPosts] : newPosts);
      
      const lastDocInBatch = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastDocInBatch);

      if (documentSnapshots.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [firestore]);


  useEffect(() => {
    setIsLoading(true);
    fetchPosts(null).then(() => {
        setIsLoading(false);
    });
  }, [fetchPosts]);
  
  const handleFetchMore = useCallback(() => {
    if (isFetchingMore || !hasMore || !lastVisible) return;
    setIsFetchingMore(true);
    fetchPosts(lastVisible).finally(() => {
      setIsFetchingMore(false);
    });
  }, [isFetchingMore, hasMore, lastVisible, fetchPosts]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleFetchMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    observerRef.current = observer;

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading, hasMore, handleFetchMore]);


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
        <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetchingMore && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {!hasMore && posts.length > 0 && (
                <p className="text-sm text-white/50">You've reached the end of the feed.</p>
            )}
        </div>
      </div>
    </div>
  );
}
