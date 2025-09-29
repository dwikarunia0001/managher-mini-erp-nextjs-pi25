'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Hero */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <span className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium border border-pink-200">
            💖 Untuk Pebisnis Pemula
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          ManagHer Mini ERP
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Kelola produk, customer, dan order dalam satu tempat.  
          Lihat laba & rugi otomatis — tanpa ribet, tanpa jadi akuntan!
        </p>

        <Link
          href="/erp/guide"
          className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
        >
          ✨ Mulai Gratis Sekarang
        </Link>
      </div>

      {/* Fitur Utama — Rata Tengah */}
      <div className="mt-20 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-10">Apa yang Bisa Kamu Kelola?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "📦", title: "Produk", desc: "Harga jual, biaya bahan, biaya lain-lain, dan stok." },
            { icon: "👩", title: "Customer", desc: "Simpan data pelanggan setiamu." },
            { icon: "🛒", title: "Order", desc: "Catat setiap transaksi dan status pengiriman." },
            { icon: "💰", title: "Laba & Rugi", desc: "Dashboard otomatis hitung untung/rugi dari order selesai." }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Akhir */}
      <div className="mt-20 max-w-2xl">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Kamu Sudah Punya Produk. Sekarang, Punya Sistem!
          </h3>
          <p className="text-slate-600 mb-6">
            Gratis. Tidak perlu kartu kredit. Bisa pakai HP.
          </p>
          <Link
            href="/erp/guide"
            className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:opacity-90"
          >
            ✨ Mulai Bisnismu Sekarang
          </Link>
        </div>
      </div>

      {/* Footer kecil */}
      <div className="mt-16 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} ManagHer Mini ERP — All rights reserved.</p>
      </div>
    </div>
  );
}