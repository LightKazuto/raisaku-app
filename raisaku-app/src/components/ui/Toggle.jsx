export default function Toggle({ checked, onChange }) {
  return (
    <button
      aria-label={checked ? "Tandai produk habis" : "Tandai produk tersedia"}
      aria-pressed={checked}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
      onClick={onChange}
      type="button"
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}
