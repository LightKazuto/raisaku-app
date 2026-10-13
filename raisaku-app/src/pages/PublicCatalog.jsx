import { useState, useMemo } from "react";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";

export default function PublicCatalog({ products, onOpenAdmin }) {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
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

  const addToCart = (product) => {
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
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : item;
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
    let text = "Halo *Raisaku*, saya ingin pesan:\n\n";
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.qty}x) - Rp${(item.price * item.qty).toLocaleString("id-ID")}\n`;
    });
    text += `\n*Total Belanja: Rp${totalPrice.toLocaleString("id-ID")}*\n\nMohon info total ongkir dan pembayarannya ya. Terima kasih!`;
    const waNumber = "6281234567890";
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 lg:px-8">
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

          <Button
            className="size-11 shrink-0"
            onClick={onOpenAdmin}
            variant="ghost"
          >
            <Icon name="menu" className="size-5" />
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
            <div className="flex w-fit rounded-2xl border border-line bg-white p-1.5 shadow-sm">
              {["Semua", "Abon", "Puding"].map((item) => (
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

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                className="flex flex-col group overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:shadow-md hover:border-brand/30"
                key={product.id}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={product.image}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
                    {product.category}
                  </span>
                  {!product.available && (
                    <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                      Habis
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 px-2 pb-2 pt-4">
                  <h3 className="text-lg font-extrabold text-ink">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted flex-1">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <strong className="block text-lg text-brand">
                      Rp{product.price.toLocaleString("id-ID")}
                    </strong>
                    <Button
                      className="px-4 py-2 text-sm"
                      onClick={() => addToCart(product)}
                      disabled={!product.available}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="animate-bounce bg-ink text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm whitespace-nowrap">
            <span className="bg-emerald-500 rounded-full p-1">
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
              <h2 className="text-xl font-extrabold">Keranjang Pesanan</h2>
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
                  {cart.map((item) => (
                    <li key={item.id} className="flex py-5 gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-16 rounded-xl object-cover border border-line"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-ink text-sm leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-brand font-bold text-sm mt-1">
                            Rp{item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="flex size-7 items-center justify-center rounded-lg border border-line bg-gray-50 hover:bg-gray-100 font-bold text-ink"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="flex size-7 items-center justify-center rounded-lg border border-line bg-gray-50 hover:bg-gray-100 font-bold text-ink"
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
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line bg-gray-50 p-6">
                <div className="flex justify-between text-base font-bold text-ink mb-5">
                  <p>Total Belanja</p>
                  <p>Rp{totalPrice.toLocaleString("id-ID")}</p>
                </div>
                <Button
                  className="w-full h-14 text-base"
                  onClick={checkoutToWhatsApp}
                >
                  <Icon name="whatsapp" className="size-5" /> Pesan Sekarang via
                  WA
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
