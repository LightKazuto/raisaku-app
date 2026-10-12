import Icon from "./Icon";

export default function Brand({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid size-10 place-items-center rounded-2xl ${light ? "bg-white/15 text-white" : "bg-brand text-white"}`}
      >
        <Icon name="store" className="size-5" />
      </span>
      <span
        className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}
      >
        Raisaku<span className="text-brand-light">.</span>
      </span>
    </div>
  );
}
