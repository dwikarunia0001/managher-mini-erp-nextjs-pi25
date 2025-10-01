'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

// === Helper CSV ===
const exportToCSV = (customers, filename = 'customer-managher.csv') => {
  const headers = ['Nama', 'Nomor Telepon / WA'];
  const rows = customers.map(c => [
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.contact || '').replace(/"/g, '""')}"`
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

const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
  const requiredHeaders = ['Nama'];
  if (!requiredHeaders.every(h => headers.includes(h))) {
    throw new Error('Format CSV tidak sesuai. Kolom wajib: Nama');
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

    if (obj.Nama) {
      data.push({
        name: obj.Nama,
        contact: obj['Nomor Telepon / WA'] || ''
      });
    }
  }
  return data;
};

export default function CustomersPage() {
  const { customers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateCustomer(editing.id, data);
      } else {
        await addCustomer(data);
      }
      setIsModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Gagal menyimpan customer:', err);
    }
  };

  // === Filter & Sort ===
  const filteredCustomers = useMemo(() => {
    let result = customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.contact && c.contact.includes(search))
    );

    result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'contact') return (a.contact || '').localeCompare(b.contact || '');
      return 0;
    });

    return result;
  }, [customers, search, sort]);

  // === Import Handler ===
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportPreview([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = parseCSV(event.target.result);
        if (data.length === 0) {
          setImportError('Tidak ada data customer yang valid ditemukan.');
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
        await addCustomer(item);
      }
      setIsImportModalOpen(false);
      setImportPreview([]);
      fetchCustomers();
    } catch (err) {
      setImportError('Gagal menyimpan data. Coba lagi.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-4 py-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">👩 Customer</h1>
          <p className="text-slate-600 mt-0.5">Kelola data pelangganmu dalam satu tempat.</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => exportToCSV(customers)}
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
            + Tambah Customer
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari nama atau nomor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-pink-200 focus:border-pink-500 outline-none text-[11px]"
        />
        <div></div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-pink-200 focus:border-pink-500 outline-none text-[11px]"
        >
          <option value="name">Sortir: Nama</option>
          <option value="contact">Sortir: Nomor Telepon</option>
        </select>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-2 text-left w-8">#</th>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">Nomor Telepon / WA</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1.5">
                      <span className="text-pink-500 text-sm">👩</span>
                    </div>
                    Tidak ada customer yang cocok.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, index) => (
                  <tr key={c.id} className="hover:bg-pink-50">
                    <td className="p-2 text-slate-500 text-center font-medium whitespace-nowrap">{index + 1}</td>
                    <td className="p-2 font-medium text-slate-800 max-w-xs break-words">{c.name}</td>
                    <td className="p-2 text-slate-700 whitespace-nowrap">
                      {c.contact ? <span className="font-mono text-[11px]">{c.contact}</span> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-2 text-center space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditing(c);
                          setIsModalOpen(true);
                        }}
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.id)}
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
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
      <div className="md:hidden space-y-2">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg p-4 text-center text-slate-500 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1.5">
              <span className="text-pink-500 text-sm">👩</span>
            </div>
            <p>Tidak ada customer yang cocok.</p>
          </div>
        ) : (
          filteredCustomers.map((c, index) => (
            <div key={c.id} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-800 truncate text-[11px]">{c.name}</h3>
                  <p className="text-slate-600 mt-0.5">
                    {c.contact ? (
                      <span className="font-mono text-[11px]">{c.contact}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 ml-1.5">#{index + 1}</span>
              </div>
              <div className="mt-2 flex justify-end space-x-1">
                <button
                  onClick={() => {
                    setEditing(c);
                    setIsModalOpen(true);
                  }}
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(c.id)}
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-rose-100 text-rose-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <Modal
          title={editing ? 'Edit Customer' : 'Tambah Customer Baru'}
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

      {/* Modal Import */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-xs">
            <div className="p-4 border-b">
              <h3 className="text-base font-bold text-slate-800">📤 Import Customer dari CSV</h3>
              <p className="text-slate-600 mt-0.5">
                Format kolom wajib: <strong>Nama</strong>
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
                  <p className="text-slate-600 mb-2">Pilih file CSV customer</p>
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
                    Contoh format: <button
                      onClick={() => exportToCSV([])}
                      className="text-pink-600 underline"
                    >template kosong</button>
                  </p>
                </div>
              )}

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1.5">
                    Preview ({importPreview.length} customer):
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {importPreview.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="text-[11px] p-2 bg-slate-50 rounded">
                        <div><span className="font-medium">Nama:</span> {item.name}</div>
                        {item.contact && <div>WA: {item.contact}</div>}
                      </div>
                    ))}
                    {importPreview.length > 5 && (
                      <p className="text-[10px] text-slate-500">
                        +{importPreview.length - 5} customer lainnya...
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