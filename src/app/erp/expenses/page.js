'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

export default function ExpensesPage() {
  const { products, expenses, fetchProducts, addExpense, updateExpense, deleteExpense } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (data) => {
    const quantity = parseInt(data.quantity) || 1;
    const unitPrice = parseFloat(data.unitPrice) || 0;
    const total = quantity * unitPrice;

    const payload = {
      ...data,
      quantity,
      unitPrice,
      total,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, payload);
    } else {
      addExpense(payload);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const getProductName = (id) => products.find(p => p.id == id)?.name || '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID') : '—';

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">📥 Pengeluaran</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          + Tambah Pengeluaran
        </button>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Tanggal</th>
                <th className="p-3 text-left whitespace-nowrap">Deskripsi</th>
                <th className="p-3 text-left whitespace-nowrap">Untuk Produk</th>
                <th className="p-3 text-left whitespace-nowrap">Kategori</th>
                <th className="p-3 text-left whitespace-nowrap">Qty</th>
                <th className="p-3 text-left whitespace-nowrap">Harga Satuan</th>
                <th className="p-3 text-left whitespace-nowrap">Total</th>
                <th className="p-3 text-left whitespace-nowrap">Metode</th>
                <th className="p-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    Belum ada pengeluaran.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-pink-50">
                    <td className="p-3 whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="p-3 font-medium whitespace-nowrap">{e.description}</td>
                    <td className="p-3 whitespace-nowrap">{e.productId ? getProductName(e.productId) : '—'}</td>
                    <td className="p-3 whitespace-nowrap">{e.category || '—'}</td>
                    <td className="p-3 text-center whitespace-nowrap">{e.quantity || 1}</td>
                    <td className="p-3 whitespace-nowrap">Rp {e.unitPrice?.toLocaleString() || '0'}</td>
                    <td className="p-3 text-pink-600 font-medium whitespace-nowrap">Rp {e.total?.toLocaleString() || '0'}</td>
                    <td className="p-3 whitespace-nowrap">{e.paymentMethod || '—'}</td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingExpense(e);
                          setIsModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="text-rose-500 hover:text-rose-700 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card List */}
      <div className="md:hidden space-y-4">
        {expenses.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">📥</span>
            </div>
            <p>Belum ada pengeluaran.</p>
          </div>
        ) : (
          expenses.map((e) => (
            <div key={e.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Tanggal</span>
                  <span className="text-slate-800">{formatDate(e.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Deskripsi</span>
                  <span className="font-medium">{e.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Untuk Produk</span>
                  <span>{e.productId ? getProductName(e.productId) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Kategori</span>
                  <span>{e.category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Qty</span>
                  <span>{e.quantity || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Harga Satuan</span>
                  <span>Rp {e.unitPrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Total</span>
                  <span className="text-pink-600 font-medium">Rp {e.total?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Metode</span>
                  <span>{e.paymentMethod || '—'}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingExpense(e);
                    setIsModalOpen(true);
                  }}
                  className="text-purple-600 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(e.id)}
                  className="text-rose-500 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Pengeluaran */}
      <div className="mt-6 text-right">
        <div className="inline-block bg-pink-50 px-4 py-2 rounded-lg">
          <span className="text-pink-700 font-medium">Total Pengeluaran: </span>
          <span className="text-pink-900 font-bold">Rp {totalExpenses.toLocaleString()}</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
          fields={[
            { name: 'date', label: 'Tanggal', type: 'date', required: true, defaultValue: editingExpense?.date ?? new Date().toISOString().split('T')[0] },
            { name: 'description', label: 'Deskripsi', type: 'text', required: true, defaultValue: editingExpense?.description ?? '' },
            {
              name: 'productId',
              label: 'Untuk Produk (opsional)',
              type: 'select',
              options: [
                { value: '', label: '– Tidak terkait produk –' },
                ...products.map(p => ({ value: p.id, label: p.name }))
              ],
              defaultValue: editingExpense?.productId ?? ''
            },
            {
              name: 'category',
              label: 'Kategori',
              type: 'select',
              options: [
                { value: 'Bahan Baku', label: 'Bahan Baku' },
                { value: 'Pemasaran', label: 'Pemasaran' },
                { value: 'Operasional', label: 'Operasional' },
                { value: 'Pengiriman', label: 'Pengiriman' },
                { value: 'Software', label: 'Software' },
                { value: 'Lainnya', label: 'Lainnya' }
              ],
              defaultValue: editingExpense?.category ?? 'Operasional'
            },
            { name: 'quantity', label: 'Qty', type: 'number', min: 1, required: true, defaultValue: editingExpense?.quantity ?? 1 },
            { name: 'unitPrice', label: 'Harga Satuan (Rp)', type: 'number', min: 0, required: true, defaultValue: editingExpense?.unitPrice ?? '' },
            {
              name: 'paymentMethod',
              label: 'Metode Pembayaran',
              type: 'select',
              options: [
                { value: 'Tunai', label: 'Tunai' },
                { value: 'Transfer', label: 'Transfer' },
                { value: 'GOPAY', label: 'GOPAY' },
                { value: 'OVO', label: 'OVO' },
                { value: 'DANA', label: 'DANA' },
                { value: 'Lainnya', label: 'Lainnya' }
              ],
              defaultValue: editingExpense?.paymentMethod ?? 'Tunai'
            }
          ]}
          initialValues={editingExpense || {}}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}