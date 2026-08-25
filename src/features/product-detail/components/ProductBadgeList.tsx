import Badge from "@/components/ui/Badge";
import { rarityBadgeClass, traitBadgeClass } from "@/lib/shrimp/badgeStyles";
import type { ShrimpDetail } from "@/types/shrimp";

interface ProductBadgeListProps {
  product: ShrimpDetail;
}

export default function ProductBadgeList({ product }: ProductBadgeListProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {product.rarity && (
        <Badge variant="muted" className={rarityBadgeClass(product.rarity)}>
          {product.rarity}
        </Badge>
      )}
      {product.traits.map((trait) => (
        <Badge key={trait} variant="muted" className={traitBadgeClass(trait)}>
          {trait}
        </Badge>
      ))}
      {product.colors.map((color) => (
        <Badge key={color} variant="muted">
          {color}
        </Badge>
      ))}
    </div>
  );
}
