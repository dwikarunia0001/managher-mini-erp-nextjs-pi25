'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

// === Helper CSV ===
const exportToCSV = (orders, products, customers, filename = 'order-managher.csv') => {
  const headers = ['Tanggal Order', 'Produk', 'Pelanggan', 'Qty', 'Total', 'Status', 'Catatan'];
  const rows = orders.map(o => {
    const product = products.find(p => p.id == o.productId);
    const customer = customers.find(c => c.id == o.customerId);
    return [
      `"${o.date}"`,
      `"${(product?.name || '').replace(/"/g, '""')}"`,
      `"${(customer?.name || '').replace(/"/g, '""')}"`,
      o.quantity || 0,
      o.total || 0,
      `"${o.status}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ];
  });

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

const parseCSV = (text, products, customers) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
  const requiredHeaders = ['Tanggal Order', 'Produk', 'Pelanggan', 'Qty', 'Total', 'Status'];
  if (!requiredHeaders.every(h => headers.includes(h))) {
    throw new Error('Format CSV tidak sesuai. Kolom wajib: Tanggal Order, Produk, Pelanggan, Qty, Total, Status');
  }

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(/("(?:[^"]|"")*"|[^,]*),?/g) || [];
    const values = matches.map(val => {
      val = val.trim();
      if (val.endsWith(',')) val = val.slice(0, -1);
      if (val.startsWith('"') && val.endsWith('"')) {
        return val.slice(1, -1).replace(/""/g, '"');
      }
      return val;
    });

    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });

    if (obj['Tanggal Order'] && obj.Produk && obj.Pelanggan) {
      const product = products.find(p => p.name === obj.Produk);
      const customer = customers.find(c => c.name === obj.Pelanggan);
      if (!product) throw new Error(`Produk "${obj.Produk}" tidak ditemukan`);
      if (!customer) throw new Error(`Pelanggan "${obj.Pelanggan}" tidak ditemukan`);

      data.push({
        date: obj['Tanggal Order'],
        productId: product.id,
        customerId: customer.id,
        quantity: Number(obj.Qty) || 1,
        total: Number(obj.Total) || 0,
        status: obj.Status || 'Menunggu',
        notes: obj.Catatan || '',
        shippingDate: ''
      });
    }
  }
  return data;
};

export default function OrdersPage() {
  const { products, customers, orders, fetchProducts, fetchCustomers, addOrder, updateOrder, deleteOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const handleSubmit = (data) => {
    const product = products.find(p => p.id == data.productId);
    const total = product.price * parseInt(data.quantity);

    const payload = {
      ...data,
      total,
      quantity: parseInt(data.quantity),
      date: editingOrder ? editingOrder.date : new Date().toISOString().split('T')[0],
    };

    if (editingOrder) {
      updateOrder(editingOrder.id, payload);
    } else {
      addOrder(payload);
    }

    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const getProductName = (id) => products.find(p => p.id == id)?.name || '—';
  const getCustomerName = (id) => customers.find(c => c.id == id)?.name || '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : '—';

  const statusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800';
      case 'Dikirim': return 'bg-blue-100 text-blue-800';
      case 'Menunggu': return 'bg-orange-100 text-orange-800';
      case 'Dibatalkan': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // === Filter & Sort ===
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => {
      const productName = getProductName(o.productId).toLowerCase();
      const customerName = getCustomerName(o.customerId).toLowerCase();
      const matchesSearch = productName.includes(search.toLowerCase()) || customerName.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sort === 'date') return new Date(b.date) - new Date(a.date);
      if (sort === 'total') return b.total - a.total;
      if (sort === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sort, products, customers]);

  // === Laba per Order ===
  const getProfit = (order) => {
    const product = products.find(p => p.id == order.productId);
    if (!product) return 0;
    const cost = (product.materialCost || 0) + (product.otherCost || 0);
    return order.total - cost * order.quantity;
  };

  // === Import Handler ===
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportPreview([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = parseCSV(event.target.result, products, customers);
        if (data.length === 0) {
          setImportError('Tidak ada data order yang valid ditemukan.');
        } else {
          setImportPreview(data);
        }
      } catch (err) {
        setImportError(err.message || 'Gagal memproses file CSV.');
      }
    };
    reader.onerror = () => setImportError('Gagal membaca file.');
    reader.readAsText(file, 'utf-8');
  };

  const handleImportConfirm = async () => {
    if (importPreview.length === 0) return;
    try {
      for (const item of importPreview) {
        await addOrder(item);
      }
      setIsImportModalOpen(false);
      setImportPreview([]);
    } catch (err) {
      setImportError('Gagal menyimpan data. Coba lagi.');
    }
  };

  if (products.length === 0 || customers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-3 py-4 text-xs">
        <h1 className="text-xl font-bold text-slate-800 mb-4">🛒 Order</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Tambahkan minimal <strong>1 produk</strong> dan <strong>1 customer</strong> terlebih dahulu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[970px] mx-auto px-3 lg:px-4 py-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">🛒 Order</h1>
          <p className="text-slate-600 mt-0.5">Kelola pesanan dan pantau laba per transaksi.</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => exportToCSV(orders, products, customers)}
            className="px-2.5 py-1 text-[11px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm"
          >
            📤 Export CSV
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-2.5 py-1 text-[11px] font-medium rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm"
          >
            📥 Import CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-[11px] font-medium rounded bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow"
          >
            + Buat Order
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari produk atau pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-pink-200 focus:border-pink-500 outline-none text-[11px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-pink-200 focus:border-pink-500 outline-none text-[11px]"
        >
          <option value="all">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-pink-200 focus:border-pink-500 outline-none text-[11px]"
        >
          <option value="date">Sortir: Tanggal Terbaru</option>
          <option value="total">Sortir: Total</option>
          <option value="status">Sortir: Status</option>
        </select>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-2 text-left whitespace-nowrap">Tanggal</th>
                <th className="p-2 text-left whitespace-nowrap">Produk</th>
                <th className="p-2 text-left whitespace-nowrap">Pelanggan</th>
                <th className="p-2 text-left whitespace-nowrap">Qty</th>
                <th className="p-2 text-left whitespace-nowrap">Total</th>
                <th className="p-2 text-left whitespace-nowrap">L/R per Unit</th>
                <th className="p-2 text-left whitespace-nowrap">Status</th>
                <th className="p-2 text-left whitespace-nowrap">Catatan</th>
                <th className="p-2 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1.5">
                      <span className="text-pink-500 text-sm">🛒</span>
                    </div>
                    Tidak ada order yang cocok.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => {
                  const profit = getProfit(o);
                  return (
                    <tr key={o.id} className="hover:bg-pink-50">
                      <td className="p-2 whitespace-nowrap">{formatDate(o.date)}</td>
                      <td className="p-2 font-medium whitespace-nowrap max-w-xs break-words">{getProductName(o.productId)}</td>
                      <td className="p-2 whitespace-nowrap max-w-xs break-words">{getCustomerName(o.customerId)}</td>
                      <td className="p-2 text-center whitespace-nowrap">{o.quantity}</td>
                      <td className="p-2 text-pink-600 font-medium whitespace-nowrap">Rp {o.total.toLocaleString()}</td>
                      <td className={`p-2 font-medium whitespace-nowrap ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rp {Math.abs(profit).toLocaleString()} {profit < 0 && '(Rugi)'}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700 min-w-[120px] max-w-xs break-words text-[11px]">
                        {o.notes || '—'}
                      </td>
                      <td className="p-2 text-center space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingOrder(o);
                            setIsModalOpen(true);
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOrder(o.id)}
                          className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
                        >
                          Batalkan
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card List */}
      <div className="md:hidden space-y-2">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-4 text-center text-slate-500 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1.5">
              <span className="text-pink-500 text-sm">🛒</span>
            </div>
            <p>Tidak ada order yang cocok.</p>
          </div>
        ) : (
          filteredOrders.map((o) => {
            const profit = getProfit(o);
            return (
              <div key={o.id} className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal</span>
                    <span className="text-slate-800">{formatDate(o.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Produk</span>
                    <span className="font-medium">{getProductName(o.productId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pelanggan</span>
                    <span>{getCustomerName(o.customerId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Qty</span>
                    <span>{o.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total</span>
                    <span className="text-pink-600 font-medium">Rp {o.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Laba</span>
                    <span className={profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      Rp {Math.abs(profit).toLocaleString()} {profit < 0 && '(Rugi)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Catatan</span>
                    {o.notes ? (
                      <div className="text-slate-700 text-right text-[11px] max-h-10 overflow-y-auto leading-relaxed break-words">
                        {o.notes}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex justify-end space-x-1">
                  <button
                    onClick={() => {
                      setEditingOrder(o);
                      setIsModalOpen(true);
                    }}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOrder(o.id)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-rose-100 text-rose-700"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={editingOrder ? 'Edit Order' : 'Buat Order Baru'}
          fields={[
            {
              name: 'customerId',
              label: 'Pelanggan',
              type: 'select',
              options: customers.map(c => ({ value: c.id, label: c.name }))
            },
            {
              name: 'productId',
              label: 'Produk',
              type: 'select',
              options: products.map(p => ({ value: p.id, label: `${p.name} - Rp ${p.price.toLocaleString()}` }))
            },
            { name: 'quantity', label: 'Jumlah', type: 'number', min: 1, defaultValue: editingOrder?.quantity ?? 1 },
            { name: 'shippingDate', label: 'Tanggal Pengiriman', type: 'date', defaultValue: editingOrder?.shippingDate ?? '' },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'Menunggu', label: 'Menunggu' },
                { value: 'Dikirim', label: 'Dikirim' },
                { value: 'Selesai', label: 'Selesai' },
                { value: 'Dibatalkan', label: 'Dibatalkan' }
              ],
              defaultValue: editingOrder?.status ?? 'Menunggu'
            },
            { name: 'notes', label: 'Catatan', type: 'text', defaultValue: editingOrder?.notes ?? '' }
          ]}
          initialValues={editingOrder || {}}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingOrder(null);
          }}
        />
      )}

      {/* Modal Import */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-xs">
            <div className="p-4 border-b">
              <h3 className="text-base font-bold text-slate-800">📤 Import Order dari CSV</h3>
              <p className="text-slate-600 mt-0.5">
                Format kolom wajib: <strong>Tanggal Order, Produk, Pelanggan, Qty, Total, Status</strong>
              </p>
            </div>

            <div className="p-4 flex-1 overflow-auto">
              {importError && (
                <div className="mb-2 p-2 bg-rose-50 text-rose-700 rounded text-[11px]">
                  {importError}
                </div>
              )}

              {!importPreview.length && !importError && (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <p className="text-slate-600 mb-2">Pilih file CSV order</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-medium hover:bg-slate-200"
                  >
                    Pilih File CSV
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Contoh format tersedia di <button
                      onClick={() => exportToCSV([], products, customers)}
                      className="text-pink-600 underline"
                    >template kosong</button>
                  </p>
                </div>
              )}

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1.5">
                    Preview ({importPreview.length} order):
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {importPreview.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="text-[11px] p-2 bg-slate-50 rounded">
                        <div>Produk: {getProductName(item.productId)}</div>
                        <div>Pelanggan: {getCustomerName(item.customerId)}</div>
                        <div>Total: Rp {item.total?.toLocaleString()}</div>
                      </div>
                    ))}
                    {importPreview.length > 5 && (
                      <p className="text-[10px] text-slate-500">
                        +{importPreview.length - 5} order lainnya...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreview([]);
                  setImportError('');
                }}
                className="px-2.5 py-1 text-slate-700 font-medium text-[11px]"
              >
                Batal
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={importPreview.length === 0}
                className={`px-2.5 py-1 font-medium rounded ${
                  importPreview.length === 0
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                } text-[11px]`}
              >
                Import {importPreview.length > 0 && `(${importPreview.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}