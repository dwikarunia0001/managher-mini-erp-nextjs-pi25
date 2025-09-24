'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

export default function OrdersPage() {
  const { products, customers, orders, fetchProducts, fetchCustomers, addOrder, deleteOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const handleSubmit = (data) => {
    addOrder(data);
    setIsModalOpen(false);
  };

  if (products.length === 0 || customers.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">🛒 Order</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Tambahkan minimal 1 produk dan 1 customer terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">🛒 Order</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          + Buat Order
        </button>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-slate-500">Belum ada order.</p>
        ) : (
          orders.map((o) => {
            const customer = customers.find(c => c.id == o.customerId)?.name || '—';
            const product = products.find(p => p.id == o.productId)?.name || '—';
            return (
              <div key={o.id} className="bg-white p-4 rounded-xl border">
                <div className="flex justify-between">
                  <div>
                    <div><strong>{customer}</strong> membeli <strong>{product}</strong></div>
                    <div className="text-sm text-slate-600">
                      {o.quantity} x | Total: Rp {o.total.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteOrder(o.id)}
                    className="text-red-600 text-sm"
                  >
                    Batalkan
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-2">{o.date}</div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="Buat Order Baru"
          fields={[
            {
              name: 'customerId',
              label: 'Customer',
              type: 'select',
              options: customers.map(c => ({ value: c.id, label: c.name }))
            },
            {
              name: 'productId',
              label: 'Produk',
              type: 'select',
              options: products.map(p => ({ value: p.id, label: `${p.name} - Rp ${p.price.toLocaleString()}` }))
            },
            { name: 'quantity', label: 'Jumlah', type: 'number', min: 1, defaultValue: 1 }
          ]}
          initialValues={{}}
          onSubmit={(data) => {
            const product = products.find(p => p.id == data.productId);
            const total = product.price * parseInt(data.quantity);
            handleSubmit({ ...data, total, quantity: parseInt(data.quantity) });
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}