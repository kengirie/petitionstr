import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Muted } from '@/shared/components/ui/typography/muted';

import { useLoginWidget } from '@/features/login-widget/hooks';

export const LoginPage = () => {
  const { t } = useTranslation();
  const {
    loading,
    nip46Input,
    setNip46Input,
    nsecInput,
    setNsecInput,
    handleRemoteSigner,
    handleExtensionSigner,
    handlePrivateKeySigner,
  } = useLoginWidget();

  return (
    <div className="max-w-[475px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('auth.login')}</h1>

      <Tabs defaultValue="extension" className="mt-2">
        <TabsList className="w-full">
          <TabsTrigger value="extension" className="w-full">
            {t('auth.extension')}
          </TabsTrigger>
          <TabsTrigger value="remote-signer" className="w-full">
            {t('auth.remoteSigner')}
          </TabsTrigger>
          <TabsTrigger value="secret-key" className="w-full">
            {t('auth.secretKey')}
          </TabsTrigger>
        </TabsList>

        <div className="pt-4">
          <TabsContent value="extension" tabIndex={-1} className="px-1 w-full">
            <div className="mt-4" />
            <Button className="w-full" disabled={loading} onClick={handleExtensionSigner}>
              {loading ? <Loader2 className="animate-spin" /> : t('auth.loginWithExtension')}
            </Button>
            <div className="mt-4 text-center">
              <Muted>
                <span>{t('auth.dontHaveExtension')}</span>
                <br />
                <span>{t('auth.getYoursFrom')} </span>
                <Button variant="link" className="p-0 text-blue-600" asChild>
                  <a
                    href="https://github.com/fiatjaf/nos2x"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nos2x
                  </a>
                </Button>
                {' or '}
                <Button variant="link" className="p-0 text-blue-600" asChild>
                  <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">
                    Alby
                  </a>
                </Button>
              </Muted>
            </div>
          </TabsContent>

          <TabsContent value="remote-signer" tabIndex={-1} className="px-1 w-full">
            <Label>{t('auth.yourNip05Address')}</Label>
            <Input
              className="mt-2"
              placeholder="you@nsec.app"
              value={nip46Input}
              onChange={(e) => setNip46Input(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRemoteSigner()}
            />
            <Button className="mt-4 w-full" disabled={loading} onClick={handleRemoteSigner}>
              {loading ? <Loader2 className="animate-spin" /> : t('auth.loginWithRemoteSigner')}
            </Button>
            <div className="mt-4 text-center">
              <Muted>
                <span>{t('auth.dontHaveRemoteSigner')}</span>
                <br />
                <span>{t('auth.setUpYoursAt')} </span>
                <Button variant="link" className="p-0 text-blue-600" asChild>
                  <a href="https://nsec.app" target="_blank" rel="noopener noreferrer">
                    nsec.app
                  </a>
                </Button>
              </Muted>
            </div>
          </TabsContent>

          <TabsContent value="secret-key" tabIndex={-1} className="px-1 w-full">
            <Label>{t('auth.yourSecretKey')}</Label>
            <Input
              className="mt-2"
              placeholder="nsec..."
              value={nsecInput}
              onChange={(e) => setNsecInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePrivateKeySigner()}
            />
            <Button className="mt-4 w-full" disabled={loading} onClick={handlePrivateKeySigner}>
              {loading ? <Loader2 className="animate-spin" /> : t('auth.loginWithSecretKey')}
            </Button>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-8 text-center">
        <p>
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
};
