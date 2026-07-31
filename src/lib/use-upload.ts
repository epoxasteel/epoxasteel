'use client';

import * as React from 'react';

/**
 * Posts a form with files and reports how far the upload has actually got.
 *
 * `fetch` cannot do this. There is no upload-progress event on it — the streaming
 * request bodies that would allow one are still not usable for this, and a promise
 * that settles once tells you nothing on the way. So this is `XMLHttpRequest`, which
 * has had `upload.onprogress` since before `fetch` existed.
 *
 * That matters more than it sounds. Someone attaching a 9 MB drawing set on site
 * over a phone connection waits the better part of a minute. Without a number
 * moving, the honest reading of that screen is that it has hung — and they click the
 * button again, or leave. A progress bar is not decoration here; it is the
 * difference between a submitted inquiry and an abandoned one.
 *
 * `phase` distinguishes the two halves of the wait, because they feel different and
 * take different amounts of time:
 *
 *   `uploading` — bytes are moving; the percentage is meaningful.
 *   `processing` — the last byte has arrived and the server is validating files,
 *                  writing the record and sending mail. Nothing to measure, so the
 *                  UI stops claiming to and switches to an indeterminate state
 *                  rather than sitting at 100% looking broken.
 */

export type UploadPhase = 'idle' | 'uploading' | 'processing';

export type UploadState = {
  phase: UploadPhase;
  /** 0–100 while uploading. Meaningless in the other phases. */
  percent: number;
};

export type UploadResult<T> = { ok: boolean; status: number; data: T | null };

export function useUpload<T>() {
  const [state, setState] = React.useState<UploadState>({ phase: 'idle', percent: 0 });
  const request = React.useRef<XMLHttpRequest | null>(null);

  // A form unmounting mid-upload — a route change, or the success screen replacing
  // it — should not leave a request running and then set state on a dead component.
  React.useEffect(
    () => () => {
      request.current?.abort();
      request.current = null;
    },
    [],
  );

  const send = React.useCallback((url: string, body: FormData) => {
    return new Promise<UploadResult<T>>((resolve) => {
      const xhr = new XMLHttpRequest();
      request.current = xhr;

      setState({ phase: 'uploading', percent: 0 });

      xhr.upload.addEventListener('progress', (event) => {
        // `lengthComputable` is false when the browser cannot determine the total.
        // Reporting a fraction of an unknown quantity would be a fabrication.
        if (!event.lengthComputable) return;
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        setState({ phase: 'uploading', percent });
      });

      // The upload finishing is not the request finishing. Everything from here is
      // the server thinking, which has no progress to report.
      xhr.upload.addEventListener('load', () => {
        setState({ phase: 'processing', percent: 100 });
      });

      function finish(result: UploadResult<T>) {
        request.current = null;
        setState({ phase: 'idle', percent: 0 });
        resolve(result);
      }

      xhr.addEventListener('load', () => {
        let data: T | null = null;
        try {
          data = JSON.parse(xhr.responseText) as T;
        } catch {
          // A response that is not JSON is a proxy or platform error page. The
          // status still tells the caller what to say.
        }
        finish({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data });
      });

      xhr.addEventListener('error', () => finish({ ok: false, status: 0, data: null }));
      xhr.addEventListener('abort', () => finish({ ok: false, status: 0, data: null }));
      xhr.addEventListener('timeout', () => finish({ ok: false, status: 0, data: null }));

      // Generous, because the point of this hook is large files on slow links.
      xhr.timeout = 120_000;
      xhr.open('POST', url);
      // Marks the request as same-origin XHR, which the API routes' origin check
      // reads. Not set automatically the way `fetch` sets Sec-Fetch-*.
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(body);
    });
  }, []);

  return { ...state, send };
}
