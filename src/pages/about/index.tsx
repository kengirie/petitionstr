import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ExternalLink } from 'lucide-react';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-8 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('common.about')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* プロジェクト概要 */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('about.projectOverview')}</h2>
            <p className="text-muted-foreground">
              {t('common.petitionstrDescription')}
            </p>
          </div>

          {/* GitHubリポジトリ */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('about.sourceCode')}</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/kengirie/petitionstr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          {/* バグ報告 */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('about.reportBugs')}</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/kengirie/petitionstr/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('about.issueTracker')}
                </a>
              </Button>
            </div>
          </div>

          {/* 製作者 */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('about.creator')}</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link
                  to="/profile/npub1svne455wa3rctcsnnhzjn2t9pldmgfpkd4rytewzsf8he02fysxsvgwhj4"
                  className="flex items-center"
                >
                  {t('about.viewCreatorProfile')}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
