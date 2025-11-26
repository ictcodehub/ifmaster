import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- KONFIGURASI FIREBASE ANDA (ifmaster) ---
const firebaseConfig = {
    apiKey: "AIzaSyAl3yvcFG0Daf9LVHnwaLG6ZtMNTOX9GxI",
    authDomain: "ifmaster.firebaseapp.com",
    projectId: "ifmaster",
    storageBucket: "ifmaster.firebasestorage.app",
    messagingSenderId: "326687913146",
    appId: "1:326687913146:web:ff065e37aab8c73f497e83",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = "kuis-excel-ifmaster-v1";
