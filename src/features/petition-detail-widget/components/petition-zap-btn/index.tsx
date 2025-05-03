import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ZapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';

import { ZapWidget } from '@/features/zap-widget';

import { usePetitionZapBtn } from './hooks';

export const PetitionZapBtn = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { isZapedByMe } = usePetitionZapBtn(inView ? event : undefined);
  const { t } = useTranslation();

  return (
    <>
      <ZapWidget target={inView ? event : undefined}>
        <Button
          variant="outline"
          className="flex items-center gap-1"
        >
          <ZapIcon size={18} className={isZapedByMe ? "text-orange-600" : ""} />
          <span>{isZapedByMe ? t('petition.detail.zapped', 'Zap済み') : t('petition.detail.zap', 'Zapする')}</span>
        </Button>
      </ZapWidget>
    </>
  );
};
