import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';

import { Spinner } from '@/shared/components/spinner';

import { NoteContent } from '@/features/note-widget/components/note-content';
import { NoteFooter } from '@/features/note-widget/components/note-footer';
import { NoteHeader } from '@/features/note-widget/components/note-header';
import { PetitionContent } from './components/petition-content';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PetitionPicture } from './components/petition-picture';
import { PetitionName } from './components/petition-name';

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
            <Card className="border rounded-sm shadow-md bg-background transition-colors duration-500 ease-out hover:border-primary/30">
              <CardHeader>
                <CardTitle><PetitionName event={event}/> </CardTitle>
              </CardHeader>
              <CardContent className = "flex flex-col gap-2">
                <PetitionPicture event={event} />
                <PetitionContent event={event} />
              </CardContent>
              <CardFooter>
               <NoteHeader event={event} />
              </CardFooter>
            </Card>
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

    return <PetitionByEvent event={event} />;
  },
  (prev, next) => prev.petitionId === next.petitionId,
);
