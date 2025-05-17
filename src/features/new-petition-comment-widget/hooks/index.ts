import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPetitionCommentWidget = ({
  replyingToEvent,
}: {
  replyingToEvent: NDKEvent;
}) => {
  const [content, setContent] = useState<string>('');

  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();

  const { toast } = useToast();

  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 1111;
    e.content = content;

      // const rootTag = replyingToEvent.tags.find((tag) => tag.length > 3 && tag[3] === 'root');

      // if (rootTag) {
      //   e.tags.push(['e', rootTag[1], rootTag[2] || '', 'root']);
      //   e.tags.push(['e', replyingToEvent.id, '', 'reply']);
      // } else {
      //   e.tags.push(['e', replyingToEvent.id, '', 'root']);
      // }

      // replyingToEvent.tags.forEach((tag) => {
      //   if (tag.length > 0 && tag[0] === 'p') {
      //     e.tags.push(tag);
      //   }
      // });

      // Extract the 'd' tag value

      // Top-level comments scope to event addresses or ids
      e.tags.push(['A', replyingToEvent.tagAddress(), replyingToEvent.onRelays[0]?.url || '']);
      // The root kind
      e.tags.push(['K', replyingToEvent.kind?.toString() || '']);
      // Author of root event
    e.tags.push(['P', replyingToEvent.pubkey, replyingToEvent.onRelays[0]?.url || '']);

      // The parent event address (same as root for top-level comments)
      e.tags.push(['a', replyingToEvent.tagAddress(), replyingToEvent.onRelays[0]?.url || '']);
      // When the parent event is replaceable or addressable, also include an `e` tag referencing its id
      e.tags.push(['e', replyingToEvent.id, replyingToEvent.onRelays[0]?.url || '']);
      // The parent event kind
      e.tags.push(['k', replyingToEvent.kind?.toString() || '']);
      // Author of the parent event
    e.tags.push(['p', replyingToEvent.pubkey, replyingToEvent.onRelays[0]?.url || '']);
    console.log(replyingToEvent);

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to post note',
            variant: 'destructive',
          });
        }
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Failed to post note',
          variant: 'destructive',
        });
      });
  }, [ndk, content, replyingToEvent, toast]);

  return { content, setContent, post, profile };
};
