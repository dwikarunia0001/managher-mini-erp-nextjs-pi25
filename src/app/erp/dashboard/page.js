'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    products,
    customers,
    orders,
    expenses,
    fetchProducts,
    fetchCustomers,
  } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  // === ANALITIK UTAMA ===
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.total || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // === STATUS ORDER ===
  const completedOrders = orders.filter(o => o.status === 'Selesai').length;
  const pendingOrders = orders.filter(o => o.status === 'Menunggu').length;

  // === STOK TIPIS (≤ 5) ===
  const lowStockProducts = products.filter(p => 
    p.stock !== undefined && p.stock <= 5 && p.stock >= 0
  );

  

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">📊 Dashboard</h1>
        <p className="text-slate-600 text-sm">
          Ringkasan bisnismu hari ini — mulai dari sini!
        </p>
      </div>

      {/* 🌸 Panduan Pemula */}
      {(totalProducts === 0 || totalCustomers === 0) && (
        <div className="mb-8 p-4 bg-pink-50 border border-pink-200 rounded-2xl">
          <p className="text-pink-700 font-medium">
            💖 Halo Solopreneur!  
            <br />
            <span className="font-normal">
              Untuk melihat data lengkap, pastikan kamu sudah:
            </span>
          </p>
          <ul className="mt-2 text-sm text-pink-600 list-disc pl-5 space-y-1">
            <li>Tambahkan minimal <strong>1 produk</strong></li>
            <li>Tambahkan minimal <strong>1 customer</strong></li>
          </ul>
        </div>
      )}

      {/* 🔢 Statistik Utama */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Produk" value={totalProducts} icon="📦" color="text-pink-500" />
        <StatCard title="Total Customer" value={totalCustomers} icon="👩" color="text-blue-500" />
        <StatCard title="Total Order" value={totalOrders} icon="🛒" color="text-green-500" />
        <StatCard title="Pendapatan" value={`Rp ${totalRevenue.toLocaleString()}`} icon="💰" color="text-purple-500" />
        <StatCard title="Pengeluaran" value={`Rp ${totalExpenses.toLocaleString()}`} icon="📥" color="text-rose-500" />
      </div>

      {/* 💰 Laba Bersih */}
      <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-emerald-800">Laba Bersih Hari Ini</h3>
            <p className="text-sm text-emerald-600">Pendapatan – Pengeluaran</p>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            Rp {netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* === Peringatan: Stok Tipis & Order Menunggu === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Stok Produk Tipis */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-700 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Stok Produk Tipis</h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-700 max-w-md">
                  {lowStockProducts.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="font-medium">Stok: {p.stock}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-amber-600">
                  Segera restok agar tidak kehabisan!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Order Menunggu Diproses */}
        {pendingOrders > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-700 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Order Menunggu Diproses</h3>
                <p className="mt-2 text-sm text-amber-700">
                  Kamu punya <strong>{pendingOrders} order</strong> yang belum diproses.
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  Segera proses agar customer senang! 💕
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🚀 Aksi Cepat */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold mb-4">🚀 Aksi Cepat untuk Pemula</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/erp/products"
            className="block w-full p-3 text-left bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition"
          >
            ➕ Tambah Produk Pertamaku
          </Link>
          <Link
            href="/erp/customers"
            className="block w-full p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            ➕ Tambah Customer Pertamaku
          </Link>
          <Link
            href="/erp/orders"
            className="block w-full p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
          >
            ➕ Catat Order Pertamaku
          </Link>
          <Link
            href="/erp/expenses"
            className="block w-full p-3 text-left bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition"
          >
            ➕ Catat Pengeluaran Hari Ini
          </Link>
        </div>
      </div>
    </div>
  );
}

// === Komponen Pendukung ===

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
      <div className={`${color} text-lg mb-1`}>{icon}</div>
      <h3 className="text-xs text-slate-500">{title}</h3>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}