'use client';
import { useContext } from 'react';
import { AuthContext, AppUser } from '../provider';

interface UserHookResult {
  user: AppUser | null;
  isUserLoading: boolean;
}

export const useUser = (): UserHookResult => {
  const context = useContext(AuthContext);
  if (context === undefined) {
      throw new Error('useUser must be used within an AuthProvider');
  }
  return { user: context.user, isUserLoading: context.isUserLoading };
};
