import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

export const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{t('common.pageNotFound')}</p>
      <Button asChild>
        <Link to="/">{t('common.backToHome')}</Link>
      </Button>
    </div>
  );
};
