'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function SalesPage() {
  const { products, customers, orders, fetchProducts, fetchCustomers } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">💰 Laporan Penjualan</h1>
      <div className="bg-white rounded-2xl p-4 border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Produk</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">Belum ada penjualan</td>
              </tr>
            ) : (
              orders.map((o) => {
                const customer = customers.find(c => c.id == o.customerId)?.name || '—';
                const product = products.find(p => p.id == o.productId)?.name || '—';
                return (
                  <tr key={o.id}>
                    <td className="p-2">{o.date}</td>
                    <td className="p-2">{customer}</td>
                    <td className="p-2">{product} ({o.quantity})</td>
                    <td className="p-2 text-right">Rp {o.total.toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="mt-4 text-right text-lg font-bold">
          Total Pendapatan: <span>Rp {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}