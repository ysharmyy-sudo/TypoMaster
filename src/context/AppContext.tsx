import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AppContextType {
  trialsUsed: number;
  useTrial: () => boolean;
  isPremium: boolean;
  setPremium: (status: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trialsUsed, setTrialsUsed] = useState(() => {
    const saved = localStorage.getItem('trialsUsed');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPremium, setPremium] = useState(() => localStorage.getItem('isPremium') === 'true');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('trialsUsed', trialsUsed.toString());
  }, [trialsUsed]);

  useEffect(() => {
    localStorage.setItem('isPremium', isPremium.toString());
  }, [isPremium]);

  // Restore session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          setUser(null);
          setPremium(false);
          return;
        }
        const res = await apiGet<{ success: boolean; user: any }>('/api/auth/me');
        if (res?.user) {
          setUser(res.user);
          setPremium(!!res.user.isPremium);
        }
      } catch {
        // token invalid or backend down
      }
    });
    return () => unsub();
  }, []);

  const useTrial = () => {
    if (isPremium) return true;
    if (trialsUsed < 3) {
      setTrialsUsed(prev => prev + 1);
      return true;
    }
    return false;
  };

  const logout = () => {
    void signOut(auth);
    setUser(null);
    setPremium(false);
  };

  return (
    <AppContext.Provider value={{ 
      trialsUsed, 
      useTrial, 
      isPremium, 
      setPremium, 
      user, 
      setUser,
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
