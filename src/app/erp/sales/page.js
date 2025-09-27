'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function SalesPage() {
  const { products, orders, fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductName = (id) => products.find(p => p.id == id)?.name || '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : '—';

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">💰 Laporan Penjualan</h1>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Tanggal</th>
                <th className="p-3 text-left whitespace-nowrap">Produk</th>
                <th className="p-3 text-left whitespace-nowrap">Qty</th>
                <th className="p-3 text-left whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    Belum ada penjualan.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-pink-50">
                    <td className="p-3 whitespace-nowrap">{formatDate(o.date)}</td>
                    <td className="p-3 font-medium whitespace-nowrap">{getProductName(o.productId)}</td>
                    <td className="p-3 text-center whitespace-nowrap">{o.quantity}</td>
                    <td className="p-3 text-pink-600 font-medium whitespace-nowrap">Rp {o.total.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card List */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">💰</span>
            </div>
            <p>Belum ada penjualan.</p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Tanggal</span>
                  <span className="text-slate-800">{formatDate(o.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Produk</span>
                  <span className="font-medium">{getProductName(o.productId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Qty</span>
                  <span>{o.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Total</span>
                  <span className="text-pink-600 font-medium">Rp {o.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Pendapatan */}
      <div className="mt-6 text-right">
        <div className="inline-block bg-pink-50 px-4 py-2 rounded-lg">
          <span className="text-pink-700 font-medium">Total Pendapatan: </span>
          <span className="text-pink-900 font-bold">Rp {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}