import { useAppRuntime } from "@/providers/AppProviders";

interface ShopEmptyStateProps {
  isLoading: boolean;
  isEmpty: boolean;
}

export default function ShopEmptyState({ isLoading, isEmpty }: ShopEmptyStateProps) {
  const { t } = useAppRuntime();

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-center">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{t.shop.loading}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-center">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          {t.shop.empty}
        </p>
      </div>
    );
  }

  return null;
}
