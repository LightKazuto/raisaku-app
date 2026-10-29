import { useState } from "react";
import axios from "axios";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

export default function EditProductModal({
  product,
  onClose,
  onSave,
  categories = [],
}) {
  const [preview, setPreview] = useState(product?.image || "");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const fileInput = formElement.querySelector('input[type="file"]');
    if (fileInput?.files && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      await axios.put(
        `http://localhost:5001/api/products/${product.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      onSave();
    } catch (error) {
      console.error("Gagal mengupdate produk:", error);
      alert("Gagal memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-extrabold">Edit Produk</h2>
            <p className="mt-1 text-sm text-muted">
              Perbarui informasi produk {product?.name}.
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
                <>
                  <img
                    alt="Preview produk"
                    className="absolute inset-0 h-full w-full object-cover"
                    src={preview}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition hover:opacity-100 flex items-center justify-center">
                    <span className="rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-ink shadow">
                      Klik untuk ganti foto
                    </span>
                  </div>
                </>
              ) : (
                <span className="flex flex-col items-center p-6">
                  <span className="grid size-11 place-items-center rounded-full bg-white text-brand shadow-sm">
                    <Icon name="upload" />
                  </span>
                  <strong className="mt-3 text-sm">
                    Klik untuk upload gambar baru
                  </strong>
                  <span className="mt-1 text-xs text-muted">PNG atau JPG</span>
                </span>
              )}
              <input
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
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
                defaultValue={product?.name}
                name="name"
                placeholder="Contoh: Abon Sapi Original"
                required
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Harga (Rp)</span>
              <input
                className="field w-full border p-3 rounded-xl"
                defaultValue={product?.price}
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
                defaultValue={product?.category_id}
                name="category_id"
                required
              >
                {categories.length === 0 ? (
                  <option value="" disabled>
                    Belum ada kategori
                  </option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Deskripsi</span>
              <textarea
                className="field w-full border p-3 rounded-xl min-h-28 resize-none"
                defaultValue={product?.description}
                name="description"
                placeholder="Ceritakan kelezatan produk ini..."
                required
              />
            </label>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              className="h-12 px-6"
              disabled={isLoading}
              onClick={onClose}
              type="button"
              variant="secondary"
            >
              Batal
            </Button>
            <Button className="h-12 px-7" disabled={isLoading} type="submit">
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
