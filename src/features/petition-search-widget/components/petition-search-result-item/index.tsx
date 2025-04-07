import { NDKEvent } from '@nostr-dev-kit/ndk';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';

export const PetitionSearchResultItem = memo(
  ({ event }: { event: NDKEvent }) => {
    const navigate = useNavigate();

    const petitionData = useMemo(() => {
      try {
        // タグからデータを取得
        const titleTag = event.tags.find(tag => tag[0] === 'title');
        const summaryTag = event.tags.find(tag => tag[0] === 'summary');
        const imageTag = event.tags.find(tag => tag[0] === 'image');

        return {
          title: titleTag ? titleTag[1] : '無題の請願',
          summary: summaryTag ? summaryTag[1] : '',
          image: imageTag ? imageTag[1] : '',
          content: event.content || ''
        };
      } catch (e) {
        return {
          title: '無題の請願',
          summary: '',
          image: '',
          content: ''
        };
      }
    }, [event.tags, event.content]);

    const handleClick = () => {
      navigate(`/petition/${event.id}`);
    };

    return (
      <div
        className="p-4 border-b flex items-center gap-3 hover:cursor-pointer hover:bg-secondary"
        onClick={handleClick}
      >
        {petitionData.image && (
          <Avatar className="h-12 w-12 rounded-md bg-secondary">
            <AvatarImage src={petitionData.image} alt={petitionData.title} className="object-cover" />
          </Avatar>
        )}

        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate">{petitionData.title}</div>
          {petitionData.summary && (
            <div className="text-sm text-muted-foreground line-clamp-2">{petitionData.summary}</div>
          )}
        </div>
      </div>
    );
  },
  (prev, next) => prev.event.id === next.event.id
);
