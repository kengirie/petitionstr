import { NDKEvent } from '@nostr-dev-kit/ndk';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { PetitionImage } from '@/features/petition-widget/components/petition-image';
import { PetitionTitle } from '@/features/petition-widget/components/petition-title';
import { PetitionSummary } from '@/features/petition-widget/components/petition-summary';
import { PetitionFooter } from '@/features/petition-widget/components/petition-footer';
import { useNoteHeader } from '@/features/petition-widget/components/petition-header/hooks';

export const PetitionSearchResultItem = memo(
  ({ event }: { event: NDKEvent }) => {
    const { naddr } = useNoteHeader(event);

    return (
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
    );
  },
  (prev, next) => prev.event.id === next.event.id
);
