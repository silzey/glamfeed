
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_PROJECT_ID,
};

let appFirebase: FirebaseApp;
let auth: Auth;

function getAppFirebase(): FirebaseApp {
    if (appFirebase) return appFirebase;

    const existingApp = getApps().find(app => app.name === '[DEFAULT]');
    if (existingApp) {
        appFirebase = existingApp;
    } else {
        appFirebase = initializeApp(firebaseConfig);
    }
    return appFirebase;
}

function getAuthInstance(): Auth {
    if (auth) return auth;
    auth = getAuth(getAppFirebase());
    return auth;
}

const appInstance = getAppFirebase();
const authInstance = getAuthInstance();

export { authInstance as auth };
export default appInstance;
