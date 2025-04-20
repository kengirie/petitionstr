import { EventPointer, NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { useRealtimeProfile } from 'nostr-hooks';
import { neventEncode } from 'nostr-tools/nip19';
import { memo, useMemo } from 'react';

import { ellipsis } from '@/shared/utils';

import { NoteByNoteId } from '@/features/note-widget';

import { usePetitionSummary } from './hooks';

export const PetitionSummary = memo(
  ({ event }: { event: NDKEvent }) => {
    const { chunks, inView, ref } = usePetitionSummary(event);

    return (
      <div ref={ref} className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {chunks.map((chunk, index) => {
          switch (chunk.type) {
            case 'text':
            case 'naddr':
              return (
                <span key={index} className="[overflow-wrap:anywhere]">
                  {chunk.content}
                </span>
              );
            case 'image':
              return (
                <img
                  key={index}
                  src={chunk.content}
                  alt="Image"
                  loading="lazy"
                  className="w-full rounded-sm"
                />
              );
            case 'video':
              return <video key={index} src={chunk.content} controls className="w-full" />;
            case 'youtube':
              return (
                <iframe
                  key={index}
                  src={`https://www.youtube.com/embed/${chunk.content}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                />
              );
            case 'url':
              return (
                <span
                  key={index}
                  className="text-blue-700 [overflow-wrap:anywhere]"
                >
                  {chunk.content}
                </span>
              );
            case 'nevent':
              if (!inView) {
                return null;
              }

              const parsedEvent = JSON.parse(chunk.content) as EventPointer;
              if (parsedEvent.kind === 1) {
                return (
                  <div className="-mx-2 py-2">
                    <NoteByNoteId key={index} noteId={parsedEvent.id} />
                  </div>
                );
              } else {
                return (
                  <span key={index} className="[overflow-wrap:anywhere]">
                    {`nostr:${neventEncode(parsedEvent)}`}
                  </span>
                );
              }
            case 'note':
              if (inView) {
                return (
                  <div className="-mx-2 py-2">
                    <NoteByNoteId key={index} noteId={chunk.content} />
                  </div>
                );
              } else {
                return null;
              }
            case 'nprofile':
            case 'npub':
              if (inView) {
                return <ProfileMention key={index} pubkey={chunk.content} />;
              } else {
                return null;
              }
            default:
              return null;
          }
        })}
      </div>
    );
  },
  (prev, next) => prev.event.id === next.event.id,
);

const ProfileMention = memo(
  ({ pubkey }: { pubkey: string }) => {
    const npub = useMemo(() => {
      return new NDKUser({ pubkey }).npub;
    }, [pubkey]);

    const { profile } = useRealtimeProfile(pubkey);

    return (
      <>
        <span className="text-purple-700">
          @{profile?.name || ellipsis(npub || '', 10)}
        </span>
      </>
    );
  },
  (prev, next) => prev.pubkey === next.pubkey,
);
