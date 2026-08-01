import { useState, useEffect, useCallback, useRef, type WheelEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { featuredShrimp } from "@/data/shrimp";
import { getShrimpImage } from "@/assets/images";
import type { Translations } from "@/i18n";
import { springGentle, springSmooth } from "@/lib/motionVariants";

interface Props {
  t: Translations;
}

const WHEEL_SWIPE_THRESHOLD = 42;
const WHEEL_SWIPE_COOLDOWN_MS = 720;

export default function Landing({ t }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const reduced = useReducedMotion();
  const shrimp = featuredShrimp;

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 1.2 });
  const lastWheelSwipeAt = useRef(0);

  const dragConstraintLeft = -(shrimp.length - 1) * slideWidth;
  const dragConstraintRight = 0;

  useEffect(() => {
    const updateSlideWidth = () => {
      const nextWidth = window.innerWidth;
      setSlideWidth(nextWidth);
      x.set(-activeIndex * nextWidth);
    };

    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);

    return () => window.removeEventListener("resize", updateSlideWidth);
  }, [activeIndex, x]);

  const snapTo = useCallback(
    (idx: number) => {
      if (!slideWidth) return;
      const clamped = Math.max(0, Math.min(shrimp.length - 1, idx));
      setActiveIndex(clamped);
      x.set(-clamped * slideWidth);
    },
    [slideWidth, shrimp.length, x],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      if (!slideWidth) return;

      const draggedSlides = -x.get() / slideWidth;
      const velocityPush =
        Math.abs(info.velocity.x) > 500 ? (info.velocity.x < 0 ? 1 : -1) : 0;
      const targetSlide = velocityPush
        ? activeIndex + velocityPush
        : Math.round(draggedSlides);
      snapTo(targetSlide);
    },
    [activeIndex, slideWidth, snapTo, x],
  );

  const goTo = useCallback(
    (idx: number) => {
      snapTo(idx);
    },
    [snapTo],
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (Math.abs(dominantDelta) < WHEEL_SWIPE_THRESHOLD) return;

      const direction = dominantDelta > 0 ? 1 : -1;
      const canSwipe =
        (direction > 0 && activeIndex < shrimp.length - 1) ||
        (direction < 0 && activeIndex > 0);

      if (!canSwipe) return;

      event.preventDefault();

      const now = Date.now();
      if (now - lastWheelSwipeAt.current < WHEEL_SWIPE_COOLDOWN_MS) return;

      lastWheelSwipeAt.current = now;
      snapTo(activeIndex + direction);
    },
    [activeIndex, shrimp.length, snapTo],
  );

  const active = shrimp[activeIndex];

  return (
    <div className="relative w-full min-h-screen bg-[#080b08] overflow-hidden select-none" onWheel={handleWheel}>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          className="h-full w-full object-cover opacity-95"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/background-vid/background-swife.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#080b08]/5" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,11,8,0.92) 0%, rgba(8,11,8,0.46) 42%, rgba(8,11,8,0.72) 100%)",
          }}
        />
      </div>

      {/* Draggable gallery track */}
      <motion.div
        data-landing-track
        className={`relative z-[1] flex ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ x: springX, width: `${shrimp.length * 100}vw` }}
        drag="x"
        dragConstraints={{
          left: dragConstraintLeft,
          right: dragConstraintRight,
        }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {shrimp.map((specimen, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={specimen.id}
              data-landing-slide={idx}
              className="relative w-screen h-screen shrink-0 flex items-center justify-center overflow-hidden"
            >
              {/* Shrimp image */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none translate-x-[7vw] md:translate-x-[12vw]"
                animate={
                  reduced
                    ? {}
                    : {
                        scale: isActive ? 1 : 0.88,
                        opacity: isActive ? 1 : 0.3,
                      }
                }
                transition={springGentle}
              >
                <motion.img
                  src={getShrimpImage(specimen.imageKey)}
                  alt={specimen.name}
                  className="w-auto h-[52vh] md:h-[65vh] max-w-[80vw] md:max-w-[70vw] object-contain"
                  style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.8))" }}
                  animate={
                    reduced
                      ? {}
                      : isActive
                        ? {
                            y: [0, -10, -3, -12, 0],
                            rotate: [0, 0.6, -0.4, 0.9, 0],
                          }
                        : {}
                  }
                  transition={
                    isActive
                      ? {
                          duration: 9,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop",
                        }
                      : {}
                  }
                  draggable={false}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Overlay — fixed UI */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Top left — collection label */}
        <motion.div
          className="absolute top-20 left-6 md:left-10"
          initial={reduced ? {} : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="font-mono-label text-xs tracking-[0.24em] uppercase text-white/30">
            {t.landing.collectionTitle} ·{" "}
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(shrimp.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Bottom left — specimen metadata */}
        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 right-6 md:right-auto max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              {/* Name */}
              <div className="mb-3">
                {active.nameParts.map((part, i) => (
                  <h1
                    key={i}
                    className="font-display font-semibold italic leading-[0.9] text-white"
                    style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
                  >
                    {part}
                  </h1>
                ))}
              </div>

              {/* Classification */}
              <p className="font-mono-label text-[11px] tracking-widest text-white/45 mb-3 uppercase">
                {active.classification}
              </p>

              {/* Traits */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {active.traits.map((trait) => (
                  <span
                    key={trait}
                    className="font-mono-label text-[11px] tracking-widest uppercase px-2 py-0.5 border border-white/15 text-white/40"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center gap-5">
                <span className="font-display text-white/70 text-lg">
                  {t.landing.from} A${active.price}
                </span>
                <Link
                  href={`/products/${active.slug}`}
                  className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  {t.landing.viewShrimp}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom right — drag hint + navigation */}
        <div className="absolute bottom-16 md:bottom-20 right-6 md:right-10 flex flex-col items-end gap-4 pointer-events-auto">
          {/* Arrow navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-9 h-9 border border-white/15 text-white/40 hover:text-white hover:border-white/40 flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ borderRadius: "var(--radius)" }}
              aria-label="Previous"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === shrimp.length - 1}
              className="w-9 h-9 border border-white/15 text-white/40 hover:text-white hover:border-white/40 flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ borderRadius: "var(--radius)" }}
              aria-label="Next"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Drag hint */}
          <motion.span
            className="font-mono-label text-[11px] tracking-[0.22em] uppercase text-white/25 hidden md:block"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {t.landing.dragHint} →
          </motion.span>
          <motion.span
            className="font-mono-label text-[11px] tracking-[0.22em] uppercase text-white/25 md:hidden"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {t.landing.swipeHint}
          </motion.span>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
          {shrimp.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-5 h-0.5 transition-all duration-300"
              style={{
                background:
                  i === activeIndex
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)",
              }}
              aria-label={`Go to specimen ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer section */}
      <section className="relative z-20 bg-[#0d110d] text-[#edeae3]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-[#f7f3ea] mb-3 italic">
                Tony Shrimp Australia
              </h2>
              <p className="font-body text-sm text-[#b7b9b0] leading-relaxed max-w-sm">
                Premium ornamental freshwater shrimp for aquascapers and shrimp
                keepers. Bred selectively for colour, pattern and vigour.
                Australia-wide live arrival guarantee.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f2f0eb] text-[#080b08] text-xs font-mono-label uppercase tracking-widest hover:bg-white transition-colors"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {t.nav.shop}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-mono-label uppercase tracking-widest text-[#9da29a] mb-4">
                  Store
                </p>
                <div className="flex flex-col gap-2.5">
                  {[t.nav.shop, "Order Tracking", "Contact"].map((l) => (
                    <Link
                      key={l}
                      href="/"
                      className="text-xs text-[#d4d6ce]/75 hover:text-[#f7f3ea] transition-colors font-body"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-mono-label uppercase tracking-widest text-[#9da29a] mb-4">
                  Info
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    t.nav.shipping,
                    t.nav.doaPolicy,
                    "Instagram",
                    "Facebook",
                  ].map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-xs text-[#d4d6ce]/75 hover:text-[#f7f3ea] transition-colors font-body"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3">
            <p className="text-xs font-mono-label uppercase tracking-widest text-[#9da29a]/75">
              © 2026 Tony Shrimp Australia. All rights reserved.
            </p>
            <p className="text-xs font-mono-label uppercase tracking-widest text-[#9da29a]/65">
              Australia-wide shipping · Live arrival guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
