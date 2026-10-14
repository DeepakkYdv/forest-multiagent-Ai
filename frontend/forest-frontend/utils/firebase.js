// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "forest-multiagent-bf09b.firebaseapp.com",
  projectId: "forest-multiagent-bf09b",
  storageBucket: "forest-multiagent-bf09b.firebasestorage.app",
  messagingSenderId: "582014733893",
  appId: "1:582014733893:web:8582010dd09e655157dd2c",
  measurementId: "G-NRDB7MNRW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 