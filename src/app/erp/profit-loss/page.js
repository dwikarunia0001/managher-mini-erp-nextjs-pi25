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

  // Ref untuk chart
  const productChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const trendChartRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const allData = useMemo(() => {
    return orders
      .filter(order => order.status === 'Selesai')
      .map(order => {
        const product = products.find(p => p.id == order.productId);
        if (!product) return null;

        const revenue = order.total || 0;
        const materialCost = (product.materialCost || 0) * (order.quantity || 0);
        const otherCost = (product.otherCost || 0) * (order.quantity || 0);
        const profit = revenue - materialCost - otherCost;

        return {
          orderId: order.id,
          date: order.date,
          productName: product.name,
          quantity: order.quantity,
          revenue,
          materialCost,
          otherCost,
          profit
        };
      })
      .filter(Boolean);
  }, [orders, products]);

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
      return new Date(b.date) - new Date(a.date);
    });

    return result;
  }, [allData, search, dateFilter, sort]);

  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.totalRevenue += item.revenue;
        acc.totalMaterial += item.materialCost;
        acc.totalOther += item.otherCost;
        acc.totalProfit += item.profit;
        return acc;
      },
      { totalRevenue: 0, totalMaterial: 0, totalOther: 0, totalProfit: 0 }
    );
  }, [filteredData]);

  const isProfit = summary.totalProfit >= 0;

  // Render Chart.js
  useEffect(() => {
    if (typeof window === 'undefined' || !filteredData.length) return;

    let Chart;
    const loadChart = async () => {
      // Dinamis import Chart.js
      const chartModule = await import('chart.js/auto');
      Chart = chartModule.Chart;

      // Hancurkan chart lama
      if (productChartRef.current) productChartRef.current.destroy();
      if (doughnutChartRef.current) doughnutChartRef.current.destroy();
      if (trendChartRef.current) trendChartRef.current.destroy();

      // 1. Laba per Produk
      const productProfitMap = {};
      filteredData.forEach(item => {
        productProfitMap[item.productName] = (productProfitMap[item.productName] || 0) + item.profit;
      });
      const productLabels = Object.keys(productProfitMap);
      const productProfits = Object.values(productProfitMap);

      const ctx1 = document.getElementById('productProfitChart');
      if (ctx1) {
        productChartRef.current = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: productLabels,
            datasets: [{
              label: 'Laba/Rugi per Produk (Rp)',
              data: productProfits,
              backgroundColor: productProfits.map(p => p >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)'),
              borderColor: productProfits.map(p => p >= 0 ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'),
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { callback: (value) => `Rp${Math.abs(value).toLocaleString()}` }
              }
            }
          }
        });
      }

      // 2. Pendapatan vs Biaya
      const ctx2 = document.getElementById('revenueCostChart');
      if (ctx2) {
        doughnutChartRef.current = new Chart(ctx2, {
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
              legend: { position: 'top' },
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

      const ctx3 = document.getElementById('trendChart');
      if (ctx3) {
        trendChartRef.current = new Chart(ctx3, {
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
            plugins: { legend: { display: false } },
            scales: {
              y: {
                ticks: { callback: (value) => `Rp${value.toLocaleString()}` }
              },
              x: {
                ticks: { 
                  maxRotation: 45,
                  minRotation: 45,
                  autoSkip: true,
                  maxTicksLimit: 5
                }
              }
            }
          }
        });
      }
    };

    loadChart();

    // Cleanup
    return () => {
      if (productChartRef.current) productChartRef.current.destroy();
      if (doughnutChartRef.current) doughnutChartRef.current.destroy();
      if (trendChartRef.current) trendChartRef.current.destroy();
    };
  }, [filteredData, summary]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">📈 Laporan Laba / Rugi</h1>
            <p className="text-slate-600 text-xs mt-1">
              Analisis keuangan berdasarkan order <strong>“Selesai”</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Panduan Rumus */}
      <section className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 text-sm mb-1">ℹ️ Cara Menghitung Laba/Rugi</h3>
        <p className="text-sm text-blue-700">
          <strong>Rumus:</strong>{' '}
          <code className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
            Laba/Rugi = Pendapatan – Biaya Bahan – Biaya Lain
          </code>
        </p>
      </section>

      {/* Ringkasan Keuangan */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">📊 Ringkasan Keuangan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600">💰 Pendapatan</p>
            <p className="text-base font-bold text-pink-600">Rp {summary.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600">🧺 Biaya Bahan</p>
            <p className="text-base font-bold text-amber-600">Rp {summary.totalMaterial.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600">🛠️ Biaya Lain</p>
            <p className="text-base font-bold text-rose-600">Rp {summary.totalOther.toLocaleString()}</p>
          </div>
          <div className={`p-4 rounded-xl border shadow-sm ${isProfit ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <p className="text-xs text-slate-600">{isProfit ? '✅ Laba' : '❌ Rugi'}</p>
            <p className={`text-base font-bold ${isProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
              Rp {Math.abs(summary.totalProfit).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-800">🔍 Filter & Ekspor Data</h2>
          <button
            onClick={() => exportToCSV(filteredData)}
            disabled={filteredData.length === 0}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            📤 Export ke CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cari Produk</label>
            <input
              type="text"
              placeholder="Nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal Berakhir</label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Urutkan Berdasarkan</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
            >
              <option value="date">Terbaru</option>
              <option value="revenue">Pendapatan Tertinggi</option>
              <option value="profit">Laba Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Detail Transaksi — Switch Layout */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="font-semibold text-slate-800 text-sm">📋 Detail Transaksi</h2>
              <p className="text-xs text-slate-600">{filteredData.length} transaksi ditemukan</p>
            </div>
          </div>

          {/* TABEL (Desktop) */}
          <div className="hidden sm:block overflow-auto max-h-[60vh]">
            <table className="min-w-full table-auto text-xs">
              <thead className="bg-pink-50 text-pink-700 sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left whitespace-nowrap">Tanggal</th>
                  <th className="p-2 text-left whitespace-nowrap">Produk</th>
                  <th className="p-2 text-left whitespace-nowrap">Qty</th>
                  <th className="p-2 text-left whitespace-nowrap">Pendapatan</th>
                  <th className="p-2 text-left whitespace-nowrap">Biaya Bahan</th>
                  <th className="p-2 text-left whitespace-nowrap">Biaya Lain</th>
                  <th className="p-2 text-left whitespace-nowrap">Laba</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className="p-2 whitespace-nowrap">{item.date}</td>
                      <td className="p-2 font-medium truncate max-w-[150px]" title={item.productName}>
                        {item.productName}
                      </td>
                      <td className="p-2 text-center whitespace-nowrap">{item.quantity}</td>
                      <td className="p-2 text-pink-600 font-medium whitespace-nowrap">Rp {item.revenue.toLocaleString()}</td>
                      <td className="p-2 text-amber-600 whitespace-nowrap">Rp {item.materialCost.toLocaleString()}</td>
                      <td className="p-2 text-rose-600 whitespace-nowrap">Rp {item.otherCost.toLocaleString()}</td>
                      <td className={`p-2 font-medium whitespace-nowrap ${item.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rp {Math.abs(item.profit).toLocaleString()} {item.profit < 0 && '(Rugi)'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARD (Mobile) */}
          <div className="block sm:hidden overflow-y-auto max-h-[60vh] space-y-3 p-3">
            {filteredData.length === 0 ? (
              <div className="text-center text-slate-500 py-6">
                Tidak ada data.
              </div>
            ) : (
              filteredData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">📅 Tanggal</span>
                      <span className="font-medium text-slate-800">{item.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">📦 Produk</span>
                      <span className="font-medium text-slate-800 truncate" title={item.productName}>
                        {item.productName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">🔢 Qty</span>
                      <span className="font-medium text-slate-800 text-center">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">💰 Pendapatan</span>
                      <span className="font-medium text-pink-600">Rp {item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">🧺 Biaya Bahan</span>
                      <span className="font-medium text-amber-600">Rp {item.materialCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">🛠️ Biaya Lain</span>
                      <span className="font-medium text-rose-600">Rp {item.otherCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">📈 Laba</span>
                      <span className={`font-medium ${item.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rp {Math.abs(item.profit).toLocaleString()} {item.profit < 0 && '(Rugi)'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Visualisasi Data */}
      {filteredData.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">📈 Visualisasi Data</h2>
          <div className="space-y-4">
            {/* Grafik 1: Produk Paling Untung / Rugi */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs mb-2">Produk Paling Untung / Rugi</h3>
              <div className="w-full aspect-video max-h-[30vh] bg-gray-50 rounded">
                <canvas id="productProfitChart"></canvas>
              </div>
            </div>

            {/* Grafik 2: Pendapatan vs Biaya */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs mb-2">Pendapatan vs Biaya</h3>
              <div className="w-full aspect-video max-h-[30vh] bg-gray-50 rounded">
                <canvas id="revenueCostChart"></canvas>
              </div>
            </div>

            {/* Grafik 3: Tren Laba Harian */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-700 text-xs mb-2">Tren Laba Harian</h3>
              <div className="w-full aspect-video max-h-[30vh] bg-gray-50 rounded">
                <canvas id="trendChart"></canvas>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}