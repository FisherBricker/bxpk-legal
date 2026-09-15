import { useReducedMotion } from "motion/react";
import { useCallback, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

export function useMedia(query: string, serverValue = false): boolean {
  const subscribe = useCallback(subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

/** The page is intentionally lighter below 880 px. */
export function useIsDesktop(): boolean {
  return useMedia("(min-width: 880px)", true);
}

export function useIsTouch(): boolean {
  return useMedia("(hover: none)");
}

/** True when the visitor asked for reduced motion. */
export function useReduced(): boolean {
  return useReducedMotion() ?? false;
}

/**
 * Review captures load the page with ?capture so a full-page screenshot shows
 * every pinned chapter laid out flat and the route fully walked, instead of
 * empty sticky runway.
 */
export const CAPTURE = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture");

/** Desktop, full motion: the only mode where the page pins sections. */
export function usePinned(): boolean {
  return useIsDesktop() && !useReduced() && !CAPTURE;
}

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
