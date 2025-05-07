// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEgetsUv72OProCLVcqzBzFEM5lCyeWEw",
  authDomain: "aisummary-64671.firebaseapp.com",
  projectId: "aisummary-64671",
  storageBucket: "aisummary-64671.appspot.com",
  messagingSenderId: "815353863161",
  appId: "1:815353863161:web:0a6fce5417f7c9c30f3b28",
  measurementId: "G-NPJ4FBKS3H"
};

console.log("🔥 Firebase Config Debug:", firebaseConfig);

// ✅ Prevent Firebase from initializing multiple times
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Auth
export const auth = getAuth(app);

// ✅ Set up providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

// =============================
// Sign-In with Providers
// =============================

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { success: false, error };
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Facebook sign-in error:", error);
    return { success: false, error };
  }
};

export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Twitter sign-in error:", error);
    return { success: false, error };
  }
};

// =============================
// Email/Password Auth
// =============================

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email sign-up error:", error);
    return { success: false, error };
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email login error:", error);
    return { success: false, error };
  }
};
