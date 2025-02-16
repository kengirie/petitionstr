import { useEffect, useState } from 'react';


export const usePetitionName = (content: string) => {
  const [name, setName] = useState<string>();

  useEffect(() => {
    let petitionContent;
     try {
      petitionContent = JSON.parse(content);
      if (!petitionContent?.name) {
        setName(undefined);
        return;
      }
      setName(petitionContent.name);
    }
    catch (e) {
      console.error('Failed to parse petition content', e);
      setName(undefined);
    }
  }, [content]);

  return { name };
};
