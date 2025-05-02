import { NDKEvent } from '@nostr-dev-kit/ndk';
import { HandshakeIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { usePetitionEndorseBtn } from './hooks';

export const PetitionEndorseBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isEndorsedByMe, endorse } = usePetitionEndorseBtn(inView ? event : undefined);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={endorse}
      >
        <HandshakeIcon size={18} />
        <span>{isEndorsedByMe ? '賛同済み' : '賛同する'}</span>
      </Button>
    </>
  );
};
