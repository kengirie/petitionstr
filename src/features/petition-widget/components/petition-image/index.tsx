import { EventPointer, NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';

import { memo, useMemo } from 'react';

import { usePetitionImage } from './hooks';

export const PetitionImage = memo(
  ({ event }: { event: NDKEvent }) => {
    const { url, inView, ref } = usePetitionImage(event);
    return (
      <div ref={ref} className="flex-shrink-0 w-full md:w-1/3">
        {url && (
          <img
            src={url}
            alt="Petition picture"
            loading="lazy"
            className="w-full h-auto rounded-sm object-cover"
          />
        )}
      </div>
    );
  },
  (prev, next) => prev.event.id === next.event.id);
