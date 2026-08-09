import type { Translations } from "@/i18n";

interface LandingNavigationProps {
  t: Translations;
  activeIndex: number;
  total: number;
  onGoTo: (index: number) => void;
}

export default function LandingNavigation({ t, activeIndex, total, onGoTo }: LandingNavigationProps) {
  return (
    <div className="flex flex-col items-end gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => onGoTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="w-9 h-9 border border-white/15 text-white/40 hover:text-white hover:border-white/40 flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ borderRadius: "var(--radius)" }}
          aria-label="Previous"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => onGoTo(activeIndex + 1)}
          disabled={activeIndex === total - 1}
          className="w-9 h-9 border border-white/15 text-white/40 hover:text-white hover:border-white/40 flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ borderRadius: "var(--radius)" }}
          aria-label="Next"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <span className="font-mono-label text-[11px] tracking-[0.22em] uppercase text-white/25 hidden md:block">
        {t.landing.dragHint} →
      </span>
      <span className="font-mono-label text-[11px] tracking-[0.22em] uppercase text-white/25 md:hidden">
        {t.landing.swipeHint}
      </span>
    </div>
  );
}
