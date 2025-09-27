'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

export default function CustomersPage() {
  const { customers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await updateCustomer(editing.id, data);
    } else {
      await addCustomer(data);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">👩 Customer</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          + Tambah Customer
        </button>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-3 text-left w-12">#</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Nomor Telepon</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-500 text-lg">👩</span>
                      </div>
                      <p className="mt-2">Belum ada customer.</p>
                      <p className="text-xs text-slate-400">Mulai tambahkan customer pertamamu!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c, index) => (
                  <tr key={c.id} className="hover:bg-pink-50 transition-colors">
                    <td className="p-3 text-slate-500 text-center font-medium">{index + 1}</td>
                    <td className="p-3 font-medium text-slate-800">{c.name}</td>
                    <td className="p-3 text-slate-700">{c.contact || <span className="text-slate-400">—</span>}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditing(c);
                          setIsModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.id)}
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
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">👩</span>
            </div>
            <p>Belum ada customer.</p>
          </div>
        ) : (
          customers.map((c, index) => (
            <div key={c.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-800 truncate">{c.name}</h3>
                  <p className="text-slate-600 mt-1">
                    {c.contact ? (
                      <span className="font-mono">{c.contact}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-slate-500 ml-2">#{index + 1}</span>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditing(c);
                    setIsModalOpen(true);
                  }}
                  className="text-purple-600 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(c.id)}
                  className="text-rose-500 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={editing ? 'Edit Customer' : 'Tambah Customer'}
          fields={[
            { name: 'name', label: 'Nama', type: 'text', required: true },
            { name: 'contact', label: 'Nomor Telepon / WA', type: 'text' },
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