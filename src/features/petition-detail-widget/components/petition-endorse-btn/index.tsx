import { NDKEvent } from '@nostr-dev-kit/ndk';
import { HandshakeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useActiveUser } from 'nostr-hooks';

import { Button } from '@/shared/components/ui/button';

import { usePetitionEndorseBtn } from './hooks';

export const PetitionEndorseBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isEndorsedByMe, endorse } = usePetitionEndorseBtn(inView ? event : undefined);
  const { t } = useTranslation();
  const { activeUser } = useActiveUser();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!activeUser) {
      navigate('/login');
      return;
    }
    endorse();
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={handleClick}
      >
        <HandshakeIcon size={18} />
        <span>{isEndorsedByMe ? t('petition.detail.endorsed', '賛同済み') : t('petition.detail.endorse', '賛同する')}</span>
      </Button>
    </>
  );
};
