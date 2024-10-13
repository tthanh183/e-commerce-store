import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';

export const useProductStore = create(set => ({
  products: [],
  loading: false,

  setProducts: products => set({ products }),
  createProduct: async productData => {
    set({ loading: true });
    try {
      const res = await axios.post('/api/products', productData);
      set(state => ({
        products: [...state.products, res.data],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/products');
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Error fetching products');
    }
  },
  fetchProductsByCategory: async category => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Error fetching products');
    }
  },
  deleteProduct: async productId => {
    set({ loading: true });
    try {
      await axios.delete(`/api/products/${productId}`);
      set(state => ({
        products: state.products.filter(product => product._id !== productId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || 'Error deleting product');
    }
  },
  toggleFeaturedProduct: async productId => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/api/products/${productId}`);
      set(state => ({
        products: state.products.map(product =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || 'Error toggling featured product'
      );
    }
  },
}));
