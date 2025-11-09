
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

interface CoinContextType {
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
}

const CoinContext = createContext<CoinContextType>({
  coins: 0,
  addCoins: () => {},
  spendCoins: () => {},
});

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [coins, setCoins] = useState(0);

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
        setCoins(0);
    }
  }, [user, firestore]);

  const addCoins = async (amount: number) => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        coins: increment(amount)
      });
    }
  };

  const spendCoins = async (amount: number) => {
    if (user && firestore) {
       const userDocRef = doc(firestore, 'users', user.uid);
       if (coins >= amount) {
         await updateDoc(userDocRef, {
           coins: increment(-amount)
         });
       }
    }
  };

  return (
    <CoinContext.Provider value={{ coins, addCoins, spendCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoin must be used within a CoinProvider');
  }
  return context;
};
