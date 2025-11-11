
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const dataFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_DATA_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DATA_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_DATA_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DATA_STORAGE_BUCKET,
};

// Check if already initialized; name it differently to avoid conflict
const dataApp = getApps().find(app => app.name === "dataApp") 
  || initializeApp(dataFirebaseConfig, "dataApp");

export const db = getFirestore(dataApp);
export const storage = getStorage(dataApp);
export default dataApp;

