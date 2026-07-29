import type { Transition } from 'framer-motion';

/**
 * Shared easing curves.
 *
 * These mirror the `--ease-*` custom properties in globals.css, so a CSS
 * transition and a Framer Motion animation on the same element move with
 * identical character. Typed as fixed-length tuples because Framer Motion's
 * `Easing` type rejects a plain `number[]`.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];

export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];

export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];

export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];

/** The default entrance used by reveals and hero content. */
export const transitionEnter: Transition = {
  duration: 0.75,
  ease: EASE_OUT_EXPO,
};

/** Faster variant for interface elements rather than page content. */
export const transitionUi: Transition = {
  duration: 0.35,
  ease: EASE_OUT_EXPO,
};
