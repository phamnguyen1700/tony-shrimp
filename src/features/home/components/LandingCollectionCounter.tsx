import type { Translations } from "@/i18n";

interface LandingCollectionCounterProps {
  t: Translations;
  activeIndex: number;
  total: number;
  isRareCollection: boolean;
}

export default function LandingCollectionCounter({
  t,
  activeIndex,
  total,
  isRareCollection,
}: LandingCollectionCounterProps) {
  const title = isRareCollection
    ? t.landing.rareCollectionTitle
    : t.landing.collectionTitle;

  return (
    <span className="font-mono-label text-xs tracking-[0.24em] uppercase text-white/30">
      {title} • {String(activeIndex + 1).padStart(2, "0")} /{" "}
      {String(total).padStart(2, "0")}
    </span>
  );
}
