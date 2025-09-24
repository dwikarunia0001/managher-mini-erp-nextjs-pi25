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

    deleteOrder: (id) => {
      const orders = get().orders.filter(o => o.id !== id);
      get().saveOrders(orders);
    },
  };
});

export default useStore;