import { NDKEvent } from '@nostr-dev-kit/ndk';
import { HandshakeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';

import { usePetitionEndorseBtn } from './hooks';

export const PetitionEndorseBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isEndorsedByMe, endorse } = usePetitionEndorseBtn(inView ? event : undefined);
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={endorse}
      >
        <HandshakeIcon size={18} />
        <span>{isEndorsedByMe ? t('petition.detail.endorsed', '賛同済み') : t('petition.detail.endorse', '賛同する')}</span>
      </Button>
    </>
  );
};
