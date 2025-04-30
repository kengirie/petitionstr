import { NDKEvent } from '@nostr-dev-kit/ndk';
import { SendIcon } from 'lucide-react';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import { useNewPetitionCommentWidget } from './hooks';

export const NewPetitionCommentWidget = ({ replyingToEvent }: { replyingToEvent: NDKEvent }) => {
  const { content, post, setContent, profile } = useNewPetitionCommentWidget({ replyingToEvent });

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.image} alt={profile?.name} />
        </Avatar>
      </CardHeader>
      <CardContent className="pb-2">
        <Textarea
          placeholder="Share your thoughts..."
          className="min-h-[100px] resize-none focus-visible:ring-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end items-center pt-2">
        <Button
          onClick={post}
          size="sm"
          className="gap-2"
        >
          <SendIcon size={16} />
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
};
