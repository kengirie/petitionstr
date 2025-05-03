import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ZapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePetitionZapCount } from './hooks';

export const PetitionZapCount = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { totalAmount } = usePetitionZapCount(inView ? event : undefined);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
      <ZapIcon size={20} className="text-orange-600" />
      <div>
        <div className="text-xl font-bold">{t('petition.detail.zapsCount', { count: totalAmount })}</div>
        <div className="text-sm text-muted-foreground">{t('petition.detail.zaps', 'Zaps')}</div>
      </div>
    </div>
  );
};
