import { NDKEvent, relayListFromKind3, NDKRelayList, getRelayListForUser } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState, useEffect } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPetitionWidget = () => {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [image, setImage] = useState<string>('');
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
    e.kind = 30023;
    e.content = content;

    // タグを設定
    e.tags = [
      ["title", title],
      ["published_at", Math.floor(Date.now() / 1000).toString()],
      ["summary", summary],
      ["image", image],
    ];

    console.log(activeUser?.pubkey);

    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to post petition',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Petition posted successfully',
          });
          // 投稿成功後にフィールドをクリア
          setTitle('');
          setSummary('');
          setImage('');
          setContent('');
        }
      })
      .catch((error) => {
        console.error('Failed to post petition:', error);
        toast({
          title: 'Error',
          description: 'Failed to post petition',
          variant: 'destructive',
        });
      });
  }, [ndk, title, summary, image, content, toast, setTitle, setSummary, setImage, setContent]);

  return { title, summary, image, content, setTitle, setSummary, setImage, setContent, post, profile };
};
