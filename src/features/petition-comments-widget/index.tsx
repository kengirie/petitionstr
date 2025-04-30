import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Button } from '@/shared/components/ui/button';

import { Spinner } from '@/shared/components/spinner';

import { NewNoteWidget } from '@/features/new-note-widget';
import { NoteByEvent } from '@/features/note-widget';

import { usePetitionCommentsWidget } from './hooks';
import { CommentByEvent } from '../comment-widget';

export const PetitionCommentsWidget = ({ event }: { event: NDKEvent }) => {
  const { processedEvents, hasMore, loadMore } = usePetitionCommentsWidget(event);

  return (
    <>

      <div className="-mx-2">
        {processedEvents === undefined ? (
          <Spinner />
        ) : (
          processedEvents.length > 0 && (
            <div className="pt-2 flex flex-col gap-2">
              {processedEvents.map((event) => (
                <CommentByEvent key={event.id} event={event} />
              ))}
            </div>
          )
        )}

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={() => loadMore(50)} className="w-full">
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
