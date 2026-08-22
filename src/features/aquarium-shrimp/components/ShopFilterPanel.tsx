import Link from "next/link";
import type { Translations } from "@/i18n";
import type { ShrimpCollectionLink } from "@/lib/shrimpCollectionConfig";
import type { CatalogOptions, ShopFilters } from "@/types/shrimp";
import ShopFilterCheckbox from "./ShopFilterCheckbox";
import ShopFilterSection from "./ShopFilterSection";

interface ShopFilterPanelProps {
  filters: ShopFilters;
  t: Translations;
  options: Pick<CatalogOptions, "species" | "lines" | "colors" | "grades" | "rarities" | "traits">;
  collectionLinks?: ShrimpCollectionLink[];
  activeCollectionSlug?: string;
  onToggle: (key: keyof ShopFilters, value: string) => void;
}

export default function ShopFilterPanel({
  filters,
  t,
  options,
  collectionLinks,
  activeCollectionSlug = "",
  onToggle,
}: ShopFilterPanelProps) {
  const groups = [
    { key: "species", title: t.shop.species, values: options.species ?? [] },
    { key: "lines", title: t.shop.type, values: options.lines },
    { key: "colors", title: t.shop.colour, values: options.colors },
    { key: "grades", title: t.shop.grade, values: options.grades },
    { key: "rarities", title: t.shop.rarity, values: options.rarities },
    { key: "traits", title: "Trait", values: options.traits },
  ] as const;

  return (
    <div className="space-y-5">
      {collectionLinks && collectionLinks.length > 0 && (
        <ShopFilterSection title="Collection">
          {collectionLinks.map((link) => {
            const active = activeCollectionSlug === link.slug;

            return (
              <Link
                key={link.slug || "all"}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="group flex items-center gap-2"
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center border transition-colors ${
                    active ? "border-accent bg-accent" : "border-border bg-transparent"
                  }`}
                  style={{ borderRadius: "999px" }}
                  aria-hidden
                >
                  {active && (
                    <span
                      className="h-1.5 w-1.5 bg-accent-foreground"
                      style={{ borderRadius: "999px" }}
                    />
                  )}
                </span>
                <span className="font-mono-label text-[11px] tracking-widest text-foreground/70 transition-colors group-hover:text-foreground">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </ShopFilterSection>
      )}
      {groups.map((group) =>
        group.values.length > 0 ? (
          <ShopFilterSection key={group.key} title={group.title}>
            {group.values.map((value) => (
              <ShopFilterCheckbox
                key={value}
                label={value}
                checked={filters[group.key].includes(value)}
                onChange={() => onToggle(group.key, value)}
              />
            ))}
          </ShopFilterSection>
        ) : null,
      )}
      <ShopFilterSection title={t.shop.availability}>
        <ShopFilterCheckbox
          label={t.shop.inStock}
          checked={filters.availability.includes("in-stock")}
          onChange={() => onToggle("availability", "in-stock")}
        />
        <ShopFilterCheckbox
          label={t.shop.outOfStock}
          checked={filters.availability.includes("out-of-stock")}
          onChange={() => onToggle("availability", "out-of-stock")}
        />
      </ShopFilterSection>
    </div>
  );
}
