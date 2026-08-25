import Link from "next/link";
import type { ShrimpCollectionLink } from "@/lib/shrimp/collectionConfig";
import { cn } from "@/lib/config/utils";
import ShopFilterSection from "./ShopFilterSection";

interface ShopCollectionLinksProps {
  links: ShrimpCollectionLink[];
  activeCollectionSlug?: string;
  className?: string;
}

export default function ShopCollectionLinks({
  links,
  activeCollectionSlug = "",
  className,
}: ShopCollectionLinksProps) {
  if (links.length === 0) return null;

  return (
    <ShopFilterSection title="Collection" className={className}>
      {links.map((link) => {
        const active = activeCollectionSlug === link.slug;

        return (
          <Link
            key={link.slug || "all"}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className="group flex items-center gap-2"
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center border transition-colors",
                active ? "border-accent bg-accent" : "border-border bg-transparent",
              )}
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
  );
}
