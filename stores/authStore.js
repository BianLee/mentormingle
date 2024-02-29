// store/authStore.js
import create from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: !!user, user }),
  setIsAuthenticated: (value) => set({ setIsAuthenticated: value }),
}));

export default useAuthStore;
