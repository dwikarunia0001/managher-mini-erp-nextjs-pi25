'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import Link from 'next/link';

export default function DashboardPage() {
  const { products, customers, orders, fetchProducts, fetchCustomers, fetchOrders } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Produk" value={products.length} icon="📦" color="text-pink-500" />
        <StatCard title="Customer" value={customers.length} icon="👩" color="text-blue-500" />
        <StatCard title="Order" value={orders.length} icon="🛒" color="text-green-500" />
        <StatCard title="Pendapatan" value={`Rp ${totalRevenue.toLocaleString()}`} icon="💰" color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold mb-4">💡 Tips Bisnis</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2"><span className="text-pink-500">✨</span> Catat setiap transaksi!</li>
            <li className="flex items-start gap-2"><span className="text-blue-500">📊</span> Review penjualan mingguan.</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold mb-4">🚀 Aksi Cepat</h3>
          <div className="space-y-3">
            <Link href="/products" className="block w-full p-3 text-left bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100">+ Tambah Produk</Link>
            <Link href="/customers" className="block w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">+ Tambah Customer</Link>
            <Link href="/orders" className="block w-full p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100">+ Buat Order Baru</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100">
      <div className={`${color} text-lg`}>{icon}</div>
      <h3 className="text-sm text-slate-500 mt-1">{title}</h3>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}