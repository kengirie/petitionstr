import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';

export const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div className="flex flex-col space-y-8 p-4">
      {/* ヒーローセクション - キャッチフレーズ */}
      <div className="flex flex-col items-center text-center py-12 px-4">
        <div className="text-5xl font-bold mb-6">
          {currentLanguage === 'ja' ? (
            <h1>{t('common.freedomSpeechSlogan')}</h1>
          ) : (
            <>
              <h1 className="mb-2">{t('common.freedomSpeechSlogan')}</h1>
            </>
          )}
        </div>

        <p className="text-xl max-w-2xl mb-8">{t('common.petitionstrDescription')}</p>

        <Button size="lg" className="px-10 py-6 text-lg">
          {t('common.startPetition')}
        </Button>
      </div>


    </div>
  );
};
