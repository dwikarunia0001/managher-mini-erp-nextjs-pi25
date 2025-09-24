import { create } from 'zustand';
import api from '@/lib/api';

const useStore = create((set, get) => ({
  // Data
  products: [],
  customers: [],
  orders: [],

  // Loading
  loading: false,

  // Fetch
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/products');
      set({ products: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/customers');
      set({ customers: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/orders');
      set({ orders: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },

  // Create
  addProduct: async (data) => {
    const res = await api.post('/products', data);
    set((state) => ({ products: [...state.products, res.data] }));
  },
  addCustomer: async (data) => {
    const res = await api.post('/customers', data);
    set((state) => ({ customers: [...state.customers, res.data] }));
  },
  addOrder: async (data) => {
    const res = await api.post('/orders', data);
    set((state) => ({ orders: [...state.orders, res.data] }));
  },

  // Update
  updateProduct: async (id, data) => {
    await api.put(`/products/${id}`, data);
    set((state) => ({
      products: state.products.map((p) => (p.id == id ? { ...p, ...data } : p)),
    }));
  },
  updateCustomer: async (id, data) => {
    await api.put(`/customers/${id}`, data);
    set((state) => ({
      customers: state.customers.map((c) => (c.id == id ? { ...c, ...data } : c)),
    }));
  },

  // Delete
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set((state) => ({ products: state.products.filter((p) => p.id != id) }));
  },
  deleteCustomer: async (id) => {
    await api.delete(`/customers/${id}`);
    set((state) => ({ customers: state.customers.filter((c) => c.id != id) }));
  },
  deleteOrder: async (id) => {
    await api.delete(`/orders/${id}`);
    set((state) => ({ orders: state.orders.filter((o) => o.id != id) }));
  },
}));

export default useStore;