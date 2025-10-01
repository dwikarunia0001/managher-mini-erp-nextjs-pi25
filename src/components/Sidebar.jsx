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
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-sm p-3 z-50 transition-transform duration-220 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-10 lg:block
        `}
      >
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#ff6fa2] to-[#6ecbff] grid place-items-center text-white font-bold text-[10px] shadow">
            MH
          </div>
          <div>
            <div className="font-semibold text-xs">ManagHer Mini ERP</div>
            <div className="text-[10px] text-slate-500">Solopreneur Reporting</div>
          </div>
        </div>

        {/* 💖 Panduan untuk Pemula + Tombol */}
        <div className="mb-4 p-2.5 bg-pink-50 rounded border border-pink-200">
          <p className="text-[10px] text-pink-700 font-medium mb-1.5">
            💖 Halo, Solopreneur!  
            <br />
            <span className="font-normal">
              Mulai dari 1 produk, 1 customer, dan 1 langkah kecil hari ini!
            </span>
          </p>
          <Link
            href="/erp/guide"
            className="inline-block w-full text-center px-2.5 py-1 text-[10px] font-medium text-pink-700 bg-white rounded border border-pink-200 hover:bg-pink-100 transition text-nowrap"
            onClick={closeMobile}
          >
            📖 Panduan Pemula
          </Link>
        </div>

        {/* Mini ERP */}
        <div>
          <button
            onClick={() => setErpOpen(!erpOpen)}
            className="flex items-center justify-between w-full text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
          >
            Mini ERP
            <span className="text-[10px]">{erpOpen ? '▲' : '▼'}</span>
          </button>
          {erpOpen && (
            <ul className="mt-1.5 space-y-0.5">
              <li>
                <Link
                  href="/erp/dashboard"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded ${isActive('/erp/dashboard') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100 text-xs'}`}
                  onClick={closeMobile}
                >
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/products"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded ${isActive('/erp/products') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100 text-xs'}`}
                  onClick={closeMobile}
                >
                  📦 Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/customers"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded ${isActive('/erp/customers') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100 text-xs'}`}
                  onClick={closeMobile}
                >
                  👩 Customer
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/orders"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded ${isActive('/erp/orders') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100 text-xs'}`}
                  onClick={closeMobile}
                >
                  🛒 Order
                </Link>
              </li>
              <li>
                <Link
                  href="/erp/profit-loss"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded ${isActive('/erp/profit-loss') ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-100 text-xs'}`}
                  onClick={closeMobile}
                >
                  📈 Laporan Laba Rugi
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Kalimat Penutup */}
        <div className="mt-auto pt-3 text-[10px] text-slate-500">
          <p>v1.0 — ManagHer Mini ERP</p>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white p-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="text-xs text-slate-500">Mini ERP</div>
      </div>
    </>
  );
}