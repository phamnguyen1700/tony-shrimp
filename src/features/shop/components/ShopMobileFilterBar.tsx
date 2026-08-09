import type { Translations } from "@/i18n";

interface ShopMobileFilterBarProps {
  t: Translations;
  filterCount: number;
  onOpen: () => void;
  onClear: () => void;
}

export default function ShopMobileFilterBar({ t, filterCount, onOpen, onClear }: ShopMobileFilterBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-4 md:hidden">
      <button
        onClick={onOpen}
        className="flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-foreground"
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path
            d="M1 1H13M3 5H11M5 9H9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        {t.shop.showFilters}
        {filterCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[11px] text-accent-foreground">
            {filterCount}
          </span>
        )}
      </button>
      {filterCount > 0 && (
        <button onClick={onClear} className="font-mono-label text-xs tracking-widest text-muted-foreground underline">
          {t.shop.clearAll}
        </button>
      )}
    </div>
  );
}
