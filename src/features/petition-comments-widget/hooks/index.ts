import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePetitionCommentsWidget = (event: NDKEvent) => {

  const subId = `petition-comments-${event.tagAddress()}`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const processedEvents = useMemo(
    () => [...(events || [])].reverse(),
    [events]
  );

  useEffect(() => {
      createSubscription({
        filters: [{ kinds: [1111], '#A': [event.tagAddress()], limit: 10 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription]);

  return {
    processedEvents,
    loadMore,
    hasMore,
    isLoading,
  };
};
