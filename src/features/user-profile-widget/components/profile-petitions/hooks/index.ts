import { NDKUser } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const useProfilePetitions = ({
  user,
}: {
  user: NDKUser;
}) => {
  const subId = `user-notes-${user.pubkey}`;

  const { events, createSubscription, loadMore, hasMore, isLoading } = useSubscription(subId);

  const processedEvents = useMemo(
    () =>
      events
        ?.filter((e) => {
          return true;
        })
        .reverse(),
    [events],
  );

  useEffect(() => {
    if (!user.pubkey) {
      return;
    }

    createSubscription({
      filters: [{ authors: [user.pubkey], kinds: [30023], limit: 50 }],
      opts: { groupableDelay: 500 },
    });
  }, [createSubscription, user.pubkey]);

  return { processedEvents, loadMore, hasMore, isLoading };
};
