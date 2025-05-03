import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ZapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useActiveUser } from 'nostr-hooks';

import { Button } from '@/shared/components/ui/button';

import { ZapWidget } from '@/features/zap-widget';

import { usePetitionZapBtn } from './hooks';

export const PetitionZapBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isZapedByMe } = usePetitionZapBtn(inView ? event : undefined);
  const { t } = useTranslation();
  const { activeUser } = useActiveUser();
  const navigate = useNavigate();

  const handleZapClick = (e: React.MouseEvent) => {
    if (!activeUser) {
      e.preventDefault();
      e.stopPropagation();
      navigate('/login');
    }
  };

  return (
    <>
      <ZapWidget target={inView ? event : undefined}>
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleZapClick}
        >
          <ZapIcon size={18} className={isZapedByMe ? "text-orange-600" : ""} />
          <span>{isZapedByMe ? t('petition.detail.zapped', 'Zap済み') : t('petition.detail.zap', 'Zapする')}</span>
        </Button>
      </ZapWidget>
    </>
  );
};
