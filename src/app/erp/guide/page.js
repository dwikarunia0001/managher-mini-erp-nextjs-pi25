'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-700">💖 Panduan Pemula</h1>
        <p className="text-slate-600 mt-2">
          Bangun bisnismu dari 0 — tanpa modal besar, tanpa ribet!
        </p>
      </div>

      <div className="space-y-8">
        {/* Langkah 1 */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">1</div>
            <div>
              <h2 className="text-xl font-semibold">Tentukan 1 Produk Pertamamu</h2>
              <p className="text-slate-700 mt-2">
                Pilih sesuatu yang kamu suka buat atau jual — bisa jasa, makanan, baju, atau aksesoris.
                Tidak perlu sempurna! Cukup 1 produk.
              </p>
              <Link href="/erp/products" className="mt-3 inline-block text-pink-600 hover:text-pink-800 font-medium">
                ➕ Tambah Produk Pertamamu
              </Link>
            </div>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h2 className="text-xl font-semibold">Catat Harga & Biaya</h2>
              <p className="text-slate-700 mt-2">
                Harga = biaya bahan + waktu + keuntungan kecil.  
                Jangan takut hargai usahamu! Kamu layak dibayar.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                💡 Contoh: Bahan Rp 20.000 + keuntungan Rp 10.000 = jual Rp 30.000
              </p>
            </div>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">3</div>
            <div>
              <h2 className="text-xl font-semibold">Simpan Kontak 1 Customer Pertama</h2>
              <p className="text-slate-700 mt-2">
                Bisa teman, keluarga, atau tetangga. Tawarkan produkmu dengan jujur.
                Minta feedback — ini emas untuk perbaikan!
              </p>
              <Link href="/erp/customers" className="mt-3 inline-block text-green-600 hover:text-green-800 font-medium">
                ➕ Tambah Customer Pertamamu
              </Link>
            </div>
          </div>
        </div>

        {/* Langkah 4 */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">4</div>
            <div>
              <h2 className="text-xl font-semibold">Catat Setiap Transaksi</h2>
              <p className="text-slate-700 mt-2">
                Order masuk? Catat di <strong>Order</strong>.  
                Beli bahan? Catat di <strong>Expense</strong>.  
                Semua data ini akan jadi laporan keuanganmu!
              </p>
              <p className="text-sm text-slate-500 mt-2">
                💸 Laba = Total Penjualan – Total Pengeluaran
              </p>
            </div>
          </div>
        </div>

        {/* Penutup */}
        <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200">
          <p className="text-pink-700 font-medium">
            ✨ Kamu tidak sendiri.  
            <br />
            <span className="font-normal">10.000+ solopreneur perempuan mulai dari 1 langkah kecil — seperti ini.</span>
          </p>
          <Link
            href="/erp/dashboard"
            className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium"
          >
            Mulai Sekarang →
          </Link>
        </div>
      </div>
    </div>
  );
}