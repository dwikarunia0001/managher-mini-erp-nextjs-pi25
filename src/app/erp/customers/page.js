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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">👩 Customer</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          + Tambah
        </button>
      </div>

      <div className="space-y-3">
        {customers.length === 0 ? (
          <p className="text-slate-500">Belum ada customer.</p>
        ) : (
          customers.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <strong>{c.name}</strong><br />
                <span className="text-slate-600">{c.contact || '-'}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditing(c);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(c.id)}
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
          title={editing ? 'Edit Customer' : 'Tambah Customer'}
          fields={[
            { name: 'name', label: 'Nama', type: 'text', required: true },
            { name: 'contact', label: 'Email / WA', type: 'text' },
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