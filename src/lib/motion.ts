/**
 * Shared easing curves.
 *
 * These mirror the `--ease-*` custom properties in globals.css, so a CSS
 * transition and a Framer Motion animation on the same element move with
 * identical character. Typed as fixed-length tuples because Framer Motion's
 * `Easing` type rejects a plain `number[]`.
 *
 * Only the two that are used. There were four curves and two named `Transition`
 * objects here; the other four were written on the assumption they would be
 * wanted and never were, and a palette of easings nobody reaches for is just a
 * longer list to choose wrongly from. `--ease-out-quint` still exists as a CSS
 * custom property, which is where it is actually referenced.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];

/** Overshoots slightly — for something arriving, not something moving. */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const satisfies readonly [
  number,
  number,
  number,
  number,
];
