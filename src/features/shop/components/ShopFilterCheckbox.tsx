interface ShopFilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function ShopFilterCheckbox({ label, checked, onChange }: ShopFilterCheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-2">
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center border transition-colors ${
          checked ? "border-accent bg-accent" : "border-border bg-transparent"
        }`}
        style={{ borderRadius: "2px" }}
        aria-hidden
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3L3 5L7 1"
              stroke="var(--accent-foreground)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-mono-label text-[11px] tracking-widest text-foreground/70 transition-colors group-hover:text-foreground">
        {label}
      </span>
    </label>
  );
}
