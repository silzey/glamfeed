
'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/firebase/provider';
import { FirebaseProvider } from '@/firebase/hooks/use-firebase';

interface AuthClientProviderProps {
  children: ReactNode;
}

export function AuthClientProvider({ children }: AuthClientProviderProps) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
}
