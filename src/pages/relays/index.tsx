import { useTranslation } from 'react-i18next';

import { RelaysWidget } from '@/features/relays-widget';

export const RelaysPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('relays.title')}</h1>
        <p className="text-muted-foreground">{t('relays.description')}</p>
      </div>

      <RelaysWidget />
    </div>
  );
};
