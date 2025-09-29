'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">✨ Panduan Memulai</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Ikuti 4 langkah sederhana ini untuk mulai kelola bisnismu dengan ManagHer Mini ERP.
        </p>
      </div>

      {/* Studi Kasus */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 mb-12 text-center">
        <p className="text-pink-700 italic text-lg max-w-2xl mx-auto">
          “Aku bisa bikin brownies enak banget, tapi gak tahu cara catat untung-ruginya. Takut rugi, tapi pengin coba jualan.”
        </p>
        <p className="font-medium mt-2 text-slate-800">— Ibu Rina, Bandung</p>
      </div>

      {/* Langkah-Langkah */}
      <div className="space-y-8">
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
            title: "Lihat Laba Bersih di Dashboard",
            desc: "Semua data otomatis terhitung: pendapatan, pengeluaran, dan laba/rugi.",
            example: "Contoh:\n• Total pendapatan: Rp 75.000\n• Total biaya produksi: Rp 45.000\n• Laba bersih: Rp 30.000 💰",
            color: "purple",
            href: "/erp/dashboard",
            cta: "Laba & Rugi"
          }
        ].map((step, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`w-12 h-12 rounded-full bg-${step.color}-100 text-${step.color}-700 flex items-center justify-center font-bold text-lg flex-shrink-0`}>
              {step.step}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h2>
              <p className="text-slate-600 mb-4">{step.desc}</p>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap mb-4 border border-slate-200">
                {step.example}
              </pre>
                <Link
                  href={step.href}
                  className={`inline-flex items-center gap-1 text-${step.color}-600 hover:text-${step.color}-800 font-medium`}
                >
                  ➕ Lanjutkan ke {step.cta}
                </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Akhir */}
      <div className="mt-16 text-center">
        <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">Kamu Sudah Siap!</h3>
          <p className="text-emerald-700 mb-4">
            Tidak perlu jadi akuntan. Cukup jadi dirimu yang jago bikin produk! 💖
          </p>
          <Link
            href="/erp/dashboard"
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:opacity-90"
          >
            📊 Lihat Dashboard Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}