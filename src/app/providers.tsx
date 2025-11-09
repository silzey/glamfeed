'use client';

import { AuthClientProvider } from '@/firebase/client-provider';
import { WishlistProvider } from '@/context/wishlist-context';
import { CoinProvider } from '@/context/coin-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthClientProvider>
      <WishlistProvider>
        <CoinProvider>{children}</CoinProvider>
      </WishlistProvider>
    </AuthClientProvider>
  );
}
