import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';

import { Spinner } from '@/shared/components/spinner';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Separator } from '@/shared/components/ui/separator';

import { CommentContent } from './components/comment-content';
import { CommentHeader } from './components/comment-header';

export const CommentByEvent = memo(
  ({ event }: { event: NDKEvent | null | undefined }) => {
    if (event === undefined) {
      return <Spinner />;
    }

    if (event === null) {
      return <div className="px-4 py-3 text-muted-foreground">Comment not found</div>;
    }

    if (event) {
      return (
        <div className="px-4 py-1">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={event.author?.profile?.image} alt={event.author?.profile?.name} />
            </Avatar>
            <div className="flex-1 space-y-2">
              <CommentHeader event={event} />
              <CommentContent event={event} />
            </div>
          </div>
          <Separator className="my-3" />
        </div>
      );
    }
  },
  (prev, next) => prev.event?.id === next.event?.id,
);

export const CommentByNoteId = memo(
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

    return <CommentByEvent event={event} />;
  },
  (prev, next) => prev.noteId === next.noteId,
);
