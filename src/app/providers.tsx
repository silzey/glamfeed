
'use client';

import { AuthProvider } from '@/firebase/provider';
import { WishlistProvider } from '@/context/wishlist-context';
import { CoinProvider } from '@/context/coin-context';
import { CartProvider } from '@/context/cart-context';
import { PWAInstallProvider } from '@/context/pwa-install-context';
import { FirebaseProvider } from '@/firebase/hooks/use-firebase';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <PWAInstallProvider>
          <CartProvider>
            <WishlistProvider>
              <CoinProvider>{children}</CoinProvider>
            </WishlistProvider>
          </CartProvider>
        </PWAInstallProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}
