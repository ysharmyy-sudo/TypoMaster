import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

interface AppContextType {
  trialsUsed: number;
  useTrial: () => boolean;
  isPremium: boolean;
  setPremium: (status: boolean) => void;
  user: any;
  setUser: (user: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trialsUsed, setTrialsUsed] = useState(() => {
    const saved = localStorage.getItem('trialsUsed');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPremium, setPremium] = useState(() => {
    return localStorage.getItem('isPremium') === 'true';
  });
  const [user, setUser] = useState<any>(null);

  // Hydrate user from saved JWT (if present)
  useEffect(() => {
    let cancelled = false;
    const token = (() => {
      try {
        return localStorage.getItem('ptt_token') || '';
      } catch {
        return '';
      }
    })();
    if (!token) return;

    void (async () => {
      try {
        const res = await apiGet<{ success: boolean; user: any }>('/api/auth/me');
        if (cancelled) return;
        if (res?.user) {
          setUser(res.user);
          setPremium(!!res.user.isPremium);
        }
      } catch {
        // token may be invalid/expired
        try {
          localStorage.removeItem('ptt_token');
        } catch {
          // ignore
        }
        if (!cancelled) setUser(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('trialsUsed', trialsUsed.toString());
  }, [trialsUsed]);

  useEffect(() => {
    localStorage.setItem('isPremium', isPremium.toString());
  }, [isPremium]);

  const useTrial = () => {
    if (isPremium) return true;
    if (trialsUsed < 3) {
      setTrialsUsed(prev => prev + 1);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{ 
      trialsUsed, 
      useTrial, 
      isPremium, 
      setPremium, 
      user, 
      setUser
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
