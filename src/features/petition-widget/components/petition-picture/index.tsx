import { EventPointer, NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';

import { memo, useMemo } from 'react';

import { usePetitionPicture } from './hooks';

export const PetitionPicture = memo(
  ({ event }: { event: NDKEvent }) => {
    const { url, inView, ref } = usePetitionPicture(event.content);
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
