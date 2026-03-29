/ 🔥 Firebase Setup - CLEAN VERSION

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBf-8ApKCsQH0T2dfUYS-UWlqlUNMOZPuw",
  authDomain: "typomaster-e35fe.firebaseapp.com",
  projectId: "typomaster-e35fe",
  storageBucket: "typomaster-e35fe.firebasestorage.app",
  messagingSenderId: "443174519704",
  appId: "1:443174519704:web:bb5dea109c471d4d1f61ed",
  measurementId: "G-Z4RL8HWEQ6"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Auth export (IMPORTANT)
export const auth = getAuth(app);