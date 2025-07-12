import { StateCreator } from 'zustand';
import { User } from '../../types';

export interface UserSlice {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  // 初始状态
  user: null,
  isAuthenticated: false,
  
  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status })
});