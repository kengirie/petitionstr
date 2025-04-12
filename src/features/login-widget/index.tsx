import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Muted } from '@/shared/components/ui/typography/muted';

import { useLoginWidget } from './hooks';

// Check out the `example-components` folder to see how to use this component

export const LoginWidget = () => {
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
    handlePrivateKeyGenerate,
    isModalOpen,
    setIsModalOpen,
  } = useLoginWidget();

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <DialogTrigger asChild>
          <Button className="w-full">{t('auth.loginSignUp')}</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[475px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('auth.loginSignUp')}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="w-full">
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-full">
                {t('auth.signUp')}
              </TabsTrigger>
            </TabsList>

            <div className="pt-2">
              {/* Login Tab */}
              <TabsContent value="login" tabIndex={-1} className="h-[290px] overflow-hidden px-2 w-full">
                <Tabs defaultValue="remote-signer" className="mt-2">
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

                  <div className="pt-2">
                    <TabsContent value="extension" tabIndex={-1} className="h-[200px] px-1 w-full">
                      <div className="mt-4" />
                      <Button className="w-full" disabled={loading} onClick={handleExtensionSigner}>
                        {loading ? <Loader2 className="animate-spin" /> : t('auth.loginWithExtension')}
                      </Button>
                      <div className="mt-2 text-center">
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

                    <TabsContent value="remote-signer" tabIndex={-1} className="h-[200px] px-1 w-full">
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
                      <div className="mt-2 text-center">
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

                    <TabsContent value="secret-key" tabIndex={-1} className="h-[200px] px-1 w-full">
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
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" tabIndex={-1} className="px-2 w-full overflow-hidden h-[290px]">
                <div className="mt-4 text-center">
                  <Muted>
                    <span>{t('auth.createNewAccount')}</span>
                  </Muted>
                </div>

                <div className="mt-4">
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

                  <div className="mt-4 text-center">
                    <Muted>
                      <span>⚠️ {t('auth.saveKeyWarning')}</span>
                      <br />
                      <span>{t('auth.onlyAccessWay')}</span>
                    </Muted>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
