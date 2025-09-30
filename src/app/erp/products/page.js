'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import useStore from '@/store/useStore';
import Modal from '@/components/Modal';

// Helper: Export ke CSV
const exportToCSV = (products, filename = 'produk-managher.csv') => {
  const headers = ['Nama', 'Harga Jual', 'Biaya Bahan', 'Biaya Lain-lain', 'Kategori', 'Stok', 'URL Gambar'];
  const rows = products.map(p => [
    `"${(p.name || '').replace(/"/g, '""')}"`,
    p.price || 0,
    p.materialCost || 0,
    p.otherCost || 0,
    `"${(p.category || '').replace(/"/g, '""')}"`,
    p.stock !== undefined ? p.stock : '',
    `"${(p.image || '').replace(/"/g, '""')}"`
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

// Helper: Parse CSV
const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(',')
    .map(h => h.trim().replace(/^"(.*)"$/, '$1'));

  const requiredHeaders = ['Nama', 'Harga Jual', 'Biaya Bahan', 'Biaya Lain-lain'];
  if (!requiredHeaders.every(h => headers.includes(h))) {
    throw new Error('Format CSV tidak sesuai. Kolom wajib: Nama, Harga Jual, Biaya Bahan, Biaya Lain-lain');
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
      let val = values[idx] || '';
      if (['Harga Jual', 'Biaya Bahan', 'Biaya Lain-lain', 'Stok'].includes(header)) {
        val = val === '' ? undefined : Number(val);
        if (isNaN(val)) val = undefined;
      }
      obj[header] = val;
    });

    if (obj.Nama) {
      data.push({
        name: obj.Nama,
        price: obj['Harga Jual'] || 0,
        materialCost: obj['Biaya Bahan'] || 0,
        otherCost: obj['Biaya Lain-lain'] || 0,
        category: obj.Kategori || '',
        stock: obj.Stok,
        image: obj['URL Gambar'] || ''
      });
    }
  }
  return data;
};

export default function ProductsPage() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (data) => {
    let imageUrl = '';

    if (data.image instanceof File) {
      if (data.image.size > 200 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 200 KB.');
        return;
      }
      const compressedFile = await compressImage(data.image, 800, 0.8);
      imageUrl = await fileToBase64(compressedFile);
    } else if (editing && !data.image) {
      imageUrl = editing.image || '';
    } else {
      imageUrl = data.image || '';
    }

    const payload = {
      ...data,
      image: imageUrl,
      price: Number(data.price) || 0,
      materialCost: Number(data.materialCost) || 0,
      otherCost: Number(data.otherCost) || 0,
      stock: data.stock !== '' ? Number(data.stock) : undefined,
    };

    try {
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      alert('Gagal menyimpan produk. Coba gambar lebih kecil.');
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/60/e2e8f0/8b5cf6?text=No+Image';
  };

  function compressImage(file, maxWidth, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'all' || p.category === categoryFilter)
    );

    result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'price') return a.price - b.price;
      if (sort === 'stock') return (a.stock || 0) - (b.stock || 0);
      return 0;
    });

    return result;
  }, [products, search, categoryFilter, sort]);

  const getStockBadge = (stock) => {
    if (stock === undefined) return <span className="text-slate-400">—</span>;
    if (stock === 0) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Habis</span>;
    if (stock <= 5) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{stock}</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{stock}</span>;
  };

  const getProfitPerUnit = (p) => {
    const cost = (p.materialCost || 0) + (p.otherCost || 0);
    return (p.price || 0) - cost;
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
        const data = parseCSV(event.target.result);
        if (data.length === 0) {
          setImportError('Tidak ada data produk yang valid ditemukan.');
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
        await addProduct(item);
      }
      setIsImportModalOpen(false);
      setImportPreview([]);
      fetchProducts();
    } catch (err) {
      setImportError('Gagal menyimpan data. Coba lagi.');
    }
  };

  return (
    <div className="max-w-[970px] mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📦 Produk</h1>
          <p className="text-slate-600 text-sm mt-1">Kelola produk & pantau laba per unit.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(products)}
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm"
          >
            📤 Export CSV
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm"
          >
            📥 Import CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow"
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Semua Kategori' : cat}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none"
        >
          <option value="name">Sortir: Nama</option>
          <option value="price">Sortir: Harga Jual</option>
          <option value="stock">Sortir: Stok</option>
        </select>
      </div>

      {/* Desktop: Tabel */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-pink-50 text-pink-700">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Gambar</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left whitespace-nowrap">Harga Jual</th>
                <th className="p-4 text-left whitespace-nowrap">Biaya Bahan</th>
                <th className="p-4 text-left whitespace-nowrap">Biaya Lain-lain</th>
                <th className="p-4 text-left">L/R per Unit</th>
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-left">Stok</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-12 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-pink-500 text-lg">📦</span>
                    </div>
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, index) => {
                  const profit = getProfitPerUnit(p);
                  return (
                    <tr key={p.id} className="hover:bg-pink-50">
                      <td className="p-4 text-slate-500 font-medium">{index + 1}</td>
                      <td className="p-4 w-16">
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
                      <td className="p-4 font-medium text-slate-800 max-w-xs break-words">{p.name}</td>
                      <td className="p-4 text-pink-600 font-medium">Rp {Number(p.price).toLocaleString()}</td>
                      <td className="p-4 text-slate-700">Rp {Number(p.materialCost).toLocaleString()}</td>
                      <td className="p-4 text-slate-700">Rp {Number(p.otherCost).toLocaleString()}</td>
                      <td className={`p-4 font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rp {Math.abs(profit).toLocaleString()} {profit < 0 && '(Rugi)'}
                      </td>
                      <td className="p-4 text-slate-700">{p.category || '—'}</td>
                      <td className="p-4">{getStockBadge(p.stock)}</td>
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => {
                            setEditing(p);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="px-3 py-1 text-xs font-medium rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
                        >
                          Hapus
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

      {/* Mobile: Card List — SESUAI POLA ORDERS */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-500 text-lg">📦</span>
            </div>
            <p>Tidak ada produk yang cocok.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const profit = getProfitPerUnit(p);
            return (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Nama</span>
                    <span className="font-medium text-slate-800">{p.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Harga Jual</span>
                    <span className="text-pink-600 font-medium">Rp {Number(p.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Biaya Bahan</span>
                    <span>Rp {Number(p.materialCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Biaya Lain-lain</span>
                    <span>Rp {Number(p.otherCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Laba/Unit</span>
                    <span className={profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      Rp {Math.abs(profit).toLocaleString()} {profit < 0 && '(Rugi)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Kategori</span>
                    <span>{p.category || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Stok</span>
                    {getStockBadge(p.stock)}
                  </div>
                  {p.image && (
                    <div className="pt-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-32 object-contain rounded-lg border border-slate-200"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-rose-100 text-rose-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <Modal
          title={editing ? 'Edit Produk' : 'Tambah Produk Baru'}
          fields={[
            { name: 'name', label: 'Nama Produk', type: 'text', required: true },
            { name: 'price', label: 'Harga Jual (Rp)', type: 'number', required: true, min: 0 },
            { name: 'materialCost', label: 'Biaya Bahan (Rp)', type: 'number', min: 0 },
            { name: 'otherCost', label: 'Biaya Lain-lain (Rp)', type: 'number', min: 0 },
            { name: 'category', label: 'Kategori', type: 'text' },
            { name: 'stock', label: 'Stok (opsional)', type: 'number', min: 0 },
            { name: 'image', label: 'Upload Gambar (opsional)', type: 'file' },
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-slate-800">📤 Import Produk dari CSV</h3>
              <p className="text-sm text-slate-600 mt-1">
                Format kolom wajib: <strong>Nama, Harga Jual, Biaya Bahan, Biaya Lain-lain</strong>
              </p>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              {importError && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
                  {importError}
                </div>
              )}

              {!importPreview.length && !importError && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                  <p className="text-slate-600 mb-4">Pilih file CSV produk</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
                  >
                    Pilih File CSV
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    Contoh format tersedia di{' '}
                    <button
                      onClick={() => exportToCSV([])}
                      className="text-pink-600 underline"
                    >
                      template kosong
                    </button>
                  </p>
                </div>
              )}

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">
                    Preview ({importPreview.length} produk):
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importPreview.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="text-sm p-3 bg-slate-50 rounded">
                        <div><span className="font-medium">Nama:</span> {item.name}</div>
                        <div>Harga: Rp {item.price?.toLocaleString()}</div>
                        <div>Biaya: Rp {(item.materialCost + item.otherCost)?.toLocaleString()}</div>
                      </div>
                    ))}
                    {importPreview.length > 5 && (
                      <p className="text-xs text-slate-500">
                        +{importPreview.length - 5} produk lainnya...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreview([]);
                  setImportError('');
                }}
                className="px-4 py-2 text-slate-700 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={importPreview.length === 0}
                className={`px-4 py-2 font-medium rounded-lg ${
                  importPreview.length === 0
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
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