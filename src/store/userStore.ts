import {create} from 'zustand';
import type {CustomerProfile, AstrologerProfile} from '../types/user';

interface UserState {
  customerProfile: CustomerProfile | null;
  astrologerProfile: AstrologerProfile | null;
  unreadNotifications: number;

  setCustomerProfile: (profile: CustomerProfile) => void;
  setAstrologerProfile: (profile: AstrologerProfile) => void;
  updateWalletBalance: (balance: number) => void;
  updateAvailability: (isOnline: boolean) => void;
  setUnreadNotifications: (count: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  customerProfile: null,
  astrologerProfile: null,
  unreadNotifications: 0,

  setCustomerProfile: (profile) => set({customerProfile: profile}),

  setAstrologerProfile: (profile) => set({astrologerProfile: profile}),

  updateWalletBalance: (balance) =>
    set((state) => ({
      customerProfile: state.customerProfile
        ? {...state.customerProfile, walletBalance: balance}
        : null,
      astrologerProfile: state.astrologerProfile
        ? {...state.astrologerProfile, walletBalance: balance}
        : null,
    })),

  updateAvailability: (isOnline) =>
    set((state) => ({
      astrologerProfile: state.astrologerProfile
        ? {...state.astrologerProfile, isOnline}
        : null,
    })),

  setUnreadNotifications: (count) => set({unreadNotifications: count}),

  clearUser: () =>
    set({customerProfile: null, astrologerProfile: null, unreadNotifications: 0}),
}));
