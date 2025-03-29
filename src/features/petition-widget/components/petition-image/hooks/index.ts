import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const usePetitionImage = (event: NDKEvent) => {
  const [url, setUrl] = useState<string>();

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    try {
      // NDKEvent の tags から image タグを探す
      const imageTag = event.tags?.find(tag => tag[0] === "image");
      if (imageTag && imageTag[1]) {
        // image タグが見つかった場合、その値をセット
        setUrl(imageTag[1]);
        return;
      }

      // image タグが見つからない場合、content をパースして picture を取得
      try {
        const petitionContent = JSON.parse(event.content);
        if (petitionContent?.picture) {
          setUrl(petitionContent.picture);
          return;
        }

        // どちらも見つからない場合は undefined をセット
        setUrl(undefined);
      } catch (contentError) {
        console.error('Failed to parse petition content', contentError);
        setUrl(undefined);
      }
    } catch (e) {
      console.error('Error processing petition event', e);
      setUrl(undefined);
    }
  }, [event]);

  return { url, ref, inView };
};
