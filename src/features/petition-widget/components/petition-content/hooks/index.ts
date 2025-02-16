import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Chunk } from '../types';
import { parseChunks } from '../utils';

export const usePetitionContent = (content: string) => {
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    let petitionContent;
   try {
      petitionContent = JSON.parse(content);
      if (!petitionContent?.about) {
        setChunks([]);
        return;
      }
      setChunks(parseChunks(petitionContent.about));
    }
    catch (e) {
      console.error('Failed to parse petition content', e);
      setChunks([]);
    }
  }, [content]);

  return { chunks, ref, inView };
};
