import { useState } from "react";
import axios from "axios";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";
import Toggle from "../components/ui/Toggle";
import AddProductModal from "../components/admin/AddProductModal";
import EditProductModal from "../components/admin/EditProductModal";

export default function AdminDashboard({
  products,
  setProducts,
  onOpenCatalog,
  refreshProducts,
  currentUser,
  isLoading = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleStatus = async (productId, currentStatus) => {
    setProducts(
      products.map((item) =>
        item.id === productId ? { ...item, available: !currentStatus } : item,
      ),
    );

    try {
      await axios.put(`http://localhost:5001/api/products/${productId}`, {
        is_available: !currentStatus,
      });
    } catch (error) {
      console.error("Gagal mengubah status ketersediaan:", error);
      alert("Terjadi kesalahan saat mengubah status produk.");
      refreshProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Brand />
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-muted">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-line px-3 py-1.5 rounded-xl">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentUser.username || currentUser.email}</span>
              </div>
            )}
            <Button
              className="h-10 px-4 text-xs font-bold"
              onClick={onOpenCatalog}
              variant="secondary"
            >
              <Icon name="logout" className="size-4 mr-1.5" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="p-5 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Daftar Produk
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Kelola produk dan status ketersediaan di katalog.
              </p>
            </div>
            <Button className="h-12 px-5" onClick={() => setModalOpen(true)}>
              <Icon name="plus" /> Tambah Produk Baru
            </Button>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div className="p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <strong>{isLoading ? "Memuat..." : `${products.length} Produk`}</strong>
              <div className="w-full md:w-72">
                <SearchField onChange={setSearch} value={search} />
              </div>
            </div>

            {/* Tampilan Desktop & Tablet (>= md): Tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4 font-bold">Produk</th>
                    <th className="px-5 py-4 font-bold">Kategori</th>
                    <th className="px-5 py-4 font-bold">Harga</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(4)].map((_, idx) => (
                      <tr key={idx} className="border-t border-line animate-pulse">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="size-14 rounded-xl bg-gray-200 shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-48" />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-6 w-16 bg-gray-200 rounded-full" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-20 bg-gray-200 rounded" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-6 w-20 bg-gray-200 rounded-full" />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="h-8 w-16 bg-gray-200 rounded-xl mx-auto" />
                        </td>
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-sm text-muted">
                        Tidak ada produk yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr className="border-t border-line hover:bg-gray-50/50 transition" key={product.id}>
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img
                            alt=""
                            className="size-14 rounded-xl object-cover shrink-0"
                            src={product.image}
                          />
                          <div>
                            <strong className="block text-sm">
                              {product.name}
                            </strong>
                            <span className="block text-xs text-muted max-w-xs truncate">
                              {product.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold">
                          Rp{product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Toggle
                              checked={product.available}
                              onChange={() =>
                                handleToggleStatus(
                                  product.id,
                                  product.available,
                                )
                              }
                            />
                            <span
                              className={`text-xs font-bold ${
                                product.available
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {product.available ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-bold text-ink transition hover:border-brand hover:bg-brand-soft hover:text-brand shadow-sm"
                            onClick={() => setEditingProduct(product)}
                            type="button"
                          >
                            <Icon name="edit" className="size-3.5" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tampilan Mobile (< md): Cards */}
            <div className="md:hidden divide-y divide-line">
              {isLoading ? (
                [...Array(3)].map((_, idx) => (
                  <div key={idx} className="p-4 flex flex-col gap-3.5 animate-pulse">
                    <div className="flex gap-3.5 items-start">
                      <div className="size-20 rounded-2xl bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-28" />
                        <div className="h-3 bg-gray-200 rounded w-36" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-line/60">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="h-7 w-16 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted">
                  Tidak ada produk yang cocok dengan pencarian.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 flex flex-col gap-3.5 hover:bg-gray-50/50 transition"
                  >
                    <div className="flex gap-3.5 items-start">
                      <img
                        alt={product.name}
                        className="size-20 rounded-2xl object-cover border border-line shrink-0"
                        src={product.image}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-ink truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                        <div className="mt-2 text-sm font-bold text-brand">
                          Rp{product.price.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>

                    {/* Baris Status & Tombol Edit */}
                    <div className="flex items-center justify-between pt-3 border-t border-line/60">
                      <div className="flex items-center gap-2.5">
                        <Toggle
                          checked={product.available}
                          onChange={() =>
                            handleToggleStatus(
                              product.id,
                              product.available,
                            )
                          }
                        />
                        <span
                          className={`text-xs font-bold ${
                            product.available
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        >
                          {product.available ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>

                      <button
                        className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink transition hover:border-brand hover:bg-brand-soft hover:text-brand shadow-sm"
                        onClick={() => setEditingProduct(product)}
                        type="button"
                      >
                        <Icon name="edit" className="size-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <AddProductModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            refreshProducts();
          }}
        />
      )}

      {editingProduct && (
        <EditProductModal
          onClose={() => setEditingProduct(null)}
          onSave={() => {
            setEditingProduct(null);
            refreshProducts();
          }}
          product={editingProduct}
        />
      )}
    </div>
  );
}
