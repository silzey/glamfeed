'use client';
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type CoinContextType = {
  coins: number;
  setCoins: (coins: number) => void;
};

export const CoinContext = createContext<CoinContextType>({
  coins: 0,
  setCoins: () => {},
});

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [coins, setCoins] = useState(1250); // Initial mock value

  useEffect(() => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setCoins(doc.data().coins || 0);
        }
      });
      return () => unsubscribe();
    } else if (!user) {
        // Reset to default if user logs out
        setCoins(1250);
    }
  }, [user, firestore]);

  return (
    <CoinContext.Provider value={{ coins, setCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
    const context = useContext(CoinContext);
    if (context === undefined) {
        throw new Error('useCoin must be used within a CoinProvider');
    }
    return context;
}
