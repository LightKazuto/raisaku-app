import Icon from "./Icon";

export default function SearchField({
  value,
  onChange,
  placeholder = "Cari abon, puding...",
}) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Cari produk</span>
      <Icon
        name="search"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
      />
      <input
        className="h-12 w-full rounded-2xl border border-line bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}
