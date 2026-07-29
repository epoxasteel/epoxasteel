'use client';

import * as React from 'react';

/**
 * Returns how long the component has been mounted, in milliseconds.
 *
 * Used by the anti-spam check on every form: a submission that arrives faster
 * than a human could type is rejected server-side. The timestamp is captured in
 * an effect rather than during render, so the component body stays pure.
 */
export function useElapsedSinceMount() {
  const mountedAt = React.useRef(0);

  React.useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  return React.useCallback(
    () => (mountedAt.current === 0 ? 0 : Date.now() - mountedAt.current),
    [],
  );
}
