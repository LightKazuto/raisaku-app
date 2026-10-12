import { useState } from "react";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";
import Toggle from "../components/ui/Toggle";
import AddProductModal from "../components/admin/AddProductModal";

export default function AdminDashboard({
  products,
  setProducts,
  onOpenCatalog,
  refreshProducts,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );
  const navigation = [
    ["grid", "Dashboard"],
    ["box", "Produk"],
    ["tag", "Kategori"],
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-ink flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-900 p-5 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-2 py-3">
          <Brand light />
        </div>
        <nav className="mt-10 space-y-2">
          {navigation.map(([icon, label]) => (
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${label === "Produk" ? "bg-brand text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
              key={label}
              type="button"
            >
              <Icon name={icon} className="size-5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-white/55 transition hover:bg-white/5"
            onClick={onOpenCatalog}
            type="button"
          >
            <Icon name="logout" className="size-5" /> Kembali ke toko
          </button>
        </div>
      </aside>

      <div className="lg:pl-64 w-full">
        <header className="flex h-20 items-center justify-between border-b border-line bg-white px-5 md:px-8">
          <Button
            className="size-10 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            variant="secondary"
          >
            <Icon name="menu" />
          </Button>
          <div className="font-bold text-xl ml-auto">Admin Panel</div>
        </header>

        <main className="p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Daftar Produk
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Kelola produk dan ketersediaan stok di katalog.
                </p>
              </div>
              <Button className="h-12 px-5" onClick={() => setModalOpen(true)}>
                <Icon name="plus" /> Tambah Produk Baru
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
              <div className="p-5 border-b border-line flex justify-between">
                <strong>{products.length} Produk</strong>
                <div className="w-full md:w-72">
                  <SearchField onChange={setSearch} value={search} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-6 py-4 font-bold">Produk</th>
                      <th className="px-5 py-4 font-bold">Kategori</th>
                      <th className="px-5 py-4 font-bold">Harga</th>
                      <th className="px-5 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr className="border-t border-line" key={product.id}>
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img
                            alt=""
                            className="size-14 rounded-xl object-cover"
                            src={product.image}
                          />
                          <div>
                            <strong className="block text-sm">
                              {product.name}
                            </strong>
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
                              onChange={() => {
                                setProducts(
                                  products.map((item) =>
                                    item.id === product.id
                                      ? { ...item, available: !item.available }
                                      : item,
                                  ),
                                );
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <AddProductModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            refreshProducts();
          }}
        />
      )}
    </div>
  );
}
