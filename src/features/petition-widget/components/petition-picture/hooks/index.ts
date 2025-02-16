import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';


export const usePetitionPicture = (content: string) => {
  const [url, setUrl] = useState<string>();

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    let petitionContent;
    try {
      petitionContent = JSON.parse(content);
      if (!petitionContent?.picture) {
        setUrl(undefined);
        return;
      }
      setUrl(petitionContent.picture);
    }
    catch (e) {
      console.error('Failed to parse petition content', e);
      setUrl(undefined);
    }
  }, [content]);

  return { url, ref, inView };
};
