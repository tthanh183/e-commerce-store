import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error('Passwords do not match');
    }

    try {
      const res = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'An error occurred');
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      });

      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'An error occurred');
    }
  },
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null });
    } catch (error) {
      toast.error(error.response.data.message || 'An error occurred');
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get('/api/auth/profile');
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
}));
