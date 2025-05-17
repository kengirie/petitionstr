import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useSubscription } from 'nostr-hooks';
import { useCallback, useEffect, useMemo } from 'react';

export const usePetitionEndorseBtn = (event: NDKEvent | undefined) => {
  const { isEndorsedByMe } = useMyEndorsement(event);
  const { ndk } = useNdk();
 
  const endorse = useCallback(() => {
    if (!isEndorsedByMe && event && ndk) {
      const e = new NDKEvent(ndk);
      e.kind = NDKKind.Reaction;
      e.content = '+';
      e.tags = [['k', event.kind?.toString() ?? ''], ['p', event.pubkey],['a', event.tagAddress()], ['e', event.id]];
      e.publish();
    }
  }, [event, isEndorsedByMe, ndk]);

  return { isEndorsedByMe, endorse };
};

const useMyEndorsement = (event: NDKEvent | undefined) => {
  const { activeUser } = useActiveUser();

  const subId = activeUser && event ? `petition-my-endorsements-${event.id}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const validEvents = useMemo(() => events?.filter((e) => e.content === '+'), [events]);

  useEffect(() => {
    activeUser &&
      event &&
      createSubscription({
        filters: [
          { kinds: [NDKKind.Reaction], '#e': [event.id], authors: [activeUser.pubkey], limit: 1 },
        ],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, activeUser, event]);

  return { isEndorsedByMe: validEvents && validEvents.length > 0 };
};

// const useAnybodyEndorsements = (event: NDKEvent | undefined) => {
//   const subId = event ? `note-endorsements-${event.id}` : undefined;

//   const { createSubscription, events } = useSubscription(subId);

//   const validEvents = useMemo(() => events?.filter((e) => e.content === '+'), [events]);

//   const count = useMemo(() => validEvents?.length || 0, [validEvents]);

//   useEffect(() => {
//     event &&
//       createSubscription({
//         filters: [{ kinds: [NDKKind.Reaction], '#e': [event.id], limit: 1000 }],
//         opts: { groupableDelay: 500 },
//       });
//   }, [createSubscription, event]);

//   return { count };
//};
