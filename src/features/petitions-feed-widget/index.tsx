import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { Spinner } from '@/shared/components/spinner';

import { NewNoteWidget } from '@/features/new-note-widget';
import { NoteByEvent } from '@/features/note-widget';
import { PetitionByEvent } from '../petition-widget';

import { usePetitionsFeedWidget } from './hooks';
import { PetitionFeedView } from './types';

export const PetitionsFeedWidget = () => {
  const { processedEvents, hasMore, loadMore, setView, view, isLoading } = usePetitionsFeedWidget();

  return (
    <>
      <div className="w-full">

        {isLoading ? (
          <Spinner />
        ) : processedEvents ? (
          <div className="pt-2 flex flex-col gap-2">
            {processedEvents.map((event) => (

              <PetitionByEvent key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="pt-2 px-2">
            <p>No events found.</p>
          </div>
        )}

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={() => loadMore(100)} className="w-full">
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
