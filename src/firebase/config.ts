'use client';

// Config for the PRIMARY app (Hosting, Auth)
export const primaryFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Config for the SECONDARY app (Data: Firestore, Storage)
export const dataFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DATA_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DATA_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DATA_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DATA_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DATA_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DATA_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DATA_FIREBASE_MEASUREMENT_ID,
};