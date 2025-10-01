'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-3 py-6 text-xs">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-slate-800 mb-2">✨ Panduan Memulai</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Ikuti 5 langkah sederhana ini untuk mulai kelola bisnismu dengan ManagHer Mini ERP.
        </p>
      </div>

      {/* Studi Kasus */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 mb-8 text-center">
        <p className="text-pink-700 italic max-w-2xl mx-auto">
          “Aku bisa bikin brownies enak banget, tapi gak tahu cara catat untung-ruginya. Takut rugi, tapi pengin coba jualan.”
        </p>
        <p className="font-medium mt-1 text-slate-800">— Ibu Rina, Bandung</p>
      </div>

      {/* Langkah-Langkah dalam Card Warna-Warni */}
      <div className="space-y-4">
        {[
          {
            step: 1,
            title: "Buat Produk Pertamamu",
            desc: "Isi harga jual, biaya bahan, dan biaya lain-lain agar laba otomatis terhitung.",
            example: "Contoh:\n• Nama: Brownies Coklat Ibu Rina\n• Harga jual: Rp 25.000\n• Biaya bahan: Rp 12.000\n• Biaya lain-lain: Rp 3.000\n➡️ Laba per bungkus: Rp 10.000",
            color: "pink",
            href: "/erp/products",
            cta: "Produk"
          },
          {
            step: 2,
            title: "Simpan Data Pelanggan",
            desc: "Catat nama dan kontak pelanggan setiamu — dari tetangga sampai teman kantor.",
            example: "Contoh:\n• Bu Siti (tetangga)\n• Dina (teman arisan)\n• Raka (adik kantor suami)",
            color: "blue",
            href: "/erp/customers",
            cta: "Customer"
          },
          {
            step: 3,
            title: "Catat Setiap Order",
            desc: "Buat order baru setiap ada yang beli. Jangan lupa ubah status ke “Selesai” setelah dikirim!",
            example: "Contoh:\n• Bu Siti pesan 2 brownies → total Rp 50.000\n• Dina pesan 1 brownies → total Rp 25.000",
            color: "green",
            href: "/erp/orders",
            cta: "Order"
          },
          {
            step: 4,
            title: "Lihat Laba / Rugi",
            desc: "Semua data otomatis terhitung: pendapatan, pengeluaran, dan laba/rugi.",
            example: "Contoh:\n• Total pendapatan: Rp 75.000\n• Total biaya produksi: Rp 45.000\n• Laba bersih: Rp 30.000 💰",
            color: "purple",
            href: "/erp/profit-loss",
            cta: "Laba & Rugi"
          },
          {
            step: 5,
            title: "Lihat Dashboard Utama",
            desc: "Pantau seluruh aktivitas bisnismu dalam satu halaman: order terbaru, produk laris, pelanggan setia, dan performa keuntungan.",
            example: "Contoh:\n• Order hari ini: 3\n• Produk terlaris: Brownies Coklat\n• Laba minggu ini: Rp 150.000\n• Pelanggan aktif: 12 orang",
            color: "amber",
            href: "/erp/dashboard",
            cta: "Dashboard"
          }
        ].map((step, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 shadow-sm border ${
              step.color === 'pink' ? 'bg-pink-50 border-pink-200' :
              step.color === 'blue' ? 'bg-blue-50 border-blue-200' :
              step.color === 'green' ? 'bg-green-50 border-green-200' :
              step.color === 'purple' ? 'bg-purple-50 border-purple-200' :
              'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                step.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                step.color === 'green' ? 'bg-green-100 text-green-700' :
                step.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                <span className="font-bold text-[11px]">{step.step}</span>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 mb-1">{step.title}</h2>
                <p className="text-slate-600 mb-2">{step.desc}</p>
                <pre className="bg-white p-3 rounded border border-slate-200 text-[11px] text-slate-700 whitespace-pre-wrap mb-2">
                  {step.example}
                </pre>
                <Link
                  href={step.href}
                  className={`inline-flex items-center gap-1 font-medium ${
                    step.color === 'pink' ? 'text-pink-600 hover:text-pink-800' :
                    step.color === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                    step.color === 'green' ? 'text-green-600 hover:text-green-800' :
                    step.color === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                    'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  ➕ Lanjutkan ke {step.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Akhir */}
      <div className="mt-10 text-center">
        <div className="inline-block bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4">
          <h3 className="font-bold text-pink-800 mb-1">Kamu Sudah Siap!</h3>
          <p className="text-pink-700 mb-2">
            Tidak perlu jadi akuntan. Cukup jadi dirimu yang jago bikin produk! 💖
          </p>
          <Link
            href="/erp/products"
            className="inline-block px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-0.5 text-[11px]"
          >
            ✨ Mulai Buat Produkmu Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}