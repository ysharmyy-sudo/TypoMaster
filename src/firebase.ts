import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * IMPORTANT (security note):
 * Firebase "apiKey" and config values are NOT treated as secrets.
 * Real security comes from Firebase Auth + server-side verification (we do that in backend with firebase-admin).
 *
 * Still, we keep config in Vercel env vars for clean management.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

