import { NDKEvent} from '@nostr-dev-kit/ndk';

import { memo} from 'react';

import { usePetitionImage } from './hooks';

export const PetitionImage = memo(
  ({ event }: { event: NDKEvent }) => {
    const { url, ref } = usePetitionImage(event);
    return (
      <div ref={ref} className="flex-shrink-0 w-full h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-sm">
        {url ? (
          <img
            src={url}
            alt="Petition picture"
            loading="lazy"
            className="w-full h-full rounded-sm object-cover"
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">No Image</div>
        )}
      </div>
    );
  },
  (prev, next) => prev.event.id === next.event.id);
