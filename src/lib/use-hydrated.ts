'use client';

import * as React from 'react';

/** Never subscribes to anything; the empty unsubscribe satisfies the contract. */
const noop = () => () => {};

/**
 * False during server rendering and the hydration pass, true from the commit
 * immediately after.
 *
 * ## What this is for
 *
 * Anything the server cannot know — a media query, `localStorage`, the current
 * time — must not change what gets *rendered* until hydration is done, or React
 * finds different markup than it expected, throws a hydration error and
 * regenerates the whole subtree. Gate the branch on this and the first client
 * render matches the server by construction.
 *
 * The pattern this exists to fix, found in two components during the Phase 5
 * audit: `const reduce = useReducedMotion(); if (reduce) return <Static />`. On
 * the server `useReducedMotion` cannot see the media query, so it returns false
 * and the animated tree is rendered. A visitor with reduced motion enabled then
 * hydrated the static tree over it. Their whole homepage was being thrown away
 * and rebuilt on every load — and only for them, which is why it survived so long.
 *
 * ## Why `useSyncExternalStore` rather than an effect
 *
 * The `useState(false)` plus `useEffect(() => setState(true))` version sets state
 * during the commit that follows hydration, which is a second render pass and
 * which the React compiler's lint correctly objects to. This asks the mechanism
 * designed for the question: React compares the client snapshot against the
 * hydrated one and re-renders when they differ — here, exactly once.
 */
export function useHydrated() {
  return React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/**
 * `useReducedMotion`, made safe to branch the render on.
 *
 * Reports false until hydration is complete, so server and client agree on the
 * first pass and a reduced-motion visitor swaps to the calmer tree immediately
 * afterwards rather than triggering a mismatch.
 *
 * Only needed when the value decides *what is rendered*. Passing `reduce` to a
 * Framer `initial`/`animate` prop on a dialog that mounts on click is fine as-is:
 * nothing about it was ever server-rendered.
 */
export function useSettledReducedMotion(reduce: boolean | null) {
  return useHydrated() && Boolean(reduce);
}
