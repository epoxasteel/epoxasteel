'use client';

import * as React from 'react';
import { DEFAULT_MAX_MB, MAX_FILES, acceptLabel } from '@/lib/uploads';

/**
 * Fetches the signed token a form needs to submit, and the current upload limits.
 *
 * Lazily, on the first interaction with the form rather than on page load: most
 * visitors never start a form, and a token minted at page load has already spent
 * part of its life before anyone types. `prime()` is wired to focus, so by the
 * time the first field is filled the token is usually already in hand.
 *
 * `token()` awaits whatever is in flight, so a visitor who fills the form faster
 * than the network simply waits a few hundred milliseconds at submit instead of
 * being refused.
 *
 * If the request fails the form still submits — with no token. That is a
 * deliberate choice: the endpoint's other defenses (rate limit, honeypot, timing,
 * duplicate fingerprint) still apply, and a genuine inquiry lost to a blip on one
 * auxiliary request would be a far worse failure than a spam message getting
 * through. The server logs the absence.
 *
 * The upload policy arrives on the same response, so the size shown beside the file
 * picker is the size the server will actually enforce. Until it lands — or if the
 * call fails — the built-in default is used, which is the same number the server
 * defaults to.
 */

export type UploadPolicy = { maxBytes: number; maxFiles: number; label: string };

const FALLBACK: UploadPolicy = {
  maxBytes: DEFAULT_MAX_MB * 1024 * 1024,
  maxFiles: MAX_FILES,
  label: acceptLabel(DEFAULT_MAX_MB * 1024 * 1024),
};

type TokenResponse = { token?: string; upload?: UploadPolicy };

export function useFormToken(form: 'contact' | 'quote' | 'newsletter') {
  const cached = React.useRef<string | null>(null);
  const inFlight = React.useRef<Promise<string | null> | null>(null);
  const [upload, setUpload] = React.useState<UploadPolicy>(FALLBACK);

  const fetchToken = React.useCallback(() => {
    if (cached.current) return Promise.resolve(cached.current);
    if (inFlight.current) return inFlight.current;

    const request = fetch(`/api/form-token?form=${form}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: TokenResponse | null) => {
        cached.current = data?.token ?? null;
        if (data?.upload && Number.isFinite(data.upload.maxBytes)) setUpload(data.upload);
        return cached.current;
      })
      .catch(() => null)
      .finally(() => {
        inFlight.current = null;
      });

    inFlight.current = request;
    return request;
  }, [form]);

  return {
    /** Start fetching early — wire to onFocus on the form. */
    prime: fetchToken,
    /** Resolve the token at submit time, awaiting an in-flight request. */
    token: fetchToken,
    /** Server-declared upload limits, with a matching default until they arrive. */
    upload,
  };
}
