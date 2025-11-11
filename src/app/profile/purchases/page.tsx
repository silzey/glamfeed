'use client';
import { useEffect, useState } from 'react';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PurchasesPage() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const purchasesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'purchases'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
  }, [user, firestore]);

  useEffect(() => {
    if (!purchasesQuery) {
        if (!user) setLoading(false);
        return
    };

    const fetchPurchases = async () => {
      const snap = await getDocs(purchasesQuery);
      setPurchases(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchPurchases();
  }, [purchasesQuery, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Purchases</h1>
        {purchases.length === 0 ? (
            <div className="glass-card p-8 text-center">
                <p className="text-white/80">You haven't made any purchases yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {purchases.map((p) => (
                <div key={p.id} className="glass-card p-4 flex items-center gap-4">
                <Image
                    src={p.imageUrl}
                    alt={p.productName}
                    width={60}
                    height={60}
                    className="rounded-md"
                />
                <div className="flex-1">
                    <h3 className="font-semibold">{p.productName}</h3>
                    <p className="text-sm text-white/60">
                    Cost: {p.cost} coins
                    </p>
                </div>
                 {p.createdAt && (
                    <p className="text-xs text-white/50 self-start">
                        {new Date(p.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                 )}
                </div>
            ))}
            </div>
        )}
      </main>
    </div>
  );
}
