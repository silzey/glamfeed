'use client';

import { AuthClientProvider } from '@/firebase/client-provider';
import { WishlistProvider } from '@/context/wishlist-context';
import { CoinProvider } from '@/context/coin-context';
import { CartProvider } from '@/context/cart-context';
import { PWAInstallProvider } from '@/context/pwa-install-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthClientProvider>
      <PWAInstallProvider>
        <CartProvider>
          <WishlistProvider>
            <CoinProvider>{children}</CoinProvider>
          </WishlistProvider>
        </CartProvider>
      </PWAInstallProvider>
    </AuthClientProvider>
  );
}
