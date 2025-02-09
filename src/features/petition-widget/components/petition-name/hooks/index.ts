import { useEffect, useState } from 'react';


export const usePetitionName = (content: string) => {
  const [name, setName] = useState<string>();

  useEffect(() => {
    let petitionContent;
    try {
      petitionContent = JSON.parse(content);
    }
    catch (e) {
      console.error('Failed to parse petition content', e);
    }
    setName(petitionContent.name);
  }, [content]);

  return { name };
};
