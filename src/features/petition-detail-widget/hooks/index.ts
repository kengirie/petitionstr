import { useEffect, useState } from 'react';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export const usePetitionDetail = (event: NDKEvent) => {
  const [publishedAt, setPublishedAt] = useState<number | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      // published_at タグを探す
      const publishedAtTag = event.tags?.find(tag => tag[0] === "published_at");
      if (publishedAtTag && publishedAtTag[1]) {
        // published_at タグが見つかった場合、その値をセット
        setPublishedAt(parseInt(publishedAtTag[1], 10));
      } else {
        // タグが見つからない場合は created_at を使用
        setPublishedAt(event.created_at);
      }

      // content を設定
      setContent(event.content);
    } catch (e) {
      console.error('Error processing petition event details', e);
      setPublishedAt(undefined);
      setContent(undefined);
    }
  }, [event]);

  return { publishedAt, content };
};
