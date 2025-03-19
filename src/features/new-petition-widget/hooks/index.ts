import { NDKEvent, relayListFromKind3, NDKRelayList, getRelayListForUser } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useRealtimeProfile } from 'nostr-hooks';
import { useCallback, useState, useEffect } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

export const useNewPetitionWidget = () => {
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [picture, setPicture] = useState<string>('');
  const [relayList, setRelayList] = useState<string[]>([]);
  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);

  const { ndk } = useNdk();

  const { toast } = useToast();

   useEffect(() => {
    if (!ndk || !activeUser?.pubkey) return;

    const fetchRelayList = async () => {
      try {
        const userRelayList = await getRelayListForUser(activeUser.pubkey, ndk);
        if (userRelayList) {
          const relays = [
            ...userRelayList.readRelayUrls,
            ...userRelayList.writeRelayUrls,
            ...userRelayList.bothRelayUrls
          ];
          console.log(relays);
          setRelayList([...new Set(relays)]);
           console.log(relayList);
        }


      } catch (error) {
        console.error("Failed to get relay list:", error);
      }
    };

    fetchRelayList();
  }, [ndk, activeUser?.pubkey]);

  const post = useCallback(() => {
    if (!ndk || !ndk.signer) {
      return;
    }

    const e = new NDKEvent(ndk);
    e.kind = 40;
    e.content = JSON.stringify({
      name: name.trim(),
      about: about.trim(),
      picture: picture.trim(),
      relays: relayList,
    });
    console.log(activeUser?.pubkey);




    e.publish()
      .then((relaySet) => {
        if (relaySet.size === 0) {
          toast({
            title: 'Error',
            description: 'Failed to post note',
            variant: 'destructive',
          });
        } else {}
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Failed to post note',
          variant: 'destructive',
        });
      });
  }, [ndk, name, about, picture, toast]);

  return { name, about, picture, setName, setAbout, setPicture, post, profile };
};
