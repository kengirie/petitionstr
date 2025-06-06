import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { formatDistanceToNowStrict } from 'date-fns';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import {
  EllipsisIcon,
  FileJsonIcon,
  HeartIcon,
  LinkIcon,
  SquareArrowOutUpRight,
  TagIcon,
  TextIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { usePetitionFooter } from './hooks';

export const PetitionFooter = ({ event }: { event: NDKEvent }) => {
  const { copy, navigate, profile, naddr, ref } = usePetitionFooter(event);
  const isMobile = useIsMobile();

  return (
    <div className="pt-2 flex justify-between w-full" ref={ref}>
      <Avatar
        className="bg-foreground/10 hover:cursor-pointer"
        onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
      >
        <AvatarImage src={profile?.image} alt={profile?.name} className="object-cover" />
        <AvatarFallback />
      </Avatar>

      <div className="flex flex-col justify-center ml-2 min-w-0">
        <p
          className="font-semibold leading-tight hover:cursor-pointer truncate max-w-[150px]"
          onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
          title={profile?.name?.toString()}
        >
          {profile?.name?.toString()}
        </p>

        <p
          className="text-xs text-gray-500 leading-tight hover:cursor-pointer truncate max-w-[150px]"
          onClick={() => navigate(`/profile/${new NDKUser({ pubkey: event.pubkey }).npub}`)}
          title={profile?.nip05?.toString()}
        >
          {profile?.nip05?.toString()}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {!isMobile && (
          <p className="text-xs text-gray-500">
            {formatDistanceToNowStrict((event.created_at || 0) * 1000)}
          </p>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" size="icon" className="opacity-40 hover:opacity-100">
              <EllipsisIcon size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => navigate(`/petition/${naddr}`)}>
              <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
              Open
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                // TODO
              }}
            >
              <HeartIcon className="w-4 h-4 mr-2" />
              Reactions
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copy(`${window.location.origin}/petition/${naddr}`)}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Copy petition link
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copy(event.content)}>
              <TextIcon className="w-4 h-4 mr-2" />
              Copy petition text
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copy(naddr)}>
              <TagIcon className="w-4 h-4 mr-2" />
              Copy petition ID
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copy(JSON.stringify(event.rawEvent()))}>
              <FileJsonIcon className="w-4 h-4 mr-2" />
              Copy raw data
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
