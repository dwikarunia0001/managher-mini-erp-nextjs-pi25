import { create } from 'zustand';
import api from '@/lib/api';

const useStore = create((set, get) => {
  // Load orders from localStorage on init
  const savedOrders = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orders') || '[]') : [];

  return {
    products: [],
    customers: [],
    orders: savedOrders,
    loading: false,

    // Fetch dari MockAPI
    fetchProducts: async () => {
      set({ loading: true });
      try {
        const res = await api.get('/products');
        set({ products: res.data, loading: false });
      } catch (err) {
        console.error('Gagal fetch produk:', err);
        set({ loading: false });
      }
    },
    fetchCustomers: async () => {
      set({ loading: true });
      try {
        const res = await api.get('/customers');
        set({ customers: res.data, loading: false });
      } catch (err) {
        console.error('Gagal fetch customer:', err);
        set({ loading: false });
      }
    },

    // --- Produk ---
    addProduct: async (data) => {
    const res = await api.post('/products', data);
    set((state) => ({ products: [...state.products, res.data] }));
    },
    updateProduct: async (id, data) => {
    await api.put(`/products/${id}`, data);
    set((state) => ({
        products: state.products.map(p => p.id == id ? { ...p, ...data } : p)
    }));
    },
    deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set((state) => ({ products: state.products.filter(p => p.id != id) }));
    },

    // --- Customer ---
    addCustomer: async (data) => {
    const res = await api.post('/customers', data);
    set((state) => ({ customers: [...state.customers, res.data] }));
    },
    updateCustomer: async (id, data) => {
    await api.put(`/customers/${id}`, data);
    set((state) => ({
        customers: state.customers.map(c => c.id == id ? { ...c, ...data } : c)
    }));
    },
    deleteCustomer: async (id) => {
    await api.delete(`/customers/${id}`);
    set((state) => ({ customers: state.customers.filter(c => c.id != id) }));
    },

    // Orders: simpan di localStorage
    saveOrders: (orders) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      set({ orders });
    },

    addOrder: (data) => {
      const newOrder = {
        id: Date.now().toString(),
        ...data,
        date: new Date().toISOString().split('T')[0],
      };
      const orders = [...get().orders, newOrder];
      get().saveOrders(orders);
    },

    updateOrder: (id, data) => {
      const orders = get().orders.map(o => o.id == id ? { ...o, ...data } : o);
      get().saveOrders(orders);
    },

    deleteOrder: (id) => {
      const orders = get().orders.filter(o => o.id !== id);
      get().saveOrders(orders);
    },
  };
});

export default useStore;