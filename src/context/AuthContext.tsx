import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import type { AuthContextType, AuthMode } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_MODE_KEY = 'fin2ools_auth_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthModeState] = useState<AuthMode>(() => {
    const saved = localStorage.getItem(AUTH_MODE_KEY);
    return (saved as AuthMode) || 'local';
  });

  useEffect(() => {
    // Only listen to Firebase auth if in firebase mode
    if (authMode === 'firebase') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [authMode]);

  const setAuthMode = (mode: AuthMode) => {
    localStorage.setItem(AUTH_MODE_KEY, mode);
    setAuthModeState(mode);
  };

  const signInWithGoogle = async () => {
    try {
      setAuthMode('firebase');
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthMode('firebase');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthMode('firebase');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (authMode === 'firebase') {
        await firebaseSignOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const switchToLocalMode = () => {
    setAuthMode('local');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    authMode,
    loading,
    isAuthenticated: authMode === 'firebase' ? !!user : true, // Local mode is always "authenticated"
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    switchToLocalMode,
    setAuthMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
