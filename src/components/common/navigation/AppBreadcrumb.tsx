import Link from "next/link";

export interface AppBreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: AppBreadcrumbItem[];
  className?: string;
}

export default function AppBreadcrumb({ items, className = "" }: AppBreadcrumbProps) {
  return (
    <nav
      className={`flex flex-wrap items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden>•</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
