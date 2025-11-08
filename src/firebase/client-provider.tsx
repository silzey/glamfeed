'use client';

import React, { useMemo, type ReactNode } from 'react';
import { AuthProvider } from '@/firebase/provider';
import { FirebaseProvider } from '@/firebase/hooks/use-firebase';
import { initializeFirebase } from '@/firebase';

interface AuthClientProviderProps {
  children: ReactNode;
}

export function AuthClientProvider({ children }: AuthClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider>
      <AuthProvider
        auth={firebaseServices.auth}
        firestore={firebaseServices.firestore}
      >
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
}
