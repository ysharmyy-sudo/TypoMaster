import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AUTH_KEYS_TO_CLEAR = [
  'ptt_emailForSignIn',
  'ptt_nameForSignIn',
  // AppContext keys
  'isPremium',
  'trialsUsed',
];

/**
 * Logs user out and clears local persisted auth-related data.
 * Note: Firebase Auth stores its own session; calling signOut is the correct way
 * to clear Firebase tokens.
 */
export const logoutAndClearTokens = async () => {
  try {
    await signOut(auth);
  } catch {
    // ignore (we still clear local data and let UI redirect)
  }

  for (const k of AUTH_KEYS_TO_CLEAR) {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  }
};

