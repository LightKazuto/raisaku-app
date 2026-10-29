import { useState, useMemo, useEffect } from "react";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200" />

      {/* Body Skeleton */}
      <div className="flex flex-col flex-1 px-2 pb-2 pt-4">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2.5" />

        {/* Description */}
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-4/5" />
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div className="h-6 bg-gray-200 rounded-md w-24" />
          <div className="h-9 bg-gray-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, cartItem, onAddToCart, onUpdateQty }) {
  const isOutOfStock = !product.available;

  return (
    <article
      className={`flex flex-col group overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-sm transition ${
        isOutOfStock
          ? "opacity-75 bg-gray-50/70"
          : "hover:shadow-md hover:border-brand/30"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <img
          alt={product.name}
          className={`h-full w-full object-cover transition duration-500 ${
            isOutOfStock ? "grayscale-[20%]" : "group-hover:scale-105"
          }`}
          src={product.image}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
          {product.category}
        </span>
        {isOutOfStock && (
          <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            Habis
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 px-2 pb-2 pt-4">
        <h3 className="text-lg font-extrabold text-ink">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted flex-1">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div>
            <strong className="block text-lg text-brand">
              Rp{product.price.toLocaleString("id-ID")}
            </strong>
          </div>

          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="rounded-xl border border-line bg-gray-100 px-4 py-2 text-sm font-bold text-gray-400 cursor-not-allowed select-none opacity-80"
            >
              Habis
            </button>
          ) : cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQty(product.id, -1)}
                className={`flex size-8 items-center justify-center rounded-lg border font-bold transition ${
                  cartItem.qty === 1
                    ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                    : "border-line bg-surface hover:bg-gray-100 text-ink"
                }`}
                type="button"
              >
                {cartItem.qty === 1 ? (
                  <Icon name="trash" className="size-4" />
                ) : (
                  "-"
                )}
              </button>

              <span className="text-sm font-bold w-5 text-center">
                {cartItem.qty}
              </span>

              <button
                onClick={() => onUpdateQty(product.id, 1)}
                className="flex size-8 items-center justify-center rounded-lg border font-bold transition border-brand bg-brand text-white hover:bg-brand-dark"
                type="button"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              className="px-4 py-2 text-sm"
              onClick={() => onAddToCart(product)}
            >
              + Tambah
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function PublicCatalog({
  products,
  categories = [],
  onOpenAdmin,
  isLoading = false,
}) {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const categoryList = useMemo(() => {
    const list =
      categories.length > 0
        ? categories.map((c) => c.name)
        : ["Abon", "Puding"];
    return ["Semua", ...list];
  }, [categories]);

  useEffect(() => {
    if (category !== "Semua" && !categoryList.includes(category)) {
      setCategory("Semua");
    }
  }, [categoryList, category]);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "Semua" || product.category === category) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, products, search],
  );

  const availableProducts = useMemo(
    () => visibleProducts.filter((product) => product.available),
    [visibleProducts],
  );

  const outOfStockProducts = useMemo(
    () => visibleProducts.filter((product) => !product.available),
    [visibleProducts],
  );

  const addToCart = (product) => {
    if (!product.available) {
      setToastMsg(`Maaf, ${product.name} sedang tidak tersedia!`);
      setTimeout(() => setToastMsg(null), 2000);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });

    setToastMsg(`${product.name} berhasil ditambahkan!`);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setToastMsg(null);
    }, 2000);
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const product = products.find((p) => p.id === id);
            const isAvailable = product ? product.available : true;

            if (delta > 0 && !isAvailable) {
              setToastMsg(`Maaf, ${item.name} sedang tidak tersedia`);
              setTimeout(() => setToastMsg(null), 2000);
              return item;
            }

            const newQty = item.qty + delta;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const checkoutToWhatsApp = () => {
    if (cart.length === 0) return;

    const outOfStockItem = cart.find((item) => {
      const p = products.find((prod) => prod.id === item.id);
      return !p || !p.available;
    });

    if (outOfStockItem) {
      alert(`Mohon kurangi/hapus "${outOfStockItem.name}" dari keranjang karena produk sedang tidak tersedia.`);
      return;
    }

    let text = "Halo *Raisaku*, saya ingin pesan:\n\n";
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.qty}x) - Rp${(item.price * item.qty).toLocaleString("id-ID")}\n`;
    });
    text += `\n*Total Belanja: Rp${totalPrice.toLocaleString("id-ID")}*\n\nMohon info ketersediaan dan pembayarannya ya. Terima kasih!`;
    const backendRedirectUrl = "http://localhost:5001/api/whatsapp/redirect";
    window.open(
      `${backendRedirectUrl}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <Brand />

          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <SearchField onChange={setSearch} value={search} />
          </div>

          <Button
            className={`h-11 px-4 text-sm sm:px-5 relative transition-all duration-300 ${isAnimating ? "scale-110 bg-brand-soft text-brand" : ""}`}
            onClick={() => setIsCartOpen(true)}
            variant="secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hidden sm:inline ml-2">Keranjang</span>

            {totalItems > 0 && (
              <>
                {isAnimating && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 animate-ping rounded-full bg-brand opacity-75"></span>
                )}
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              </>
            )}
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8 lg:pt-8">
          <div className="relative min-h-[31rem] overflow-hidden rounded-[2rem] bg-gray-900 md:min-h-[28rem]">
            <img
              alt="Sajian hangat khas Raisaku"
              className="absolute inset-0 h-full w-full object-cover md:left-auto md:w-[65%]"
              src="/abon-sapi.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent md:bg-gradient-to-r md:from-gray-900 md:via-gray-900/90 md:to-transparent" />
            <div className="relative z-10 flex min-h-[31rem] max-w-2xl flex-col justify-end p-7 text-white md:justify-center md:p-14">
              <span className="mb-5 w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur">
                Dibuat fresh setiap hari
              </span>
              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-white/75">
                Rasa rumahan, dibuat sepenuh hati.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">
                Nikmati abon gurih dan puding lembut dari bahan pilihan. Praktis
                dipesan, hangat rasanya.
              </p>
              <Button
                className="mt-7 h-12 w-fit bg-brand px-6 !text-white hover:bg-brand-dark"
                onClick={() =>
                  document
                    .getElementById("produk")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Lihat menu hari ini
              </Button>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"
          id="produk"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Pilih favoritmu
              </h2>
            </div>
            <div className="flex w-fit flex-wrap gap-1 rounded-2xl border border-line bg-white p-1.5 shadow-sm">
              {categoryList.map((item) => (
                <button
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${category === item ? "bg-brand text-white shadow-sm" : "text-gray-500 hover:text-ink hover:bg-gray-50"}`}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Status: Semua / Tersedia / Habis */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-1">Status:</span>
            {[
              { id: "all", label: "Semua", count: visibleProducts.length },
              { id: "available", label: "Tersedia", count: availableProducts.length },
              { id: "outOfStock", label: "Habis", count: outOfStockProducts.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  statusFilter === tab.id
                    ? "bg-ink text-white shadow-sm"
                    : "bg-white border border-line text-muted hover:text-ink hover:border-gray-300"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="mt-9 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex size-3 rounded-full bg-gray-200 animate-pulse"></span>
                <div className="h-6 w-36 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-line bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Icon name="search" className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 text-sm text-muted">
                Tidak ada menu yang sesuai dengan pencarian atau kategori ini.
              </p>
            </div>
          ) : (
            <div className="mt-9 space-y-14">
              {/* Bagian Produk Tersedia */}
              {(statusFilter === "all" || statusFilter === "available") && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                      <h3 className="text-xl font-extrabold text-ink md:text-2xl">
                        Menu Tersedia
                      </h3>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        {availableProducts.length} menu
                      </span>
                    </div>
                  </div>

                  {availableProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {availableProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cartItem={cart.find((item) => item.id === product.id)}
                          onAddToCart={addToCart}
                          onUpdateQty={updateQty}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-muted">
                      <p className="text-sm font-semibold">
                        Saat ini belum ada menu yang tersedia untuk pilihan ini.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bagian Produk Habis */}
              {((statusFilter === "all" && outOfStockProducts.length > 0) ||
                statusFilter === "outOfStock") && (
                <div
                  className={
                    statusFilter === "all" && availableProducts.length > 0
                      ? "pt-12 border-t border-line/80"
                      : ""
                  }
                >
                  <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-3 rounded-full bg-rose-500 ring-4 ring-rose-100"></span>
                      <h3 className="text-xl font-extrabold text-ink md:text-2xl">
                        Stok Habis
                      </h3>
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                        {outOfStockProducts.length} menu
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted">
                      Menu sedang tidak tersedia sementara
                    </p>
                  </div>

                  {outOfStockProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {outOfStockProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cartItem={cart.find((item) => item.id === product.id)}
                          onAddToCart={addToCart}
                          onUpdateQty={updateQty}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-muted">
                      <p className="text-sm font-semibold">
                        Tidak ada menu yang habis. Semua produk siap dipesan!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="border-t border-line mt-10 py-8 text-center">
          <p className="text-sm text-muted">
            © 2026 Raisaku. Dibuat dengan sepenuh hati.
          </p>
          <button
            onClick={onOpenAdmin}
            className="mt-3 text-xs font-bold text-gray-300 hover:text-brand transition duration-300"
          >
            Admin Access
          </button>
        </footer>
      </main>

      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="animate-bounce bg-ink text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm whitespace-nowrap">
            <span className="bg-green-500 rounded-full p-1">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            {toastMsg}
          </div>
        </div>
      )}

      {/* Drawer Keranjang Belanja */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isCartOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsCartOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex max-w-full w-full sm:w-[400px] transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-full w-full flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold">Keranjang Pesanan</h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-extrabold text-brand">
                    {totalItems} item
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 text-muted transition"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="font-bold text-ink">Keranjang masih kosong</p>
                  <p className="text-sm mt-1">
                    Yuk, pilih abon dan puding favoritmu!
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {cart.map((item) => {
                    const currentProduct = products.find((p) => p.id === item.id);
                    const isOutOfStock = !currentProduct || !currentProduct.available;

                    return (
                      <li key={item.id} className="flex py-5 gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-16 rounded-xl object-cover border border-line shrink-0"
                        />
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-bold text-ink text-sm leading-tight truncate">
                              {item.name}
                            </h3>
                            <p className="text-brand font-bold text-sm mt-1">
                              Rp{item.price.toLocaleString("id-ID")}
                            </p>
                            {isOutOfStock && (
                              <span className="inline-block mt-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="flex size-7 items-center justify-center rounded-lg border border-line bg-gray-50 hover:bg-gray-100 font-bold text-ink text-sm transition"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              disabled={isOutOfStock}
                              className={`flex size-7 items-center justify-center rounded-lg border font-bold transition text-sm ${
                                isOutOfStock
                                  ? "border-line bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "border-line bg-gray-50 hover:bg-gray-200 text-ink"
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-ink text-sm">
                            Rp{(item.price * item.qty).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line bg-gray-50 p-6">
                <div className="flex justify-between text-base font-bold text-ink mb-5">
                  <p>Total Belanja</p>
                  <p className="text-lg text-brand font-extrabold">
                    Rp{totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <Button
                  className="w-full h-14 text-base"
                  onClick={checkoutToWhatsApp}
                >
                  <Icon name="whatsapp" className="size-5" /> Pesan Sekarang via WA
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
