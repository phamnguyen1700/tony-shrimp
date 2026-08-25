import type { Translations } from "@/i18n";
import type { LandingCollectionKind } from "@/types/landing";

interface LandingCollectionCounterProps {
  t: Translations;
  activeIndex: number;
  total: number;
  collectionKind: LandingCollectionKind;
}

export default function LandingCollectionCounter({
  t,
  activeIndex,
  total,
  collectionKind,
}: LandingCollectionCounterProps) {
  const collectionTitles: Record<LandingCollectionKind, string> = {
    "high-quality": t.landing.highQualityCollectionTitle,
    rare: t.landing.rareCollectionTitle,
    top: t.landing.collectionTitle,
  };
  const title = collectionTitles[collectionKind];

  return (
    <span className="font-mono-label text-xs tracking-[0.24em] uppercase text-white/30">
      {title} • {String(activeIndex + 1).padStart(2, "0")} /{" "}
      {String(total).padStart(2, "0")}
    </span>
  );
}
