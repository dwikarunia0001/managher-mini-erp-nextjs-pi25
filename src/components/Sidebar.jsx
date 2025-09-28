'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [erpOpen, setErpOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm p-4 z-50 transition-transform duration-220 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-10 lg:block
        `}
      >
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff6fa2] to-[#6ecbff] grid place-items-center text-white font-bold shadow-md">
            MH
          </div>
          <div>
            <div className="font-semibold">ManagHer ERP</div>
            <div className="text-xs text-slate-500">Solopreneur Tools</div>
          </div>
        </div>

        {/* 💖 Panduan untuk Pemula + Tombol */}
        <div className="mb-6 p-3 bg-pink-50 rounded-lg border border-pink-200">
          <p className="text-xs text-pink-700 font-medium mb-2">
            💖 Halo, Solopreneur!  
            <br />
            <span className="font-normal">
              Kamu tidak perlu modal besar. Mulai dari 1 produk, 1 customer, dan 1 langkah kecil hari ini!
            </span>
          </p>
          <Link
            href="/erp/guide"
            className="inline-block w-full text-center px-3 py-1.5 text-xs font-medium text-pink-700 bg-white rounded-lg border border-pink-200 hover:bg-pink-100 transition"
            onClick={closeMobile}
          >
            📖 Panduan Pemula
          </Link>
        </div>

        {/* Mini ERP (tanpa menu Panduan Pemula) */}
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
              <li>
                <Link
                  href="/erp/dashboard"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/dashboard') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/products"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/products') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  📦 Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/customers"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/customers') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  👩 Customer
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/orders"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/orders') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  🛒 Order
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/sales"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/sales') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  💰 Sales
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/expenses"
                  className={`flex items-center gap-3 p-2 rounded-lg ${isActive('/expenses') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100'}`}
                  onClick={closeMobile}
                >
                  📥 Expense
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Kalimat Penutup */}
        <div className="mt-auto pt-4 text-xs text-slate-500">
          <p className="mb-1">v1.0 — ManagHer Mini ERP</p>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white p-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="text-sm text-slate-500">Mini ERP</div>
      </div>
    </>
  );
}