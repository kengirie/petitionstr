import { NDKUser } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { Button } from '@/shared/components/ui/button';

import { NoteByEvent } from '@/features/note-widget';
import { PetitionByEvent } from '@/features/petition-widget';

import { useProfilePetitions } from './hooks';

export const ProfilePetitions = memo(
  ({
    user,
  }: {
    user: NDKUser;
  }) => {
    const { processedEvents, loadMore, hasMore, isLoading } = useProfilePetitions({
      user,
    });

    return (
      <>
        <div className="flex flex-col gap-2">
          {processedEvents?.map((event) => <PetitionByEvent key={event.id} event={event} />)}
        </div>

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => loadMore(50)}
              className="w-full"
              disabled={isLoading}
            >
              Load more
            </Button>
          </div>
        )}
      </>
    );
  },
  (prev, next) =>
    prev.user.pubkey === next.user.pubkey,
);
