'use client';

import { AuthClientProvider } from '@/firebase/client-provider';
import { WishlistProvider } from '@/context/wishlist-context';
import { CoinProvider } from '@/context/coin-context';
import { CartProvider } from '@/context/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthClientProvider>
      <CartProvider>
        <WishlistProvider>
          <CoinProvider>{children}</CoinProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthClientProvider>
  );
}
