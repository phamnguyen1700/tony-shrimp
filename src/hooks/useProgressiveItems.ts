import { useCallback, useEffect, useMemo, useState } from "react";

interface ProgressiveItemsOptions {
  initialCount: number;
  step: number;
}

export function useProgressiveItems<T>(
  items: T[],
  { initialCount, step }: ProgressiveItemsOptions,
) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, items]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );
  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    setVisibleCount((current) => Math.min(current + step, items.length));
  }, [items.length, step]);

  const reset = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  return {
    visibleItems,
    visibleCount,
    hasMore,
    loadMore,
    reset,
  };
}
