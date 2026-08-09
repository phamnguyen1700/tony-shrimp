import type { Translations } from "@/i18n";

interface LandingCollectionCounterProps {
  t: Translations;
  activeIndex: number;
  total: number;
}

export default function LandingCollectionCounter({ t, activeIndex, total }: LandingCollectionCounterProps) {
  return (
    <span className="font-mono-label text-xs tracking-[0.24em] uppercase text-white/30">
      {t.landing.collectionTitle} • {String(activeIndex + 1).padStart(2, "0")} /{" "}
      {String(total).padStart(2, "0")}
    </span>
  );
}
