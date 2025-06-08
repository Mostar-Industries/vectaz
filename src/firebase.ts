// src/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ25KgF2nTpqh5z0iDCUSB2oj-DCceWgo",
  authDomain: "tokyo-scholar-356213.firebaseapp.com",
  projectId: "tokyo-scholar-356213",
  storageBucket: "tokyo-scholar-356213.firebasestorage.app",
  messagingSenderId: "353110342117",
  appId: "1:353110342117:web:18468c18fa83f1be25d70c",
  measurementId: "G-BP0J08WVK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  
// Ultra-futuristic, browser-only Analytics initialization
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}
export { analytics };

export default app;

function isSupported() {
  return Promise.resolve(true);
}

