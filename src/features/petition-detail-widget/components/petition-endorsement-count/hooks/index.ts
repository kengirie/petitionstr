import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePetitionEndorsementCount = (event: NDKEvent | undefined) => {
  const subId = event ? `petition-endorsements-${event.id}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const validEvents = useMemo(() => events?.filter((e) => e.content === '+'), [events]);

  const count = useMemo(() => validEvents?.length || 0, [validEvents]);

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [NDKKind.Reaction], '#e': [event.id], limit: 1000 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return { count };
};
