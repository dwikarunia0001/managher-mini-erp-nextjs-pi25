'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useStore from '@/store/useStore';
import Link from 'next/link';

// Helper: Export ke CSV
const exportToCSV = (data, filename = 'laporan-laba-rugi.csv') => {
  const headers = ['Tanggal', 'Produk', 'Qty', 'Pendapatan', 'Biaya Bahan', 'Biaya Lain', 'Laba'];
  const rows = data.map(item => [
    `"${item.date}"`,
    `"${item.productName}"`,
    item.quantity,
    item.revenue,
    item.materialCost,
    item.otherCost,
    item.profit
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ProfitLossPage() {
  const { products, orders, fetchProducts } = useStore();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [sort, setSort] = useState('date');

  // Ref untuk semua chart
  const chartInstance = useRef(null);
  const productChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // === Data lengkap ===
  const allData = useMemo(() => {
    const data = [];
    for (const order of orders) {
      if (order.status !== 'Selesai') continue;
      const product = products.find(p => p.id == order.productId);
      if (!product) continue;

      const revenue = order.total || 0;
      const materialCost = (product.materialCost || 0) * (order.quantity || 0);
      const otherCost = (product.otherCost || 0) * (order.quantity || 0);
      const profit = revenue - materialCost - otherCost;

      data.push({
        orderId: order.id,
        date: order.date,
        productName: product.name,
        quantity: order.quantity,
        revenue,
        materialCost,
        otherCost,
        profit
      });
    }
    return data;
  }, [orders, products]);

  // === Filter & Sort ===
  const filteredData = useMemo(() => {
    let result = allData.filter(item =>
      item.productName.toLowerCase().includes(search.toLowerCase())
    );

    if (dateFilter.start) {
      result = result.filter(item => item.date >= dateFilter.start);
    }
    if (dateFilter.end) {
      result = result.filter(item => item.date <= dateFilter.end);
    }

    result.sort((a, b) => {
      if (sort === 'revenue') return b.revenue - a.revenue;
      if (sort === 'profit') return b.profit - a.profit;
      return new Date(b.date) - new Date(a.date); // date desc
    });

    return result;
  }, [allData, search, dateFilter, sort]);

  // === Ringkasan ===
  const summary = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const totalMaterial = filteredData.reduce((sum, item) => sum + item.materialCost, 0);
    const totalOther = filteredData.reduce((sum, item) => sum + item.otherCost, 0);
    const totalProfit = filteredData.reduce((sum, item) => sum + item.profit, 0);
    return { totalRevenue, totalMaterial, totalOther, totalProfit };
  }, [filteredData]);

  const isProfit = summary.totalProfit >= 0;

  // === Render All Charts ===
  useEffect(() => {
    if (typeof window === 'undefined' || !filteredData.length) return;

    let script = document.getElementById('chartjs-script');
    if (!script) {
      script = document.createElement('script');
      script.id = 'chartjs-script';
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      document.head.appendChild(script);
    }

    const renderCharts = () => {
      // 1. Laba per Produk
      const productProfitMap = {};
      filteredData.forEach(item => {
        productProfitMap[item.productName] = (productProfitMap[item.productName] || 0) + item.profit;
      });
      const productLabels = Object.keys(productProfitMap);
      const productProfits = Object.values(productProfitMap);
      const productBg = productProfits.map(p => p >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)');

      const ctx2 = document.getElementById('productProfitChart');
      if (ctx2 && window.Chart) {
        if (productChartInstance.current) productChartInstance.current.destroy();
        productChartInstance.current = new window.Chart(ctx2, {
          type: 'bar',
          data: {
            labels: productLabels,
            datasets: [{
              label: 'Total Laba/Rugi per Produk (Rp)',
              data: productProfits,
              backgroundColor: productBg,
              borderColor: productProfits.map(p => p >= 0 ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'),
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `Total: Rp ${Math.abs(context.parsed.x).toLocaleString()} ${context.parsed.x < 0 ? '(Rugi)' : ''}`
                }
              }
            },
            scales: {
              x: {
                ticks: { callback: (value) => `Rp ${Math.abs(value).toLocaleString()}` }
              }
            }
          }
        });
      }

      // 2. Pendapatan vs Biaya
      const ctx3 = document.getElementById('revenueCostChart');
      if (ctx3 && window.Chart) {
        if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
        doughnutChartInstance.current = new window.Chart(ctx3, {
          type: 'doughnut',
          data: {
            labels: ['Pendapatan', 'Biaya Bahan', 'Biaya Lain'],
            datasets: [{
              data: [summary.totalRevenue, summary.totalMaterial, summary.totalOther],
              backgroundColor: [
                'rgba(236, 72, 153, 0.8)', // pink
                'rgba(245, 158, 11, 0.8)', // amber
                'rgba(244, 63, 94, 0.8)'   // rose
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: window.innerWidth < 768 ? 'top' : 'bottom' 
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: Rp ${context.parsed.toLocaleString()}`
                }
              }
            }
          }
        });
      }

      // 3. Tren Laba Harian
      const dailyProfit = {};
      filteredData.forEach(item => {
        dailyProfit[item.date] = (dailyProfit[item.date] || 0) + item.profit;
      });
      const trendDates = Object.keys(dailyProfit).sort();
      const trendValues = trendDates.map(date => dailyProfit[date]);

      const ctx4 = document.getElementById('trendChart');
      if (ctx4 && window.Chart) {
        if (trendChartInstance.current) trendChartInstance.current.destroy();
        trendChartInstance.current = new window.Chart(ctx4, {
          type: 'line',
          data: {
            labels: trendDates,
            datasets: [{
              label: 'Laba Harian (Rp)',
              data: trendValues,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
              fill: true,
              pointRadius: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                ticks: { callback: (value) => `Rp ${value.toLocaleString()}` }
              },
              x: {
                ticks: { 
                  maxRotation: window.innerWidth < 768 ? 90 : 45,
                  minRotation: window.innerWidth < 768 ? 90 : 45
                }
              }
            }
          }
        });
      }
    };

    if (window.Chart) {
      renderCharts();
    } else {
      script.onload = renderCharts;
    }

    return () => {
      [productChartInstance, doughnutChartInstance, trendChartInstance].forEach(ref => {
        if (ref.current) ref.current.destroy();
      });
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [filteredData, summary]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* === 1. Header === */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">📈 Laporan Laba / Rugi</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Analisis keuangan berdasarkan order <strong>“Selesai”</strong>
            </p>
          </div>
          <Link href="/erp/orders" className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 font-medium whitespace-nowrap">
            ← Kembali ke Order
          </Link>
        </div>
      </div>

      {/* === 2. Filter & Pencarian === */}
      <section className="mb-6 sm:mb-8 p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">🔍 Filter & Ekspor Data</h2>
          <button
            onClick={() => exportToCSV(filteredData)}
            disabled={filteredData.length === 0}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            📤 Export ke CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Cari Produk</label>
            <input
              type="text"
              placeholder="Nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Tanggal Berakhir</label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Urutkan Berdasarkan</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            >
              <option value="date">Terbaru</option>
              <option value="revenue">Pendapatan Tertinggi</option>
              <option value="profit">Laba Tertinggi</option>
            </select>
          </div>
        </div>
      </section>

      {/* === 3. Panduan Rumus === */}
      <section className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 text-xs sm:text-sm mb-1.5">ℹ️ Cara Menghitung Laba/Rugi</h3>
        <p className="text-xs sm:text-sm text-blue-700">
          <strong>Rumus:</strong>{' '}
          <code className="font-mono bg-blue-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs">
            Laba/Rugi = Pendapatan – Biaya Bahan – Biaya Lain
          </code>
        </p>
      </section>

      {/* === 4. Ringkasan Keuangan === */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">📊 Ringkasan Keuangan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-600">💰 Pendapatan</p>
            <p className="text-base sm:text-lg font-bold text-pink-600">Rp {summary.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-600">🧺 Biaya Bahan</p>
            <p className="text-base sm:text-lg font-bold text-amber-600">Rp {summary.totalMaterial.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-600">🛠️ Biaya Lain</p>
            <p className="text-base sm:text-lg font-bold text-rose-600">Rp {summary.totalOther.toLocaleString()}</p>
          </div>
          <div className={`p-3 sm:p-4 rounded-xl border shadow-sm ${isProfit ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <p className="text-xs sm:text-sm text-slate-600">{isProfit ? '✅ Laba' : '❌ Rugi'}</p>
            <p className={`text-base sm:text-lg font-bold ${isProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
              Rp {Math.abs(summary.totalProfit).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* === 5. Detail Transaksi === */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6 sm:mb-8">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="font-semibold text-slate-800 text-base sm:text-lg">📋 Detail Transaksi</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {filteredData.length} transaksi ditemukan
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Hanya menampilkan order dengan status <strong>“Selesai”</strong>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 sm:p-4 text-left whitespace-nowrap">Tanggal</th>
                <th className="p-3 sm:p-4 text-left">Produk</th>
                <th className="p-3 sm:p-4 text-left">Qty</th>
                <th className="p-3 sm:p-4 text-left">Pendapatan</th>
                <th className="p-3 sm:p-4 text-left">Biaya Bahan</th>
                <th className="p-3 sm:p-4 text-left">Biaya Lain</th>
                <th className="p-3 sm:p-4 text-left">Laba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 sm:p-12 text-center text-slate-500 text-xs sm:text-sm">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="p-3 sm:p-4 whitespace-nowrap">{item.date}</td>
                    <td className="p-3 sm:p-4 font-medium">{item.productName}</td>
                    <td className="p-3 sm:p-4 text-center">{item.quantity}</td>
                    <td className="p-3 sm:p-4 text-pink-600 font-medium">Rp {item.revenue.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-amber-600">Rp {item.materialCost.toLocaleString()}</td>
                    <td className="p-3 sm:p-4 text-rose-600">Rp {item.otherCost.toLocaleString()}</td>
                    <td className={`p-3 sm:p-4 font-medium ${item.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Rp {Math.abs(item.profit).toLocaleString()} {item.profit < 0 && '(Rugi)'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* === 6. Visualisasi Data === */}
      {filteredData.length > 0 && (
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">📈 Visualisasi Data</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Produk Paling Untung / Rugi */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs sm:text-sm mb-2">Produk Paling Untung / Rugi</h3>
              <div className="h-48 sm:h-56">
                <canvas id="productProfitChart"></canvas>
              </div>
            </div>

            {/* Pendapatan vs Biaya */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs sm:text-sm mb-2">Pendapatan vs Biaya</h3>
              <div className="h-48 sm:h-56">
                <canvas id="revenueCostChart"></canvas>
              </div>
            </div>

            {/* Tren Laba Harian */}
            <div className="lg:col-span-2 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs sm:text-sm mb-2">Tren Laba Harian</h3>
              <div className="h-40 sm:h-48">
                <canvas id="trendChart"></canvas>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}