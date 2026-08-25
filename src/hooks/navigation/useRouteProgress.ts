import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const minimumVisibleMs = 260;
const slowFallbackMs = 9000;

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function getInternalNavigationUrl(url: string | null) {
  if (!url) return null;

  try {
    const nextUrl = new URL(url, window.location.href);
    if (nextUrl.origin !== window.location.origin) return null;
    if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return null;
    return nextUrl;
  } catch {
    return null;
  }
}

export function useRouteProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedAtRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      if (startTimerRef.current) window.clearTimeout(startTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isNavigating) return;

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current < 35) return current + 9;
        if (current < 70) return current + 4;
        if (current < 92) return current + 1.5;
        return current;
      });
    }, 160);

    return () => window.clearInterval(interval);
  }, [isNavigating]);

  useEffect(() => {
    if (!isNavigating) return;

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(0, minimumVisibleMs - elapsed);

    setProgress(100);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, remaining + 180);
  }, [pathname]);

  useEffect(() => {
    function startProgressNow() {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);

      startedAtRef.current = Date.now();
      setIsNavigating(true);
      setProgress((current) => (current > 0 ? current : 12));
      fallbackTimerRef.current = window.setTimeout(() => {
        setProgress(100);
        hideTimerRef.current = window.setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
        }, 180);
      }, slowFallbackMs);
    }

    function scheduleStartProgress() {
      if (startTimerRef.current) window.clearTimeout(startTimerRef.current);
      startTimerRef.current = window.setTimeout(() => {
        startTimerRef.current = null;
        startProgressNow();
      }, 0);
    }

    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.download) return;

      const nextUrl = getInternalNavigationUrl(anchor.getAttribute("href"));
      if (!nextUrl) return;

      scheduleStartProgress();
    }

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      const nextUrl = getInternalNavigationUrl(typeof args[2] === "string" ? args[2] : null);
      const result = originalPushState.apply(this, args);
      if (nextUrl) scheduleStartProgress();
      return result;
    };

    window.history.replaceState = function replaceState(...args) {
      const nextUrl = getInternalNavigationUrl(typeof args[2] === "string" ? args[2] : null);
      const result = originalReplaceState.apply(this, args);
      if (nextUrl) scheduleStartProgress();
      return result;
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return {
    isNavigating,
    progress,
  };
}
