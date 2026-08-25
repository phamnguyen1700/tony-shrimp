import Badge from "@/components/ui/Badge";
import { gradeBadgeClass } from "@/lib/shrimp/badgeStyles";
import type { ShrimpDetail } from "@/types/shrimp";

interface ProductInfoHeaderProps {
  product: ShrimpDetail;
  productIndex: number;
  totalProducts: number;
}

function getNameParts(name: string) {
  return name.trim().split(/\s+/);
}

export default function ProductInfoHeader({
  product,
  productIndex,
  totalProducts,
}: ProductInfoHeaderProps) {
  const speciesAndType = [product.species, product.line].filter(Boolean);

  return (
    <div>
      <p className="mono-eyebrow mb-3">
        {String(productIndex + 1).padStart(2, "0")} /{" "}
        {String(totalProducts).padStart(2, "0")}
      </p>
      <h1 className="font-display text-3xl font-semibold italic leading-tight text-foreground md:text-4xl lg:text-5xl">
        {getNameParts(product.name).map((part, index) => (
          <span key={part} className="md:block">
            {index > 0 && <span className="md:hidden"> </span>}
            {part}
          </span>
        ))}
      </h1>
      <div className="mono-eyebrow mt-2 flex flex-wrap items-center gap-2">
        {speciesAndType.map((item, index) => (
          <span key={item} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden>•</span>}
            <span>{item}</span>
          </span>
        ))}
        {product.grade && (
          <>
            {speciesAndType.length > 0 && <span aria-hidden>•</span>}
            <Badge variant="accent" className={gradeBadgeClass(product.grade)}>
              {product.grade}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
