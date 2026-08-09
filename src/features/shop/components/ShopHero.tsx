interface ShopHeroProps {
  title: string;
}

export default function ShopHero({ title }: ShopHeroProps) {
  return (
    <>
      <p className="font-mono-label mb-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        TONY SHRIMP AUSTRALIA
      </p>
      <h1 className="font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
        {title}
      </h1>
    </>
  );
}
