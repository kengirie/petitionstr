import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

export const usePetitionTitle = (event: NDKEvent) => {
  const [name, setName] = useState<string>();

  useEffect(() => {
    try {
      // NDKEvent の tags から title タグを探す
      const titleTag = event.tags?.find(tag => tag[0] === "title");
      if (titleTag && titleTag[1]) {
        // title タグが見つかった場合、その値をセット
        setName(titleTag[1]);
        return;
      }

      // title タグが見つからない場合は undefined をセット

      // どちらも見つからない場合は undefined をセット
      setName(undefined);
    } catch (e) {
      console.error('Error processing petition event', e);
      setName(undefined);
    }
  }, [event]);

  return { name };
};
