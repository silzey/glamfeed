'use client';

import { FirebaseClientProvider } from '@/firebase';
import { WishlistProvider } from '@/context/wishlist-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </FirebaseClientProvider>
  );
}
