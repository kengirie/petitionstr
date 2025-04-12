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

      // title タグが見つからない場合は content をパースして name を取得
      try {
        const petitionContent = JSON.parse(event.content);
        if (petitionContent?.name) {
          setName(petitionContent.name);
          return;
        }
      } catch (contentError) {
        console.error('Failed to parse petition content', contentError);
      }

      // どちらも見つからない場合は undefined をセット
      setName(undefined);
    } catch (e) {
      console.error('Error processing petition event', e);
      setName(undefined);
    }
  }, [event]);

  return { name };
};
