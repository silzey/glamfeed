'use client';
import { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';


interface FirebaseContextState {
  areServicesAvailable: boolean; 
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; 
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
    const firebaseServices = useMemo(() => {
        return initializeFirebase();
    }, []);

    const contextValue = useMemo((): FirebaseContextState => {
        const servicesAvailable = !!(firebaseServices.firebaseApp && firebaseServices.firestore && firebaseServices.auth && firebaseServices.storage);
        return {
            areServicesAvailable: servicesAvailable,
            firebaseApp: servicesAvailable ? firebaseServices.firebaseApp : null,
            firestore: servicesAvailable ? firebaseServices.firestore : null,
            auth: servicesAvailable ? firebaseServices.auth : null,
            storage: servicesAvailable ? firebaseServices.storage : null,
        };
    }, [firebaseServices]);

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
}


export const useFirebase = (): { firebaseApp: FirebaseApp, firestore: Firestore, auth: Auth, storage: FirebaseStorage } => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth || !context.storage) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    storage: context.storage,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuthCore = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase Storage instance. */
export const useStorage = (): FirebaseStorage => {
    const { storage } = useFirebase();
    return storage;
};


/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export * from '../firestore/use-collection';
export * from '../firestore/use-doc';