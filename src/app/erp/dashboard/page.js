'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import Link from 'next/link';

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

  const completedOrders = orders.filter(o => o.status === 'Selesai');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalExpenses = completedOrders.reduce((sum, o) => {
    const product = products.find(p => p.id == o.productId);
    if (!product) return sum;
    const unitCost = (Number(product.materialCost) || 0) + (Number(product.otherCost) || 0);
    return sum + unitCost * (o.quantity || 0);
  }, 0);
  const netProfit = totalRevenue - totalExpenses;

  const pendingOrders = orders.filter(o => o.status === 'Menunggu').length;
  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= 5 && p.stock >= 0);

  const isProfit = netProfit >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className='mb-8'>
        <h1 className="text-2xl font-bold text-slate-800">📊 Dashboard</h1>
        <p className="text-slate-600 text-sm mt-1">Semua data penting dalam satu tampilan — segar & jelas!</p>
      </div>

      {/* Panduan Pemula */}
      {(totalProducts === 0 || totalCustomers === 0) && (
        <div className="mb-8 p-5 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded-2xl text-center">
          <p className="text-pink-700 font-medium">💖 Halo Pebisnis Pemula!</p>
          <p className="mt-2 text-sm text-pink-600">
            Tambahkan minimal <strong>1 produk</strong> dan <strong>1 customer</strong> agar dashboard hidup!
          </p>
        </div>
      )}

      {/* Statistik Utama — Lebih Colorful! */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10 text-center">
        {[
          { title: "Total Produk", value: totalProducts, icon: "📦", bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
          { title: "Customer", value: totalCustomers, icon: "👩", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
          { title: "Order", value: totalOrders, icon: "🛒", bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
          { title: "Pendapatan", value: `Rp ${totalRevenue.toLocaleString()}`, icon: "💰", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
          { title: "Pengeluaran", value: `Rp ${totalExpenses.toLocaleString()}`, icon: "📥", bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" }
        ].map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} ${stat.border} rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className={`text-2xl ${stat.text} mb-2`}>{stat.icon}</div>
            <h3 className="text-xs font-medium text-slate-600">{stat.title}</h3>
            <p className="text-lg font-bold mt-1 text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 💰 Laporan Untung / Rugi — Gradient Colorful */}
      <div className={`mb-10 rounded-2xl p-6 shadow-lg border ${
        isProfit 
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' 
          : 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200'
      }`}>
        <h3 className={`text-xl font-bold mb-2 ${
          isProfit ? 'text-emerald-700' : 'text-rose-700'
        }`}>
          Laporan Laba / Rugi Hari Ini
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Hanya dari order yang statusnya <strong>“Selesai”</strong>
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-2xl text-slate-800">
              {isProfit ? '✅ Untung' : '❌ Rugi'}
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${
              isProfit ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              Rp {Math.abs(netProfit).toLocaleString()}
            </span>
            {!isProfit && <span className="text-rose-600 text-sm">(Rugi)</span>}
          </div>
        </div>
      </div>

      {/* ⚠️ Peringatan — Tetap Friendly */}
      {(lowStockProducts.length > 0 || pendingOrders > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lowStockProducts.length > 0 && (
            <AlertCard
              title="Stok Produk Tipis"
              icon="⚠️"
              color="amber"
              items={lowStockProducts.map(p => ({ name: p.name, value: `Stok: ${p.stock}` }))}
              actionLink="/erp/products"
            />
          )}
          {pendingOrders > 0 && (
            <AlertCard
              title="Order Menunggu Diproses"
              icon="⏳"
              color="amber"
              message={`Kamu punya ${pendingOrders} order yang belum diproses.`}
              actionLink="/erp/orders"
            />
          )}
        </div>
      )}
    </div>
  );
}

// === Komponen Pendukung ===

function AlertCard({ title, icon, color, items, message, actionLink }) {
  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <span className="text-amber-700 text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-amber-800">{title}</h3>
          {items ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium text-amber-700">{item.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-700">{message}</p>
          )}
          <Link
            href={actionLink}
            className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:text-purple-800 underline"
          >
            Lihat →
          </Link>
        </div>
      </div>
    </div>
  );
}