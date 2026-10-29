export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-brand text-white shadow-sm hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed",
    secondary:
      "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed",
    ghost:
      "text-muted hover:bg-surface-strong hover:text-ink disabled:text-gray-300 disabled:cursor-not-allowed",
    danger:
      "text-red-600 hover:bg-red-50 disabled:text-gray-300 disabled:cursor-not-allowed",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition focus:outline-none focus:ring-4 focus:ring-brand/15 ${variants[variant]} ${
        disabled
          ? "cursor-not-allowed opacity-60 pointer-events-none"
          : "cursor-pointer"
      } ${className}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
