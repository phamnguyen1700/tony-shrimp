"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type PushAnimation = "scale" | "slide" | "fade" | "bounce";

interface LivePushFeedProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  maxVisible?: number;
  gap?: number;
  animation?: PushAnimation;
  className?: string;
}

function presetVariants(type: PushAnimation) {
  switch (type) {
    case "slide":
      return {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "bounce":
      return {
        initial: { opacity: 0, y: -20, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };
    default:
      return {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };
  }
}

export default function LivePushFeed<T extends { id: string | number }>({
  items,
  renderItem,
  maxVisible = 8,
  gap = 12,
  animation = "scale",
  className,
}: LivePushFeedProps<T>) {
  const visible = items.slice(0, maxVisible);
  const variants = presetVariants(animation);

  return (
    <div className={cn("flex flex-col", className)} style={{ gap }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
              layout: { type: "spring", stiffness: 350, damping: 28 },
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
