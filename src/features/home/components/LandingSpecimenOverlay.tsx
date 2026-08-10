import Link from "next/link";
import type { Translations } from "@/i18n";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimpBadgeStyles";
import Badge from "@/components/ui/Badge";
import type { ShrimpListItem } from "@/types/shrimp";

interface LandingSpecimenOverlayProps {
  t: Translations;
  active: ShrimpListItem;
}

export default function LandingSpecimenOverlay({ t, active }: LandingSpecimenOverlayProps) {
  const speciesAndType = [active.species, active.type].filter(Boolean);

  return (
    <div className="pointer-events-auto">
      <div className="mb-3">
        {active.name.split(/\s+/).map((part) => (
          <h1
            key={part}
            className="font-display font-semibold italic leading-[0.9] text-white"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            {part}
          </h1>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono-label text-[11px] uppercase tracking-widest text-white/45">
        {speciesAndType.map((item, index) => (
          <span key={item} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden>•</span>}
            <span>{item}</span>
          </span>
        ))}
        {active.grade && (
          <>
            {speciesAndType.length > 0 && <span aria-hidden>•</span>}
            <Badge variant="accent" className={gradeBadgeClass(active.grade)}>
              {active.grade}
            </Badge>
          </>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {active.rarity && (
          <Badge variant="muted" className={rarityBadgeClass(active.rarity)}>
            {active.rarity}
          </Badge>
        )}
        {active.traits.map((trait) => (
          <Badge key={trait} variant="muted" className={traitBadgeClass(trait)}>
            {trait}
          </Badge>
        ))}
        {active.colors.map((color) => (
          <Badge key={color} variant="muted" className="border-white/15 bg-white/5 text-white/50">
            {color}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <span className="font-display text-white/70 text-lg">
          {t.landing.from} A${Number(active.min_price ?? 0)}
        </span>
        <Link
          href={`/products/${active.id}`}
          className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
        >
          {t.landing.viewShrimp}
        </Link>
      </div>
    </div>
  );
}
