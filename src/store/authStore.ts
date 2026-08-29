import {create} from 'zustand';
import {tokenManager} from '../security/tokenManager';
import {authService} from '../services/authService';
import type {AuthTokens, UserRole} from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  isLoading: boolean;
  isProfileComplete: boolean;

  initFromStorage: () => void;
  setAuth: (tokens: AuthTokens, role: UserRole, userId: string, isProfileComplete: boolean) => void;
  setProfileComplete: (value: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  userId: null,
  isLoading: true,
  isProfileComplete: false,

  initFromStorage: () => {
    const hasSession = tokenManager.hasValidSession();
    const role = tokenManager.getRole() ?? null;
    const userId = tokenManager.getUserId() ?? null;
    set({
      isAuthenticated: hasSession,
      role,
      userId,
      isLoading: false,
    });
  },

  setAuth: (tokens, role, userId, isProfileComplete) => {
    tokenManager.saveTokens(tokens);
    tokenManager.saveRole(role);
    tokenManager.saveUserId(userId);
    set({isAuthenticated: true, role, userId, isProfileComplete, isLoading: false});
  },

  setProfileComplete: (value) => set({isProfileComplete: value}),

  logout: async () => {
    await authService.logout();
    set({isAuthenticated: false, role: null, userId: null, isProfileComplete: false});
  },
}));
