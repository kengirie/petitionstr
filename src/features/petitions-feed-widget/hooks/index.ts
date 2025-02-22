import { useActiveUser, useFollows, useSubscription } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { PetitionFeedView } from '../types';

export const usePetitionsFeedWidget = () => {
  const [view, setView] = useState<PetitionFeedView>('Notes');

  const { activeUser } = useActiveUser();

  const subId = activeUser ? `notes-feed-${activeUser.pubkey}` : `notes-feed-not-logged-in`;

  const { createSubscription, events, loadMore, hasMore, isLoading } = useSubscription(subId);

  const processedEvents = useMemo(
    () =>
      events
        ?.filter((e) => {
          if (view === 'Notes') {
            return e.getMatchingTags('e').length == 0;
          }

          if (view === 'Replies') {
            return e.getMatchingTags('e').length > 0;
          }

          return true;
        })
        .reverse(),
    [events, view],
  );

  useEffect(() => {

    createSubscription({
      filters: [
        {
          kinds: [40],
          limit: 10,
          /*authors: [activeUser.pubkey, ...(follows || []).map((u) => u.pubkey)],*/
        },
      ],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription]);

  return { processedEvents, loadMore, hasMore, isLoading, setView, view };
};
