'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

export default function OrdersPage() {
  const { products, customers, orders, fetchProducts, fetchCustomers, addOrder, updateOrder, deleteOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

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

  if (products.length === 0 || customers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">🛒 Order</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">
            Tambahkan minimal <strong>1 produk</strong> dan <strong>1 customer</strong> terlebih dahulu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[970px] px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">🛒 Order</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          + Buat Order
        </button>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Tanggal Order</th>
                <th className="p-3 text-left whitespace-nowrap">Produk</th>
                <th className="p-3 text-left whitespace-nowrap">Pelanggan</th>
                <th className="p-3 text-left whitespace-nowrap">Qty</th>
                <th className="p-3 text-left whitespace-nowrap">Total</th>
                <th className="p-3 text-left whitespace-nowrap">Tgl Kirim</th>
                <th className="p-3 text-left whitespace-nowrap">Status</th>
                <th className="p-3 text-left whitespace-normal min-w-[150px] max-w-xs">Catatan</th>
                <th className="p-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="p-3 whitespace-nowrap">{formatDate(o.date)}</td>
                  <td className="p-3 font-medium whitespace-nowrap">{getProductName(o.productId)}</td>
                  <td className="p-3 whitespace-nowrap">{getCustomerName(o.customerId)}</td>
                  <td className="p-3 text-center whitespace-nowrap">{o.quantity}</td>
                  <td className="p-3 text-pink-600 font-medium whitespace-nowrap">Rp {o.total.toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(o.shippingDate)}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 min-w-[150px] max-w-xs break-words">
                    {o.notes || '—'}
                  </td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingOrder(o);
                        setIsModalOpen(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOrder(o.id)}
                      className="text-rose-500 hover:text-rose-700 text-sm font-medium"
                    >
                      Batalkan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card List — sudah responsif, tidak perlu diubah */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">🛒</span>
            </div>
            <p>Belum ada order.</p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Tanggal Order</span>
                  <span className="text-slate-800">{formatDate(o.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Produk</span>
                  <span className="font-medium">{getProductName(o.productId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Pelanggan</span>
                  <span>{getCustomerName(o.customerId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Qty</span>
                  <span>{o.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Total</span>
                  <span className="text-pink-600 font-medium">Rp {o.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Tgl Kirim</span>
                  <span>{formatDate(o.shippingDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Catatan</span>
                  {o.notes ? (
                    <div className="text-slate-700 text-right text-sm max-h-12 overflow-y-auto leading-relaxed break-words">
                      {o.notes}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingOrder(o);
                    setIsModalOpen(true);
                  }}
                  className="text-purple-600 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOrder(o.id)}
                  className="text-rose-500 text-sm font-medium"
                >
                  Batalkan
                </button>
              </div>
            </div>
          ))
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
    </div>
  );
}