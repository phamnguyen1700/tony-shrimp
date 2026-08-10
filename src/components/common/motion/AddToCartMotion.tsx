"use client";

import { useRef, useState, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

interface AddToCartMotionRenderProps {
  disabled: boolean;
  onClick: () => void;
}

interface AddToCartMotionProps {
  children: (props: AddToCartMotionRenderProps) => ReactNode;
  className?: string;
  disabled?: boolean;
  imageUrl?: string | null;
  label?: string;
  onAddToCart: () => void | Promise<void>;
}

const FLY_SIZE = 58;
const FLY_DURATION = 0.95;

export default function AddToCartMotion({
  children,
  className = "",
  disabled = false,
  imageUrl,
  label,
  onAddToCart,
}: AddToCartMotionProps) {
  const reduced = useReducedMotion();
  const sourceRef = useRef<HTMLDivElement>(null);
  const [isFlying, setIsFlying] = useState(false);

  async function runMotion() {
    if (disabled || isFlying) return;

    const source = sourceRef.current;
    const target = document.querySelector<HTMLElement>("[data-cart-anchor='true']");

    if (reduced || !source || !target) {
      onAddToCart();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const startX = from.left + from.width / 2 - FLY_SIZE / 2;
    const startY = from.top + from.height / 2 - FLY_SIZE / 2;
    const dx = to.left + to.width / 2 - (startX + FLY_SIZE / 2);
    const dy = to.top + to.height / 2 - (startY + FLY_SIZE / 2);
    const flyer = document.createElement("div");

    flyer.setAttribute("aria-hidden", "true");
    flyer.style.position = "fixed";
    flyer.style.left = `${startX}px`;
    flyer.style.top = `${startY}px`;
    flyer.style.width = `${FLY_SIZE}px`;
    flyer.style.height = `${FLY_SIZE}px`;
    flyer.style.zIndex = "80";
    flyer.style.pointerEvents = "none";
    flyer.style.overflow = "hidden";
    flyer.style.border = "1px solid var(--border)";
    flyer.style.borderRadius = "var(--radius)";
    flyer.style.background = "var(--card)";
    flyer.style.boxShadow = "0 18px 40px rgba(0,0,0,0.24)";
    flyer.style.willChange = "transform, opacity";

    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = label ?? "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      flyer.appendChild(img);
    } else {
      flyer.style.display = "flex";
      flyer.style.alignItems = "center";
      flyer.style.justifyContent = "center";
      flyer.style.color = "var(--accent)";
      flyer.style.fontFamily = "var(--font-dm-mono)";
      flyer.style.fontSize = "10px";
      flyer.style.letterSpacing = "0.14em";
      flyer.textContent = "ADD";
    }

    document.body.appendChild(flyer);
    setIsFlying(true);
    onAddToCart();

    try {
      const burstDelay = FLY_DURATION * 0.78;
      const burst = document.createElement("div");
      const ring = document.createElement("div");

      burst.setAttribute("aria-hidden", "true");
      burst.style.position = "fixed";
      burst.style.left = `${to.left + to.width / 2 - 22}px`;
      burst.style.top = `${to.top + to.height / 2 - 22}px`;
      burst.style.width = "44px";
      burst.style.height = "44px";
      burst.style.zIndex = "79";
      burst.style.pointerEvents = "none";
      burst.style.borderRadius = "999px";
      burst.style.border = "1px solid var(--accent)";
      burst.style.opacity = "0";
      burst.style.willChange = "transform, opacity";

      ring.setAttribute("aria-hidden", "true");
      ring.style.position = "fixed";
      ring.style.left = `${to.left + to.width / 2 - 4}px`;
      ring.style.top = `${to.top + to.height / 2 - 4}px`;
      ring.style.width = "8px";
      ring.style.height = "8px";
      ring.style.zIndex = "79";
      ring.style.pointerEvents = "none";
      ring.style.borderRadius = "999px";
      ring.style.background = "var(--accent)";
      ring.style.boxShadow =
        "0 -18px 0 rgba(79,132,91,0.9), 16px -10px 0 rgba(79,132,91,0.72), 18px 8px 0 rgba(79,132,91,0.62), -16px 10px 0 rgba(79,132,91,0.72), -18px -8px 0 rgba(79,132,91,0.62)";
      ring.style.opacity = "0";
      ring.style.willChange = "transform, opacity";

      document.body.appendChild(burst);
      document.body.appendChild(ring);

      await Promise.all([
        animate(
          flyer,
          {
            x: [0, dx * 0.42, dx],
            y: [0, dy - 88, dy],
            scale: [1, 0.9, 0.24],
            opacity: [1, 1, 0],
            rotate: [0, -5, 0],
          },
          {
            duration: FLY_DURATION,
            ease: [0.62, 0.05, 0.28, 0.99],
            opacity: { times: [0, 0.9, 1] },
          },
        ),
        animate(
          target,
          { scale: [1, 1.16, 1] },
          { duration: 0.54, delay: FLY_DURATION * 0.68, ease: [0.22, 1, 0.36, 1] },
        ),
        animate(
          burst,
          { scale: [0.45, 1.85], opacity: [0, 0.85, 0] },
          { duration: 0.52, delay: burstDelay, ease: "easeOut" },
        ),
        animate(
          ring,
          { scale: [0.8, 1.8], opacity: [0, 1, 0] },
          { duration: 0.48, delay: burstDelay + 0.02, ease: "easeOut" },
        ),
      ]);

      burst.remove();
      ring.remove();
    } finally {
      flyer.remove();
      setIsFlying(false);
    }
  }

  return (
    <div ref={sourceRef} className={className}>
      {children({
        disabled: disabled || isFlying,
        onClick: runMotion,
      })}
    </div>
  );
}
