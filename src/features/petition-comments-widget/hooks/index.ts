import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePetitionCommentsWidget = (event: NDKEvent) => {
  const rootEventId = useMemo(() => {
    const dTag = event.getMatchingTags('d');
    const kind = event.kind;
    const pubkey = event.pubkey;
    return `${kind}:${pubkey}:${dTag[0][1]}`;
  }, [event]);

  const subId = `petition-comments-${rootEventId}`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const processedEvents = useMemo(
    () => [...(events || [])].reverse(),
    [events]
  );

  useEffect(() => {
    rootEventId &&
      createSubscription({
        filters: [{ kinds: [1111], '#A': [rootEventId], limit: 10 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, rootEventId]);

  return {
    processedEvents,
    loadMore,
    hasMore,
    isLoading,
  };
};
