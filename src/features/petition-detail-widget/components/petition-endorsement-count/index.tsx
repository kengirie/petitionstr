import { NDKEvent } from '@nostr-dev-kit/ndk';
import { HandshakeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePetitionEndorsementCount } from './hooks';

export const PetitionEndorsementCount = ({ event, inView }: { event: NDKEvent; inView: boolean }) => {
  const { count } = usePetitionEndorsementCount(inView ? event : undefined);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
      <HandshakeIcon size={20} className="text-primary" />
      <div>
        <div className="text-xl font-bold">{count}</div>
        <div className="text-sm text-muted-foreground">{t('petition.detail.endorsements', 'Endorsements')}</div>
      </div>
    </div>
  );
};
