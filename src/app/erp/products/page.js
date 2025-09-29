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
    // Pastikan nilai numerik dikonversi ke number
    const payload = {
      ...data,
      price: Number(data.price) || 0,
      materialCost: Number(data.materialCost) || 0,
      otherCost: Number(data.otherCost) || 0,
      stock: data.stock ? Number(data.stock) : undefined,
    };
    if (!payload.image) delete payload.image;

    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await addProduct(payload);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/60/e2e8f0/8b5cf6?text=No+Image';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">📦 Produk</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 text-left w-12">#</th>
                <th className="p-3 text-left">Gambar</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Harga Jual</th>
                <th className="p-3 text-left">Biaya Bahan</th>
                <th className="p-3 text-left">Biaya Lain-lain</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">Stok</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map((p, index) => (
                  <tr key={p.id} className="hover:bg-pink-50 transition-colors">
                    <td className="p-3 text-slate-500 text-center font-medium">{index + 1}</td>
                    <td className="p-3 w-16">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium text-slate-800">{p.name}</td>
                    <td className="p-3 text-pink-600 font-medium">
                      Rp {Number(p.price || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-700">
                      Rp {Number(p.materialCost || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-700">
                      Rp {Number(p.otherCost || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-700">{p.category || '—'}</td>
                    <td className="p-3">
                      {p.stock !== undefined ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : p.stock < 5
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {p.stock}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setIsModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
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
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">📦</span>
            </div>
            <p>Belum ada produk.</p>
          </div>
        ) : (
          products.map((p, index) => (
            <div key={p.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex gap-3">
                <div className="w-16 flex-shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-lg border flex items-center justify-center text-slate-400 text-xs">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-800 truncate">{p.name}</h3>
                    <span className="text-xs text-slate-500 ml-2">#{index + 1}</span>
                  </div>
                  <p className="text-pink-600 font-medium mt-1">
                    Jual: Rp {Number(p.price || 0).toLocaleString()}
                  </p>
                  <div className="text-sm text-slate-600 space-y-1 mt-1">
                    <div>Biaya Bahan: Rp {Number(p.materialCost || 0).toLocaleString()}</div>
                    <div>Biaya Lain: Rp {Number(p.otherCost || 0).toLocaleString()}</div>
                    <div><span className="font-medium">Kategori:</span> {p.category || '—'}</div>
                    <div>
                      <span className="font-medium">Stok:</span>{' '}
                      {p.stock !== undefined ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : p.stock < 5
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {p.stock}
                        </span>
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setIsModalOpen(true);
                      }}
                      className="text-purple-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-rose-500 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={editing ? 'Edit Produk' : 'Tambah Produk'}
          fields={[
            { name: 'name', label: 'Nama Produk', type: 'text', required: true },
            { name: 'price', label: 'Harga Jual (Rp)', type: 'number', required: true, min: 0 },
            { name: 'materialCost', label: 'Biaya Bahan (Rp)', type: 'number', min: 0 },
            { name: 'otherCost', label: 'Biaya Lain-lain (Rp)', type: 'number', min: 0 },
            { name: 'category', label: 'Kategori', type: 'text' },
            { name: 'stock', label: 'Stok', type: 'number', min: 0 },
            { name: 'image', label: 'URL Gambar (opsional)', type: 'text' },
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