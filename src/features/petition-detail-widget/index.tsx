import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';
import { PetitionByEvent } from '../petition-widget';


export const PetitionDetailWidget = memo(
  ({ petitionId }: { petitionId: string | undefined }) => {
      const [event, setEvent] = useState<NDKEvent | null | undefined>(undefined);

    const { ndk } = useNdk();

    useEffect(() => {
      if (!ndk || !petitionId) {
        return;
      }

      ndk.fetchEvent(petitionId).then((event) => {
        setEvent(event);
      });
    }, [petitionId, ndk, setEvent]);

    return <PetitionByEvent event={event} />;
  },
  (prev, next) => prev.petitionId === next.petitionId,
);
