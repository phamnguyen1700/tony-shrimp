import type { Translations } from "@/i18n";

type ShopCollectionIntroContent =
  Translations["shop"]["collections"][keyof Translations["shop"]["collections"]];

interface ShopCollectionIntroProps {
  intro: ShopCollectionIntroContent;
}

export default function ShopCollectionIntro({ intro }: ShopCollectionIntroProps) {
  return (
    <section className="border-y border-border py-5 md:py-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)] md:items-start">
        <div className="max-w-3xl">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {intro.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-xl italic leading-snug text-foreground md:text-2xl">
            {intro.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/72">
            {intro.body}
          </p>
        </div>

        <ul className="space-y-2 md:pt-1">
          {intro.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2 text-xs leading-5 text-foreground/70">
              <span className="mt-2 h-1 w-1 shrink-0 bg-accent" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
