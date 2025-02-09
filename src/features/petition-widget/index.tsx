import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';

import { Spinner } from '@/shared/components/spinner';

import { NoteContent } from '@/features/note-widget/components/note-content';
import { NoteFooter } from '@/features/note-widget/components/note-footer';
import { NoteHeader } from '@/features/note-widget/components/note-header';
import { PetitionContent } from './components/petition-content';

export const PetitionByEvent = memo(
  ({ event }: { event: NDKEvent | null | undefined }) => {
    if (event === undefined) {
      return <Spinner />;
    }

    if (event === null) {
      return <div className="px-2 border-b">Note not found</div>;
    }

    if (event) {
      return (
        <>
          <div className="px-2">
            <div className="px-2 border rounded-sm shadow-md bg-background transition-colors duration-500 ease-out hover:border-primary/30">
              <NoteHeader event={event} />
              <PetitionContent event={event} />
              <NoteFooter event={event} />
            </div>
          </div>
        </>
      );
    }
  },
  (prev, next) => prev.event?.id === next.event?.id,
);

export const NoteByNoteId = memo(
  ({ noteId }: { noteId: string | undefined }) => {
    const [event, setEvent] = useState<NDKEvent | null | undefined>(undefined);

    const { ndk } = useNdk();

    useEffect(() => {
      if (!ndk || !noteId) {
        return;
      }

      ndk.fetchEvent(noteId).then((event) => {
        setEvent(event);
      });
    }, [noteId, ndk, setEvent]);

    return <PetitionByEvent event={event} />;
  },
  (prev, next) => prev.noteId === next.noteId,
);
