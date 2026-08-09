import type { Translations } from "@/i18n";

interface AboutHeroProps {
  t: Translations;
}

export default function AboutHero({ t }: AboutHeroProps) {
  return (
    <div>
      <p className="mono-eyebrow mb-3">TONY SHRIMP AUSTRALIA</p>
      <h1 className="font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
        {t.nav.about}
      </h1>
    </div>
  );
}
