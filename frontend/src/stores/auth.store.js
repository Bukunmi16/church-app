import { create } from "zustand";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "@/api/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });

    try {
      const data = await loginUser(credentials);

      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });  

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });

    try {
      const data = await registerUser(userData);

      set({ isLoading: false });

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });

    try {
      const data = await getCurrentUser();

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });

      throw error;
    }
  },

  refresh: async () => {
    try {
      const data = await refreshAccessToken();

      set({
        accessToken: data.accessToken,
        isAuthenticated: true,
      });

      return data;
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });

    try {
    
        await useAuthStore.getState().refresh();
        await useAuthStore.getState().fetchCurrentUser();
    
    } catch (error) {
        set({
            user:null,
            accessToken: null,
            isAuthenticated: false,
        })
    } finally{
        set({ 
            isLoading: false,
            isInitialized: true
        });
    }
  }
}));

export default useAuthStore;