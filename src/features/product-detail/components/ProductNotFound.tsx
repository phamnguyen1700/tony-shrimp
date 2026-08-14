import Link from "next/link";
import { routes } from "@/config/routes";
import type { Translations } from "@/i18n";

interface ProductNotFoundProps {
  t: Translations;
}

export default function ProductNotFound({ t }: ProductNotFoundProps) {
  return (
    <div className="app-page flex items-center justify-center">
      <div className="max-w-xl space-y-5 text-center">
        <p className="mono-meta uppercase">404</p>
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold italic text-foreground md:text-4xl">
            {t.product.notFoundTitle}
          </h1>
          <p className="text-sm leading-7 text-muted-foreground md:text-base">
            {t.product.notFoundDescription}
          </p>
        </div>
        <Link
          href={routes.shop}
          className="font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2"
        >
          {t.product.findSimilar}
        </Link>
      </div>
    </div>
  );
}
