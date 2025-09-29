'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function DashboardPage() {
  const {
    products,
    customers,
    orders,
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

  // 🔥 Pendapatan HANYA dari order SELESAI
  const totalRevenue = orders
    .filter(order => order.status === 'Selesai')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // 🔥 Pengeluaran HANYA dari order SELESAI
  const totalExpenses = orders
    .filter(order => order.status === 'Selesai')
    .reduce((sum, order) => {
      const product = products.find(p => p.id == order.productId);
      if (!product) return sum;

      const unitCost = (Number(product.materialCost) || 0) + (Number(product.otherCost) || 0);
      const orderCost = unitCost * (Number(order.quantity) || 0);
      return sum + orderCost;
    }, 0);

  const netProfit = totalRevenue - totalExpenses;

  // === STATUS ORDER ===
  const completedOrders = orders.filter(o => o.status === 'Selesai').length;
  const pendingOrders = orders.filter(o => o.status === 'Menunggu').length;

  // === STOK TIPIS (≤ 5) ===
  const lowStockProducts = products.filter(p => 
    p.stock !== undefined && p.stock <= 5 && p.stock >= 0
  );

  // === LOGIKA WARNA LABA/RUGI ===
  const isProfit = netProfit >= 0;
  const bgColor = isProfit 
    ? 'from-emerald-50 to-teal-50' 
    : 'from-rose-50 to-pink-50';
  const borderColor = isProfit 
    ? 'border-emerald-200' 
    : 'border-rose-200';
  const textColor = isProfit 
    ? 'text-emerald-800' 
    : 'text-rose-800';
  const subTextColor = isProfit 
    ? 'text-emerald-600' 
    : 'text-rose-600';
  const valueColor = isProfit 
    ? 'text-emerald-700' 
    : 'text-rose-700';
  const statusText = isProfit ? 'Untung' : 'Rugi';

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
            <li>Tambahkan minimal <strong>1 produk</strong> (dengan biaya bahan & biaya lain-lain)</li>
            <li>Tambahkan minimal <strong>1 customer</strong></li>
          </ul>
        </div>
      )}

      {/* 🔢 Statistik Utama */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Produk" value={totalProducts} icon="📦" color="text-pink-500" />
        <StatCard title="Total Customer" value={totalCustomers} icon="👩" color="text-blue-500" />
        <StatCard title="Total Order" value={totalOrders} icon="🛒" color="text-green-500" />
        <StatCard 
          title="Pendapatan" 
          value={`Rp ${totalRevenue.toLocaleString()}`} 
          icon="💰" 
          color="text-purple-500" 
        />
        <StatCard 
          title="Pengeluaran" 
          value={`Rp ${totalExpenses.toLocaleString()}`} 
          icon="📥" 
          color="text-rose-500" 
        />
      </div>

      {/* 💰 Laba Bersih — DINAMIS: HIJAU (UNTUNG) / MERAH (RUGI) */}
      <div className={`mb-8 bg-gradient-to-r ${bgColor} border ${borderColor} rounded-2xl p-5`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className={`font-semibold ${textColor}`}>Laporan Untung / Rugi Hari Ini</h3>
            <p className={`text-sm ${subTextColor}`}>Pendapatan – Pengeluaran ({statusText})</p>
          </div>
          <div className={`text-2xl font-bold ${valueColor}`}>
            Rp {Math.abs(netProfit).toLocaleString()}
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