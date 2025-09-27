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
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">📊 Dashboard</h1>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Total Produk"
          value={totalProducts}
          icon="📦"
          color="text-pink-500"
        />
        <StatCard
          title="Total Customer"
          value={totalCustomers}
          icon="👩"
          color="text-blue-500"
        />
        <StatCard
          title="Total Order"
          value={totalOrders}
          icon="🛒"
          color="text-green-500"
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString()}`}
          icon="💰"
          color="text-purple-500"
        />
        <StatCard
          title="Total Pengeluaran"
          value={`Rp ${totalExpenses.toLocaleString()}`}
          icon="📥"
          color="text-rose-500"
        />
      </div>

      {/* Laba Bersih */}
      <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-emerald-800">Laba Bersih</h3>
            <p className="text-sm text-emerald-600">Pendapatan - Pengeluaran</p>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            Rp {netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Ringkasan Order */}
      <div className="flex justify-center mb-6">
      <div className="grid grid-cols-=1 sm:grid-cols-2 gap-4 max-w-max">
        <SummaryCard
          title="Order Selesai"
          value={completedOrders}
          color="text-green-700"
          isBold={false}
        />
        <SummaryCard
          title="Order Menunggu"
          value={pendingOrders}
          color="text-orange-700"
          isBold={true}
        />
      </div>
      </div>

       {/* Peringatan Stok Tipis */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Stok Produk Tipis</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>{p.name}</span>
                    <span className="font-medium">Stok: {p.stock}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-amber-600">
                Segera restok agar tidak kehabisan!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// === Komponen Pendukung ===

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`${color} text-lg`}>{icon}</div>
      <h3 className="text-sm text-slate-500 mt-1">{title}</h3>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center min-w-[300px] shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-sm text-slate-500">{title}</h4>
      <p className={`mt-1 font-bold ${color}`}>{value}</p>
    </div>
  );
}