'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          💖 Untuk Perempuan Solopreneur Pemula
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          Bangun Bisnismu dari Nol — Tanpa Ribet!
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Catat produk, customer, order, dan keuanganmu dalam 1 tempat.  
          Tidak perlu jadi akuntan — cukup jadi dirimu yang jago bikin produk!
        </p>
        <Link
          href="/erp/guide"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
        >
          ✨ Mulai Gratis Sekarang
        </Link>
      </div>

      {/* Studi Kasus */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Kisah Ibu Rina</h2>
          <p className="text-slate-700 mb-4">
            Ibu rumah tangga 30 tahun dari Bandung yang jago bikin brownies.  
            Dulu bingung: “Gimana cara catat untung-rugi? Takut rugi, tapi pengin coba jualan.”
          </p>
          <p className="text-slate-700 mb-4">
            Sekarang, dengan ManagHer:
          </p>
          <ul className="text-slate-700 list-disc pl-5 space-y-1 mb-6">
            <li>Tambah 1 produk: “Brownies Coklat Ibu Rina”</li>
            <li>Simpan kontak 3 customer pertama</li>
            <li>Catat setiap order & pengeluaran</li>
            <li>Lihat laporan: Laba bersih Rp 39.000 dalam 3 hari!</li>
          </ul>
          <Link
            href="/erp/guide"
            className="text-pink-600 hover:text-pink-800 font-medium"
          >
            📖 Baca Panduan Lengkap Ibu Rina →
          </Link>
        </div>
      </div>

      {/* Fitur Utama */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Mini ERP untuk Solopreneur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="📦"
            title="Produk"
            desc="Catat nama, harga, stok, dan foto produkmu."
          />
          <FeatureCard
            icon="👩"
            title="Customer"
            desc="Simpan kontak pelanggan setia — dari tetangga sampai teman arisan."
          />
          <FeatureCard
            icon="🛒"
            title="Order"
            desc="Catat setiap order, status, dan tanggal kirim."
          />
          <FeatureCard
            icon="💰"
            title="Sales"
            desc="Lihat total pendapatan harian/mingguan."
          />
          <FeatureCard
            icon="📥"
            title="Pengeluaran"
            desc="Catat belanja bahan, ongkir, atau langganan software."
          />
          <FeatureCard
            icon="📊"
            title="Dashboard"
            desc="Ringkasan bisnismu dalam 1 klik — termasuk laba bersih!"
          />
        </div>
      </div>

      {/* CTA Akhir */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          Kamu Sudah Punya Produk. Sekarang, Punya Sistem!
        </h2>
        <p className="text-slate-600 mb-8">
          Tidak perlu modal besar. Cukup 1 langkah kecil hari ini.
        </p>
        <Link
          href="/erp/guide"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
        >
          ✨ Mulai Bisnismu Sekarang
        </Link>
        <p className="text-sm text-slate-500 mt-4">
          Gratis. Tidak perlu kartu kredit. Bisa pakai HP.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  );
}