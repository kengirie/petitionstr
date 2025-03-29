import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Chunk } from '../types';
import { parseChunks } from '../utils';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export const usePetitionSummary = (event: NDKEvent) => {
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    try {
      // NDKEvent の tags から summary タグを探す
      const summaryTag = event.tags?.find(tag => tag[0] === "summary");
      if (summaryTag && summaryTag[1]) {
        // summary タグが見つかった場合、その値を使用
        setChunks(parseChunks(summaryTag[1]));
        return;
      }
      // どちらも見つからない場合は空の配列をセット
      setChunks([]);
    } catch (e) {
      console.error('Error processing petition event', e);
      setChunks([]);
    }
  }, [event]);

  return { chunks, ref, inView };
};
