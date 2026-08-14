interface ShopEmptyStateProps {
  isLoading: boolean;
  isEmpty: boolean;
}

export default function ShopEmptyState({ isLoading, isEmpty }: ShopEmptyStateProps) {
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">Loading shrimp...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          No shrimp match your filters.
        </p>
      </div>
    );
  }

  return null;
}
