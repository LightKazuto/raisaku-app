export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
}) {
  const variants = {
    primary: "bg-brand text-white shadow-sm hover:bg-brand-dark",
    secondary:
      "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft",
    ghost: "text-muted hover:bg-surface-strong hover:text-ink",
    danger: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition focus:outline-none focus:ring-4 focus:ring-brand/15 ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
