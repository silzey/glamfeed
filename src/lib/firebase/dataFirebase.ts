
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const dataFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_DATA_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DATA_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_DATA_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DATA_STORAGE_BUCKET,
};

let dataApp: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

function getDataFirebase(): FirebaseApp {
    if (dataApp) return dataApp;
    
    const existingApp = getApps().find(app => app.name === "dataApp");
    if (existingApp) {
        dataApp = existingApp;
    } else {
        dataApp = initializeApp(dataFirebaseConfig, "dataApp");
    }
    return dataApp;
}

function getDbInstance(): Firestore {
    if (db) return db;
    db = getFirestore(getDataFirebase());
    return db;
}

function getStorageInstance(): FirebaseStorage {
    if (storage) return storage;
    storage = getStorage(getDataFirebase());
    return storage;
}

const dataAppInstance = getDataFirebase();
const dbInstance = getDbInstance();
const storageInstance = getStorageInstance();

export { dbInstance as db, storageInstance as storage };
export default dataAppInstance;
