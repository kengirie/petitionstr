import { NDKUser } from '@nostr-dev-kit/ndk';
import { useRealtimeProfile } from 'nostr-hooks';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ellipsis } from '@/shared/utils';
import { NoteByNoteId } from '@/features/note-widget';
import { PetitionByPetitionId } from '@/features/petition-widget';

interface NostrLinkProps {
  href?: string;
  className?: string;
  'data-nostr-type'?: string;
  'data-nostr-id'?: string;
  'data-nostr-kind'?: string;
  'data-nostr-pubkey'?: string;
  'data-original'?: string;
  children?: React.ReactNode;
}

export const NostrLink = memo(({ className, ...props }: NostrLinkProps) => {
  const nostrType = props['data-nostr-type'];
  const nostrId = props['data-nostr-id'];
  const nostrKind = props['data-nostr-kind'];
  const nostrPubkey = props['data-nostr-pubkey'];
  const originalText = props['data-original'];

  // Only handle nostr links, pass through regular links
  if (!nostrType || !className?.includes('nostr-link')) {
    return (
      <a href={props.href} className={className}>
        {props.children}
      </a>
    );
  }

  // Handle different nostr types
  switch (nostrType) {
    case 'note':
      if (nostrId) {
        return (
          <div className="-mx-2 py-2">
            <NoteByNoteId noteId={nostrId} />
          </div>
        );
      }
      break;

    case 'npub':
    case 'nprofile':
      if (nostrPubkey) {
        return <ProfileMention pubkey={nostrPubkey} />;
      }
      break;

    case 'nevent':
      if (nostrId) {
        if (nostrKind === '30023') {
          return (
            <div className="-mx-2 py-2">
              <PetitionByPetitionId petitionId={nostrId} />
            </div>
          );
        } else if (nostrKind === '1') {
          return (
            <div className="-mx-2 py-2">
              <NoteByNoteId noteId={nostrId} />
            </div>
          );
        }
      }
      // For other kinds, fall through to regular link
      break;

    case 'naddr':
      // Handle as regular link for now
      break;
  }

  // Fallback: render as regular link or text
  if (originalText) {
    return (
      <a href={props.href} className={className}>
        {originalText}
      </a>
    );
  }

  return (
    <a href={props.href} className={className}>
      {props.children}
    </a>
  );
});

NostrLink.displayName = 'NostrLink';

const ProfileMention = memo(
  ({ pubkey }: { pubkey: string }) => {
    const npub = useMemo(() => {
      return new NDKUser({ pubkey }).npub;
    }, [pubkey]);

    const { profile } = useRealtimeProfile(pubkey);

    return (
      <Link to={`/profile/${npub}`} className="text-purple-700 hover:underline">
        @{profile?.name || ellipsis(npub || '', 10)}
      </Link>
    );
  },
  (prev, next) => prev.pubkey === next.pubkey,
);

ProfileMention.displayName = 'ProfileMention';
