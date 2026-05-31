const AUTH_KEYS_TO_CLEAR = [
  // App JWT
  'ptt_token',
  // AppContext keys
  'isPremium',
  'trialsUsed',
];

/**
 * Logs user out and clears local persisted auth-related data.
 */
export const logoutAndClearTokens = async () => {
  for (const k of AUTH_KEYS_TO_CLEAR) {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  }
};
