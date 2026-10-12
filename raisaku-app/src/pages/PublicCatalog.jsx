import { useState, useMemo } from "react";
import Brand from "../components/ui/Brand";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";

export default function PublicCatalog({ products, onOpenAdmin }) {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "Semua" || product.category === category) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, products, search],
  );

  const contact = () =>
    // window.open("https://wa.me/6281234567890?text=Halo%20Raisaku", "_blank");
    window.open("www.google.com", "_blank");

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 lg:px-8">
          <Brand />
          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <SearchField onChange={setSearch} value={search} />
          </div>
          <Button className="h-11 px-4 text-sm sm:px-5" onClick={contact}>
            <Icon name="whatsapp" className="size-5" />
            <span className="hidden sm:inline">Hubungi Kami</span>
          </Button>
          <Button
            className="size-11 shrink-0"
            onClick={onOpenAdmin}
            variant="secondary"
          >
            <Icon name="menu" className="size-5" />
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8 lg:pt-8">
          <div className="relative min-h-[31rem] overflow-hidden rounded-[2rem] bg-gray-900 md:min-h-[28rem]">
            <div className="relative z-10 flex min-h-[31rem] max-w-2xl flex-col justify-end p-7 text-white md:justify-center md:p-14">
              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Rasa rumahan, dibuat sepenuh hati.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">
                Nikmati abon gurih dan puding lembut dari bahan pilihan. Praktis
                dipesan, hangat rasanya.
              </p>
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
            <div className="flex w-fit rounded-2xl border border-line bg-white p-1.5">
              {["Semua", "Abon", "Puding"].map((item) => (
                <button
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${category === item ? "bg-brand text-white shadow-sm" : "text-gray-500 hover:text-ink"}`}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <article
                className="group overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:shadow-md"
                key={product.id}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    alt={product.name}
                    className="h-full w-full object-cover"
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
                <div className="px-2 pb-2 pt-5">
                  <h3 className="text-lg font-extrabold">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                    {product.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <div>
                      <span className="block text-xs text-gray-500">
                        Mulai dari
                      </span>
                      <strong className="mt-0.5 block text-lg text-brand">
                        Rp{product.price.toLocaleString("id-ID")}
                      </strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
