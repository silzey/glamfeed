// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCwmeORwHLnQ8ESauE9cobUYE-stkiq7fM",
  authDomain: "studio-9439717090-1fb6e.firebaseapp.com",
  projectId: "studio-9439717090-1fb6e",
  storageBucket: "studio-9439717090-1fb6e.firebasestorage.app",
  messagingSenderId: "779726117709",
  appId: "1:779726117709:web:11b8676cd7b5fb2cec3504",
  measurementId: "G-FBRQCW4X60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize analytics only on the client side
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
