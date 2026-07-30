'use client';

import dynamic from 'next/dynamic';
import { AssistantComingSoonPanel } from '@/components/assistant/coming-soon-panel';

/**
 * Decides which panel the dock opens, and keeps the other one out of the bundle.
 *
 * The live desk is the expensive half of the assistant — a transcript, a streaming
 * reader, a markdown renderer, a composer. None of that should be downloaded by a
 * visitor on a deployment where the flag is off, and none of it should be
 * downloaded before somebody actually opens the panel even when the flag is on.
 * `next/dynamic` gives both: a separate chunk, fetched on first open.
 *
 * `ssr: false` because there is nothing to prerender. The panel renders null until
 * it is opened, and its transcript lives in sessionStorage, which does not exist on
 * the server.
 *
 * The Coming Soon panel is imported normally. It is a few hundred bytes of markup
 * and it is the one that has to be instant, because right now it is the one people
 * will see.
 */
const AssistantPanel = dynamic(
  () => import('@/components/assistant/assistant-panel').then((mod) => mod.AssistantPanel),
  { ssr: false },
);

export function AssistantDock({ enabled }: { enabled: boolean }) {
  return enabled ? <AssistantPanel /> : <AssistantComingSoonPanel />;
}
