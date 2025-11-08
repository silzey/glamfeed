'use client';

import { AuthClientProvider } from '@/firebase/client-provider';
import { WishlistProvider } from '@/context/wishlist-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthClientProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </AuthClientProvider>
  );
}
