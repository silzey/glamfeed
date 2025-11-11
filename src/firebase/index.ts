
'use client';

// This file is now primarily for re-exporting hooks and utilities
// The actual initialization is handled in /src/lib/firebase/*

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';

export { useUser } from './hooks/use-user';
export { useFirestore, useStorage, useFirebaseApp, useMemoFirebase, FirebaseProvider, useAuthCore } from './hooks/use-firebase';
