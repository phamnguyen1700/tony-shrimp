"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/config/utils";

interface LoadMoreSentinelProps {
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  className?: string;
}

export default function LoadMoreSentinel({
  enabled,
  onLoadMore,
  rootMargin = "360px 0px",
  className,
}: LoadMoreSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return (
    <div
      ref={sentinelRef}
      className={cn("h-px w-full", className)}
      aria-hidden
    />
  );
}
