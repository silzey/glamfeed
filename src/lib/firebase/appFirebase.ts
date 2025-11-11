
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_PROJECT_ID,
};

// Prevent reinitializing during hot reload in dev
const appFirebase = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(appFirebase);
export default appFirebase;
