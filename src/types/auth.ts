import type { User } from "firebase/auth";

export type AuthMode = "local" | "firebase";

export interface AuthState {
  user: User | null;
  authMode: AuthMode;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchToLocalMode: () => void;
  setAuthMode: (mode: AuthMode) => void;
}
