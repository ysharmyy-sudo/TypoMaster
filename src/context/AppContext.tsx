import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiGetMe } from '../services/api';

interface AppUser {
  uid: string;
  name: string;
  email: string;
  isPremium: boolean;
  plan: 'free' | 'pro' | 'lifetime';
  trialsUsed: number;
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  firebaseUser: FirebaseUser | null;
  isPremium: boolean;
  setPremium: (status: boolean) => void;
  trialsUsed: number;
  setTrialsUsed: (n: number) => void;
  useTrial: () => boolean;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Derived from user object (single source of truth = MongoDB via API)
  const isPremium = user?.isPremium ?? false;
  const trialsUsed = user?.trialsUsed ?? 0;

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          // Fetch full profile from MongoDB
          const { user: mongoUser } = await apiGetMe();
          setUser(mongoUser);
        } catch {
          // MongoDB profile not found (e.g. mid-registration) — use Firebase data
          setUser({
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            isPremium: false,
            plan: 'free',
            trialsUsed: 0,
          });
        }
      } else {
        setUser(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setPremium = (status: boolean) => {
    setUser(prev => prev ? { ...prev, isPremium: status } : prev);
  };

  const setTrialsUsed = (n: number) => {
    setUser(prev => prev ? { ...prev, trialsUsed: n } : prev);
  };

  const useTrial = () => {
    if (isPremium) return true;
    if (trialsUsed < 3) {
      setTrialsUsed(trialsUsed + 1);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      firebaseUser,
      isPremium,
      setPremium,
      trialsUsed,
      setTrialsUsed,
      useTrial,
      authLoading,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
