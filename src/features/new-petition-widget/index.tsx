import { NDKEvent } from '@nostr-dev-kit/ndk';
import { CornerDownRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

import { cn } from '@/shared/utils';

import { useNewPetitionWidget } from './hooks';

export const NewPetitionWidget = () => {
  const { title, summary, image, content, setTitle, setSummary, setImage, setContent, post, profile } = useNewPetitionWidget();
  const { t } = useTranslation();

  return (
    <>
      <div className="px-2">
        <div
          className={cn(
            'p-4 flex flex-col gap-4 border rounded-sm bg-primary/10 shadow-md transition-colors duration-500 ease-out hover:border-primary/30',
            '-mx-2',
          )}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="petition-name" className="text-sm font-medium">
              {t('petition.name')}
            </label>
            <Input
              id="petition-name"
              className="bg-background"
              placeholder={t('petition.namePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="petition-picture" className="text-sm font-medium">
              {t('petition.picture')}
            </label>
            <Input
              id="petition-picture"
              className="bg-background"
              placeholder={t('petition.picturePlaceholder')}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="petition-about" className="text-sm font-medium">
              {t('petition.about')}
            </label>
            <Textarea
              id="petition-about"
              className="bg-background min-h-[120px]"
              placeholder={t('petition.aboutPlaceholder')}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="petition-content" className="text-sm font-medium">
              {t('petition.content')}
            </label>
            <Textarea
              id="petition-content"
              className="bg-background min-h-[150px]"
              placeholder={t('petition.contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>


          <div className="w-full flex gap-2 justify-end">
            <Button className="px-8" size="sm" onClick={post}>
              {t('petition.post')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
