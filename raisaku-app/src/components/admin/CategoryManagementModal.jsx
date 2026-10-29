import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

export default function CategoryManagementModal({
  onClose,
  onCategoriesChanged,
}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
      setMessage({
        type: "error",
        text: "Gagal mengambil daftar kategori dari server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setMessage({ type: "", text: "" });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage({ type: "error", text: "Nama kategori tidak boleh kosong." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        const response = await axios.put(
          `http://localhost:5001/api/categories/${editingCategory.id}`,
          {
            name: trimmedName,
            description: description.trim(),
          },
        );

        if (response.data.success) {
          setMessage({
            type: "success",
            text: `Kategori "${trimmedName}" berhasil diperbarui!`,
          });
          handleCancelEdit();
          fetchCategories();
          if (onCategoriesChanged) onCategoriesChanged();
        }
      } else {
        // Create new category
        const response = await axios.post("http://localhost:5001/api/categories", {
          name: trimmedName,
          description: description.trim(),
        });

        if (response.data.success) {
          setMessage({
            type: "success",
            text: `Kategori "${trimmedName}" berhasil ditambahkan!`,
          });
          setName("");
          setDescription("");
          fetchCategories();
          if (onCategoriesChanged) onCategoriesChanged();
        }
      }
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
      const errorMsg =
        error.response?.data?.message || "Gagal menyimpan kategori. Silakan coba lagi.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.product_count > 0) {
      setMessage({
        type: "error",
        text: `Kategori "${cat.name}" tidak dapat dihapus karena masih digunakan oleh ${cat.product_count} produk. Ubah kategori produk terlebih dahulu.`,
      });
      return;
    }

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus kategori "${cat.name}"?`,
    );
    if (!confirmDelete) return;

    setDeletingId(cat.id);
    setMessage({ type: "", text: "" });
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/categories/${cat.id}`,
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Kategori "${cat.name}" berhasil dihapus.`,
        });
        if (editingCategory?.id === cat.id) {
          handleCancelEdit();
        }
        fetchCategories();
        if (onCategoriesChanged) onCategoriesChanged();
      }
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      const errorMsg =
        error.response?.data?.message || "Gagal menghapus kategori.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
      <div className="max-h-[92vh] w-full max-w-2xl flex flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand border border-brand/20">
              <Icon name="tag" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-ink">
                Kelola Kategori Produk
              </h2>
              <p className="text-xs text-muted">
                Tambah, ubah, atau hapus kategori menu di katalog
              </p>
            </div>
          </div>
          <Button className="size-9" onClick={onClose} variant="ghost">
            <Icon name="close" className="size-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {message.text && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form Tambah / Edit Kategori */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-gray-50/70 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-gray-500 hover:text-ink underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Keripik, Minuman, Hampers"
                  className="field w-full border border-line p-2.5 rounded-xl text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Aneka keripik renyah dan gurih"
                  className="field w-full border border-line p-2.5 rounded-xl text-sm bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingCategory && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-9 px-4 text-xs font-bold"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 text-xs font-bold"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingCategory
                    ? "Simpan Perubahan"
                    : "+ Tambah Kategori"}
                </Button>
              </div>
            </div>
          </form>

          {/* Daftar Kategori */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
                Daftar Kategori Saat Ini ({categories.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-2xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center text-xs text-muted">
                Belum ada kategori yang dibuat.
              </div>
            ) : (
              <div className="divide-y divide-line rounded-2xl border border-line bg-white overflow-hidden">
                {categories.map((cat) => {
                  const isEditing = editingCategory?.id === cat.id;
                  const isDeleting = deletingId === cat.id;
                  const hasProducts = Number(cat.product_count) > 0;

                  return (
                    <div
                      key={cat.id}
                      className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        isEditing ? "bg-brand-soft/40" : "hover:bg-gray-50/60"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-extrabold text-ink">
                            {cat.name}
                          </strong>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              hasProducts
                                ? "bg-brand-soft text-brand border border-brand/20"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {cat.product_count} produk
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-muted mt-0.5 truncate">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-bold text-ink hover:border-brand hover:text-brand transition shadow-sm"
                          title="Edit nama kategori"
                        >
                          <Icon name="edit" className="size-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          disabled={isDeleting || hasProducts}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition shadow-sm ${
                            hasProducts
                              ? "border-line bg-gray-50 text-gray-300 cursor-not-allowed"
                              : "border-line bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                          }`}
                          title={
                            hasProducts
                              ? "Kategori tidak dapat dihapus karena masih digunakan produk"
                              : "Hapus kategori"
                          }
                        >
                          <Icon name="trash" className="size-3.5" />
                          <span>{isDeleting ? "..." : "Hapus"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-gray-50 px-6 py-4 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            className="h-10 px-5 text-xs font-bold"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
