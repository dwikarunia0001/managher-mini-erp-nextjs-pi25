'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [journeyOpen, setJourneyOpen] = useState(true);
  const [erpOpen, setErpOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm p-4 z-10 hidden lg:block">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 grid place-items-center text-white font-bold">MH</div>
        <div>
          <div className="font-semibold">ManagHer ERP</div>
          <div className="text-xs text-slate-500">Solopreneur Tools</div>
        </div>
      </div>

      {/* Mini ERP */}
      <div>
        <button
          onClick={() => setErpOpen(!erpOpen)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          Mini ERP
          <span>{erpOpen ? '▲' : '▼'}</span>
        </button>
        {erpOpen && (
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/erp/dashboard" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/dashboard') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>📊 Dashboard</Link></li>
            <li><Link href="/erp/products" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/products') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>📦 Produk</Link></li>
            <li><Link href="/erp/customers" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/customers') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>👩 Customer</Link></li>
            <li><Link href="/erp/orders" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/orders') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>🛒 Order</Link></li>
            <li><Link href="/erp/sales" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/sales') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>💰 Sales</Link></li>
            <li><Link href="/erp/expenses" className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/expenses') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}>💰 Expense</Link></li>
          </ul>
        )}
      </div>

      <div className="mt-auto pt-4 text-xs text-slate-500">v1.0 — MVP</div>
    </aside>
  );
}