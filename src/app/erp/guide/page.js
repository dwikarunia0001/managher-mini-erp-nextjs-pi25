'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Studi Kasus */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100 mb-8">
        <p className="text-pink-700 italic">
          “Aku bisa bikin brownies enak banget, tapi gak tahu cara catat untung-ruginya. Takut rugi, tapi pengin coba jualan.”
          <br />
          <span className="font-medium">— Ibu Rina, Bandung</span>
        </p>
      </div>

      {/* Langkah-Langkah Sederhana */}
      <div className="space-y-6">
        {/* Langkah 1 */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">1</div>
          <div>
            <h2 className="font-semibold">Buat 1 Produk: “Brownies Coklat Ibu Rina”</h2>
            <p className="text-slate-700 text-sm mt-1">
              Harga jual: Rp 25.000  
              Biaya bahan: Rp 12.000  
              ➡️ Keuntungan per bungkus: Rp 13.000
            </p>
            <Link href="/erp/products" className="mt-2 inline-block text-pink-600 hover:text-pink-800 text-sm font-medium">
              ➕ Tambah ke Produk
            </Link>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">2</div>
          <div>
            <h2 className="font-semibold">Simpan Kontak 3 Orang Pertama</h2>
            <p className="text-slate-700 text-sm mt-1">
              Contoh: Bu Siti (tetangga), Dina (teman arisan), Raka (adik kantor suami)  
              Mereka jadi customer pertamamu!
            </p>
            <Link href="/erp/customers" className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
              ➕ Tambah ke Customer
            </Link>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">3</div>
          <div>
            <h2 className="font-semibold">Catat Setiap Order</h2>
            <p className="text-slate-700 text-sm mt-1">
              Contoh:  
              - Bu Siti pesan 2 brownies → total Rp 50.000  
              - Dina pesan 1 brownies → total Rp 25.000
            </p>
            <Link href="/erp/orders" className="mt-2 inline-block text-green-600 hover:text-green-800 text-sm font-medium">
              ➕ Catat Order
            </Link>
          </div>
        </div>

        {/* Langkah 4 */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">4</div>
          <div>
            <h2 className="font-semibold">Lihat Laporan Keuangan</h2>
            <p className="text-slate-700 text-sm mt-1">
              Di halaman <strong>Sales</strong> dan <strong>Expense</strong>, kamu bisa lihat:  
              - Total pendapatan: Rp 75.000  
              - Total biaya: Rp 36.000  
              - Laba bersih: Rp 39.000 💰
            </p>
            <Link href="/erp/dashboard" className="mt-2 inline-block text-purple-600 hover:text-purple-800 text-sm font-medium">
              📊 Lihat Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}