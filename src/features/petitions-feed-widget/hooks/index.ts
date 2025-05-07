import { useActiveUser, useSubscription } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { PetitionFeedView } from '../types';

export const usePetitionsFeedWidget = () => {
  const [view, setView] = useState<PetitionFeedView>('Notes');

  const { activeUser } = useActiveUser();

  const subId = activeUser ? `notes-feed-${activeUser.pubkey}` : `notes-feed-not-logged-in`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const processedEvents = useMemo(
    () => [...(events || [])].reverse(),
    [events]
  );

  useEffect(() => {

    createSubscription({
      filters: [
        {
          kinds: [30023],
          limit: 10,
          '#t': ['petition'],
        },
      ],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription]);

  return { processedEvents, loadMore, hasMore, isLoading, setView, view };
};
