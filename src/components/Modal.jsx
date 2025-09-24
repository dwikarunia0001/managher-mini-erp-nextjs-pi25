export default function Modal({ title, fields, initialValues, onSubmit, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};
    fields.forEach((field) => {
      formData[field.name] = e.target[field.name].value;
      if (field.type === 'number') formData[field.name] = Number(formData[field.name]);
    });
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                defaultValue={initialValues[field.name] || ''}
                className="w-full p-2 border rounded"
                required={field.required}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}