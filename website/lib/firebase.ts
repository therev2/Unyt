// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAipsxuVBPlODQZajPhfEHA8sU1GSryp2g",
  authDomain: "unyt-a2c51.firebaseapp.com",
  projectId: "unyt-a2c51",
  storageBucket: "unyt-a2c51.appspot.com",
  messagingSenderId: "779110394031",
  appId: "1:779110394031:web:ad80fad5f1df02efb8cc5a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);