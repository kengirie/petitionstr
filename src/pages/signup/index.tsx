import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Muted } from '@/shared/components/ui/typography/muted';

import { useLoginWidget } from '@/features/login-widget/hooks';

export const SignupPage = () => {
  const { t } = useTranslation();
  const {
    loading,
    nsecInput,
    setNsecInput,
    handlePrivateKeySigner,
    handlePrivateKeyGenerate,
  } = useLoginWidget();

  return (
    <div className="max-w-[475px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('auth.signUp')}</h1>

      <div className="mt-4 text-center">
        <Muted>
          <span>{t('auth.createNewAccount')}</span>
        </Muted>
      </div>

      <div className="mt-6">
        <Label>{t('auth.yourNewSecretKey')}</Label>
        <Input
          className="mt-2"
          placeholder="nsec..."
          value={nsecInput}
          onChange={(e) => setNsecInput(e.target.value)}
          readOnly
        />

        <Button
          className="mt-4 w-full"
          onClick={handlePrivateKeyGenerate}
        >
          {t('auth.generateNewKey')}
        </Button>

        <Button
          className="mt-4 w-full"
          disabled={!nsecInput || loading}
          onClick={handlePrivateKeySigner}
        >
          {loading ? <Loader2 className="animate-spin" /> : t('auth.signUpWithKey')}
        </Button>

        <div className="mt-6 text-center">
          <Muted>
            <span>⚠️ {t('auth.saveKeyWarning')}</span>
            <br />
            <span>{t('auth.onlyAccessWay')}</span>
          </Muted>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p>
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};
