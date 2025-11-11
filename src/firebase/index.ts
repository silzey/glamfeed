'use client';

import { primaryFirebaseConfig, dataFirebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const apps = getApps();
  const defaultApp = apps.find(app => app.name === '[DEFAULT]');
  const dataApp = apps.find(app => app.name === 'dataApp');

  const primary = defaultApp ? defaultApp : initializeApp(primaryFirebaseConfig);
  const data = dataApp ? dataApp : initializeApp(dataFirebaseConfig, 'dataApp');
  
  return getSdks(primary, data);
}

export function getSdks(primaryApp: FirebaseApp, dataApp: FirebaseApp) {
  return {
    firebaseApp: primaryApp,
    auth: getAuth(primaryApp), // Auth from the primary app
    firestore: getFirestore(dataApp), // Firestore from the data app
    storage: getStorage(dataApp), // Storage from the data app
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';

export { useUser } from './hooks/use-user';
export { useFirestore, useStorage, useFirebaseApp, useMemoFirebase, FirebaseProvider } from './hooks/use-firebase.tsx';