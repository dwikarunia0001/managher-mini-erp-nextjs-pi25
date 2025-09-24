'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

export default function ProductsPage() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await updateProduct(editing.id, data);
    } else {
      await addProduct(data);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📦 Produk</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          + Tambah
        </button>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-slate-500">Belum ada produk.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <strong>{p.name}</strong><br />
                <span className="text-pink-600">Rp {Number(p.price).toLocaleString()}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditing(p);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <Modal
          title={editing ? 'Edit Produk' : 'Tambah Produk'}
          fields={[
            { name: 'name', label: 'Nama Produk', type: 'text', required: true },
            { name: 'price', label: 'Harga (Rp)', type: 'number', required: true },
          ]}
          initialValues={editing || {}}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}