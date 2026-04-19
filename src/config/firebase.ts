import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Go to Firebase Console → Project Settings → General
// → Your apps → Web app → firebaseConfig
// Paste each value below

const firebaseConfig = {
  apiKey: "paste your firebase apiKey here",
  authDomain: "paste your firebase authDomain here",
  projectId: "paste your firebase projectId here",
  storageBucket: "paste your firebase storageBucket here",
  messagingSenderId: "paste your firebase messagingSenderId here",
  appId: "paste your firebase appId here",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
