import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribeToMobileBreakpoint(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getMobileSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerMobileSnapshot() {
  return false
}

/**
 * 現在の viewport が mobile breakpoint 未満かどうかを購読する。
 *
 * @returns mobile 幅の場合は true、それ以外または SSR 中は false。
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobileBreakpoint,
    getMobileSnapshot,
    getServerMobileSnapshot
  )
}
