"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, type PanInfo } from "motion/react";
import AppFooter from "@/components/common/layout/AppFooter";
import { useShrimpList } from "@/hooks/shrimp";
import { useAppRuntime } from "@/providers/AppProviders";
import LandingBackgroundVideo from "./components/LandingBackgroundVideo";
import LandingCollectionCounter from "./components/LandingCollectionCounter";
import LandingIndicators from "./components/LandingIndicators";
import LandingLoadingState from "./components/LandingLoadingState";
import LandingNavigation from "./components/LandingNavigation";
import LandingSlideTrack from "./components/LandingSlideTrack";
import LandingSpecimenOverlay from "./components/LandingSpecimenOverlay";
import type { ShrimpListItem } from "@/types/shrimp";

const WHEEL_SWIPE_THRESHOLD = 42;
const WHEEL_SWIPE_COOLDOWN_MS = 720;

interface HomeFeatureProps {
  initialShrimp?: ShrimpListItem[];
  initialIsRareCollection?: boolean;
}

export default function HomeFeature({
  initialShrimp,
  initialIsRareCollection = false,
}: HomeFeatureProps) {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const hasInitialShrimp = Boolean(initialShrimp?.length);
  const extremelyRareQuery = useShrimpList(
    { limit: 10, in_stock: true, rarity: "extremely rare" },
    { enabled: !hasInitialShrimp },
  );
  const rareQuery = useShrimpList(
    { limit: 10, in_stock: true, rarity: "rare" },
    { enabled: !hasInitialShrimp },
  );
  const fallbackQuery = useShrimpList(
    { limit: 10, in_stock: true },
    { enabled: !hasInitialShrimp },
  );
  const priorityShrimp = [...(extremelyRareQuery.data ?? []), ...(rareQuery.data ?? [])].filter(
    (specimen, index, list) => list.findIndex((item) => item.id === specimen.id) === index,
  );
  const priorityResolved = !extremelyRareQuery.isLoading && !rareQuery.isLoading;
  const fallbackResolved = !fallbackQuery.isLoading;
  const shrimp =
    initialShrimp?.length
      ? initialShrimp
      : priorityShrimp.length > 0
      ? priorityShrimp
      : priorityResolved
        ? (fallbackQuery.data ?? [])
        : [];
  const hasRareCollection = initialShrimp?.length
    ? initialIsRareCollection
    : priorityShrimp.length > 0;
  const isCollectionLoading =
    !hasInitialShrimp &&
    priorityShrimp.length === 0 &&
    (!priorityResolved || !fallbackResolved);
  const isCollectionError =
    priorityResolved &&
    fallbackResolved &&
    extremelyRareQuery.isError &&
    rareQuery.isError &&
    fallbackQuery.isError;
  const isComingSoon =
    priorityResolved &&
    fallbackResolved &&
    !isCollectionError &&
    shrimp.length === 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 1.2 });
  const lastWheelSwipeAt = useRef(0);

  const dragConstraintLeft = -(shrimp.length - 1) * slideWidth;

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

  useEffect(() => {
    if (activeIndex <= Math.max(0, shrimp.length - 1)) return;
    setActiveIndex(Math.max(0, shrimp.length - 1));
  }, [activeIndex, shrimp.length]);

  useEffect(() => {
    if (!isDragging) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehaviorY;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehaviorY = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehaviorY = previousOverscroll;
    };
  }, [isDragging]);

  const snapTo = useCallback(
    (index: number) => {
      if (!slideWidth) return;
      const clamped = Math.max(0, Math.min(shrimp.length - 1, index));
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
      const velocityPush = Math.abs(info.velocity.x) > 500 ? (info.velocity.x < 0 ? 1 : -1) : 0;
      const targetSlide = velocityPush ? activeIndex + velocityPush : Math.round(draggedSlides);
      snapTo(targetSlide);
    },
    [activeIndex, slideWidth, snapTo, x],
  );

  const goTo = useCallback((index: number) => snapTo(index), [snapTo]);

  useEffect(() => {
    const handleNativeWheel = (event: globalThis.WheelEvent) => {
      const isInsideHero = window.scrollY < window.innerHeight - 2;
      if (!isInsideHero || shrimp.length <= 1) return;

      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(dominantDelta) < WHEEL_SWIPE_THRESHOLD) return;

      const direction = dominantDelta > 0 ? 1 : -1;
      const canSwipe =
        (direction > 0 && activeIndex < shrimp.length - 1) ||
        (direction < 0 && activeIndex > 0);

      if (!canSwipe) return;

      event.preventDefault();
      event.stopPropagation();

      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }

      const now = Date.now();
      if (now - lastWheelSwipeAt.current < WHEEL_SWIPE_COOLDOWN_MS) return;

      lastWheelSwipeAt.current = now;
      snapTo(activeIndex + direction);
    };

    window.addEventListener("wheel", handleNativeWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleNativeWheel, {
        capture: true,
      });
    };
  }, [activeIndex, shrimp.length, snapTo]);

  const active = shrimp[activeIndex];

  if (isCollectionLoading) {
    return <LandingLoadingState />;
  }

  if (isCollectionError) {
    return <LandingLoadingState status="error" />;
  }

  if (isComingSoon) {
    return <LandingLoadingState status="coming-soon" />;
  }

  if (!active) {
    return <LandingLoadingState status="coming-soon" />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#080b08] overflow-hidden select-none">
      <LandingBackgroundVideo />

      <motion.div
        data-landing-track
        className={`relative z-[1] flex ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ x: springX, width: `${shrimp.length * 100}vw` }}
        drag="x"
        dragConstraints={{
          left: dragConstraintLeft,
          right: 0,
        }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <LandingSlideTrack shrimp={shrimp} activeIndex={activeIndex} reduced={reduced} />
      </motion.div>

      <div className="fixed inset-0 pointer-events-none z-10">
        <motion.div
          className="absolute top-20 left-6 md:left-10"
          initial={reduced ? {} : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <LandingCollectionCounter
            t={t}
            activeIndex={activeIndex}
            total={shrimp.length}
            isRareCollection={hasRareCollection}
          />
        </motion.div>

        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 right-6 md:right-auto max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <LandingSpecimenOverlay t={t} active={active} />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-16 md:bottom-20 right-6 md:right-10 pointer-events-auto"
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <LandingNavigation t={t} activeIndex={activeIndex} total={shrimp.length} onGoTo={goTo} />
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
          <LandingIndicators total={shrimp.length} activeIndex={activeIndex} onGoTo={goTo} />
        </div>
      </div>

      <AppFooter t={t} />
    </div>
  );
}
