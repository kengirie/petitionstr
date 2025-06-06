import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';
import { nip19 } from 'nostr-tools';

import { Spinner } from '@/shared/components/spinner';
import { Link } from 'react-router-dom';
import { PetitionFooter } from './components/petition-footer';
import { useNoteHeader } from './components/petition-header/hooks';
import { PetitionSummary } from './components/petition-summary';

import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
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
       const {naddr} = useNoteHeader(event);
      return (
        <>
          <div className="px-2">
            <Card className="border rounded-sm shadow-md bg-background transition-colors duration-500 ease-out hover:border-primary/30">
              <Link to={`/petition/${naddr}`} className="block no-underline text-inherit">
                <CardContent className="flex gap-4 p-4">
                  <div className="w-24 flex-shrink-0">
                    <PetitionImage event={event} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <PetitionTitle event={event}/>
                    <PetitionSummary event={event} />
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="justify-between">
                <div className="w-full">
                  <PetitionFooter event={event} />
                </div>
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



      const fetchPetition = async () => {
        try {
          let event: NDKEvent | null = null;

          // petitionIdがnaddr形式かどうかを判定

            const decoded = nip19.decode(petitionId);
            if (decoded.type === 'naddr') {
              const { identifier, pubkey, kind } = decoded.data;

              // 置換可能イベント用のフィルターを作成
              const filter = {
                kinds: [kind],
                authors: [pubkey],
                '#d': [identifier],
              };

              // イベントを検索
              event = await ndk.fetchEvent(filter);
            }
          setEvent(event);
        } catch (error) {
          console.error('Failed to fetch petition:', error);
          setEvent(null);
        }
      };

      fetchPetition();
    }, [petitionId, ndk, setEvent]);

    return (
        <PetitionByEvent event={event} />
      );
  },
  (prev, next) => prev.petitionId === next.petitionId,
);
