// src/firebase.ts
// Ultra-futuristic, production-ready Firebase setup
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; // Analytics support

// IMPORTANT: Replace the below config with your real Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Prevent re-initialization in hot-reload environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export ready-to-use connections
export const db = getFirestore(app);
export const auth = getAuth(app);

// Ultra-futuristic, browser-only Analytics initialization
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}
export { analytics };

export default app;
