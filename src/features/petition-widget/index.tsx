import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';

import { Spinner } from '@/shared/components/spinner';
import { Link, Outlet, createBrowserRouter } from 'react-router-dom';
import { NoteContent } from '@/features/note-widget/components/note-content';
import { NoteFooter } from '@/features/note-widget/components/note-footer';
import { NoteHeader } from '@/features/note-widget/components/note-header';
import { PetitionSummary } from './components/petition-summary';
import { useNoteHeader } from './components/petition-header/hooks';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PetitionImage } from './components/petition-image';
import { PetitionTitle } from './components/petition-title';

export const PetitionByEvent = memo(
  ({ event }: { event: NDKEvent | null | undefined }) => {

    if (event === undefined) {
      return <Spinner />;
    }

    if (event === null) {
      return <div className="px-2 border-b">Note not found</div>;
    }

    if (event) {
       const {nevent} = useNoteHeader(event);
      return (
        <>
          <div className="px-2">
           <Link to={`/petition/${nevent}`} className="block no-underline text-inherit">
            <Card className="border rounded-sm shadow-md bg-background transition-colors duration-500 ease-out hover:border-primary/30">
              <CardContent className="flex gap-4 p-4">
                <div className="w-24 flex-shrink-0">
                  <PetitionImage event={event} />
                </div>
                <div className="flex-1 flex flex-col">
                  <PetitionTitle event={event}/>
                  <PetitionSummary event={event} />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
               <div className="w-full">
                <NoteHeader event={event} />
               </div>
              </CardFooter>
              </Card>
              </Link>
            </div>
        </>
      );
    }
  },
  (prev, next) => prev.event?.id === next.event?.id,
);

export const PetitionByPetitionId = memo(
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

    return (
        <PetitionByEvent event={event} />
      );
  },
  (prev, next) => prev.petitionId === next.petitionId,
);
