import type { Translations } from "@/i18n";
import type { CatalogOptions, ShopFilters } from "@/types/shrimp";
import ShopFilterCheckbox from "./ShopFilterCheckbox";
import ShopFilterSection from "./ShopFilterSection";

interface ShopFilterPanelProps {
  filters: ShopFilters;
  t: Translations;
  options: Pick<CatalogOptions, "types" | "colors" | "grades" | "rarities" | "traits">;
  onToggle: (key: keyof ShopFilters, value: string) => void;
}

export default function ShopFilterPanel({ filters, t, options, onToggle }: ShopFilterPanelProps) {
  const groups = [
    { key: "types", title: t.shop.type, values: options.types },
    { key: "colors", title: t.shop.colour, values: options.colors },
    { key: "grades", title: t.shop.grade, values: options.grades },
    { key: "rarities", title: t.shop.rarity, values: options.rarities },
    { key: "traits", title: "Trait", values: options.traits },
  ] as const;

  return (
    <div className="space-y-5">
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
