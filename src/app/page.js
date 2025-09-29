'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-1 rounded-full text-sm font-medium mb-6 border border-pink-200">
          💖 Untuk Perempuan Solopreneur Pemula
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Bangun Bisnismu dari Nol — Tanpa Ribet!
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Catat produk, customer, order, dan keuanganmu dalam 1 tempat.  
          Tidak perlu jadi akuntan — cukup jadi dirimu yang jago bikin produk!
        </p>
        <Link
          href="/erp/guide"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          ✨ Mulai Gratis Sekarang
        </Link>
      </div>

      {/* Studi Kasus */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xl">👩</div>
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Kisah Ibu Rina</h2>
              <p className="text-amber-700 mb-3">
                Ibu rumah tangga 30 tahun dari Bandung yang jago bikin brownies.  
                Dulu bingung: “Gimana cara catat untung-rugi? Takut rugi, tapi pengin coba jualan.”
              </p>
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <p className="text-slate-700 font-medium mb-2">Sekarang, dengan ManagHer:</p>
                <ul className="text-slate-700 list-disc pl-5 space-y-1">
                  <li>Tambah 1 produk: “Brownies Coklat Ibu Rina”</li>
                  <li>Simpan kontak 3 customer pertama</li>
                  <li>Catat setiap order & pengeluaran</li>
                  <li>Lihat laporan: <span className="text-emerald-600 font-bold">Laba bersih Rp 39.000</span> dalam 3 hari!</li>
                </ul>
              </div>
              <Link
                href="/erp/guide"
                className="mt-4 inline-block text-amber-600 hover:text-amber-800 font-medium"
              >
                📖 Baca Panduan Lengkap Ibu Rina →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fitur Utama */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Mini ERP untuk Solopreneur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "📦", title: "Produk", desc: "Catat nama, harga, stok, dan foto produkmu.", bg: "from-pink-50 to-pink-100", border: "border-pink-200" },
            { icon: "👩", title: "Customer", desc: "Simpan kontak pelanggan setia — dari tetangga sampai teman arisan.", bg: "from-blue-50 to-blue-100", border: "border-blue-200" },
            { icon: "🛒", title: "Order", desc: "Catat setiap order, status, dan tanggal kirim.", bg: "from-green-50 to-green-100", border: "border-green-200" },
            { icon: "💰", title: "Sales", desc: "Lihat total pendapatan harian/mingguan.", bg: "from-purple-50 to-purple-100", border: "border-purple-200" },
            { icon: "📥", title: "Pengeluaran", desc: "Catat belanja bahan, ongkir, atau langganan software.", bg: "from-rose-50 to-rose-100", border: "border-rose-200" },
            { icon: "📊", title: "Dashboard", desc: "Ringkasan bisnismu dalam 1 klik — termasuk laba bersih!", bg: "from-indigo-50 to-indigo-100", border: "border-indigo-200" },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`bg-gradient-to-br ${item.bg} p-6 rounded-xl border ${item.border} hover:shadow-md transition transform hover:-translate-y-1`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Akhir */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-4 rounded-2xl border border-emerald-200">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">
            Kamu Sudah Punya Produk. Sekarang, Punya Sistem!
          </h2>
          <p className="text-emerald-700 mb-6">
            Tidak perlu modal besar. Cukup 1 langkah kecil hari ini.
          </p>
          <Link
            href="/erp/guide"
            className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
          >
            ✨ Mulai Bisnismu Sekarang
          </Link>
          <p className="text-sm text-emerald-600 mt-4">
            Gratis. Tidak perlu kartu kredit. Bisa pakai HP.
          </p>
        </div>
      </div>
    </div>
  );
}