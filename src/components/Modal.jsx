'use client';

import { useState } from 'react';

export default function Modal({ title, fields, initialValues, onSubmit, onClose }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.name] = initialValues?.[field.name] ?? field.defaultValue ?? (field.type === 'file' ? null : '');
    });
    return initial;
  });

  const handleChange = (e) => {
    const { name, type } = e.target;
    let value = e.target.value;

    if (type === 'file') {
      // Ambil file pertama dari input
      value = e.target.files[0] || null;
    } else if (type === 'number') {
      value = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    const resetData = {};
    fields.forEach(field => {
      resetData[field.name] = field.type === 'file' ? null : (field.defaultValue ?? '');
    });
    setFormData(resetData);
  };

  // Warna berdasarkan indeks
  const getColorClasses = (index) => {
    const styles = {
      0: { border: 'border-l-4 border-pink-500', bg: 'bg-pink-100', text: 'text-pink-600', ring: 'focus:ring-pink-300' },
      1: { border: 'border-l-4 border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', ring: 'focus:ring-blue-300' },
      2: { border: 'border-l-4 border-green-500', bg: 'bg-green-100', text: 'text-green-600', ring: 'focus:ring-green-300' },
      3: { border: 'border-l-4 border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600', ring: 'focus:ring-purple-300' },
      4: { border: 'border-l-4 border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600', ring: 'focus:ring-orange-300' },
      5: { border: 'border-l-4 border-amber-500', bg: 'bg-amber-100', text: 'text-amber-600', ring: 'focus:ring-amber-300' },
      6: { border: 'border-l-4 border-rose-500', bg: 'bg-rose-100', text: 'text-rose-600', ring: 'focus:ring-rose-300' },
      7: { border: 'border-l-4 border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'focus:ring-indigo-300' },
    };
    return styles[index % 8];
  };

  const getHelperText = (fieldName) => {
    const guides = {
      name: '🌸 Gunakan nama yang mudah diingat & jelas. Contoh: "Baju Kaos Katun"',
      price: '💰 Jangan takut hargai usahamu! Harga = biaya + keuntungan kecil.',
      category: '🏷️ Contoh: Pakaian, Aksesoris, Makanan, dll.',
      stock: '📦 Stok 0 = habis. Bisa diisi nanti setelah produksi.',
      image: '📸 Upload foto produk (maks 200 KB, format JPG/PNG).',
      description: '💬 Ceritakan singkat tentang produk ini. Apa yang membuatnya spesial?',
      notes: '📝 Catatan opsional: bahan, ukuran, atau info khusus.',
      quantity: '🔢 Jumlah barang yang dibeli/dibuat.',
      paymentMethod: '💳 Pilih metode yang sering kamu gunakan.',
    };
    return guides[fieldName] || '';
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl">
        <div className="bg-white">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold">📝 {title}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-200 hover:bg-slate-300 transition"
              >
                🔄 Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
              >
                ✏️ Batal
              </button>
              <button
                type="submit"
                form="modal-form"
                className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white transition"
              >
                💾 Simpan
              </button>
            </div>
          </div>

          <div className="max-h-[80vh] overflow-y-auto p-6 pb-30">
            <form id="modal-form" onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field, index) => {
                const classes = getColorClasses(index);
                const value = formData[field.name] ?? '';

                return (
                  <div key={field.name} className={`${classes.border} pl-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full ${classes.bg} ${classes.text} flex items-center justify-center text-xs font-bold`}>
                        {index + 1}
                      </div>
                      <label className="text-sm font-medium">{field.label}</label>
                    </div>

                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg outline-none ${classes.ring} transition`}
                        required={field.required}
                      >
                        <option value="">Pilih...</option>
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        rows={field.rows || 3}
                        placeholder={field.placeholder}
                        className={`w-full p-2 border rounded-lg outline-none ${classes.ring} transition`}
                        required={field.required}
                      />
                    ) : field.type === 'file' ? (
                      <input
                        type="file"
                        name={field.name}
                        accept="image/*"
                        onChange={handleChange}
                        className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        className={`w-full p-2 border rounded-lg outline-none ${classes.ring} transition`}
                        required={field.required}
                      />
                    )}

                    {getHelperText(field.name) && (
                      <p className="mt-1 text-xs text-slate-500">
                        {getHelperText(field.name)}
                      </p>
                    )}
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}