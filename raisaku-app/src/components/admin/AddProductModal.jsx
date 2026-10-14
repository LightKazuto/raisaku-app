import { useState } from "react";
import axios from "axios";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

export default function AddProductModal({ onClose, onSave }) {
  const [preview, setPreview] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const categoryName = formData.get("category");
    const category_id = categoryName === "Abon" ? "1" : "2";
    formData.append("category_id", category_id);

    const fileInput = formElement.querySelector('input[type="file"]');
    if (fileInput.files && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      await axios.post("http://localhost:5001/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menambahkan produk. Pastikan backend menyala.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-extrabold">Tambah produk baru</h2>
            <p className="mt-1 text-sm text-muted">
              Lengkapi informasi produk Raisaku.
            </p>
          </div>
          <Button className="size-10" onClick={onClose} variant="ghost">
            <Icon name="close" />
          </Button>
        </div>
        <form className="space-y-5 p-6 sm:p-8" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Foto produk</span>
            <span className="relative grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface text-center transition hover:border-brand/50 hover:bg-brand-soft">
              {preview ? (
                <img
                  alt="Preview produk"
                  className="absolute inset-0 h-full w-full object-cover"
                  src={preview}
                />
              ) : (
                <span className="flex flex-col items-center p-6">
                  <span className="grid size-11 place-items-center rounded-full bg-white text-brand shadow-sm">
                    <Icon name="upload" />
                  </span>
                  <strong className="mt-3 text-sm">
                    Klik untuk upload gambar
                  </strong>
                  <span className="mt-1 text-xs text-muted">PNG atau JPG</span>
                </span>
              )}
              <input
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                required
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                type="file"
              />
            </span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Nama produk</span>
              <input
                className="field w-full border p-3 rounded-xl"
                name="name"
                placeholder="Contoh: Abon Sapi Original"
                required
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Harga</span>
              <input
                className="field w-full border p-3 rounded-xl"
                min="0"
                name="price"
                placeholder="45000"
                required
                type="number"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Kategori</span>
              <select
                className="field w-full border p-3 rounded-xl bg-white"
                name="category"
              >
                <option>Abon</option>
                <option>Puding</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Deskripsi</span>
              <textarea
                className="field w-full border p-3 rounded-xl min-h-28 resize-none"
                name="description"
                placeholder="Ceritakan kelezatan produk ini..."
                required
              />
            </label>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button className="h-12 px-6" onClick={onClose} variant="secondary">
              Batal
            </Button>
            <Button className="h-12 px-7" type="submit">
              Simpan Produk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
