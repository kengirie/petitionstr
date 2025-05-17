import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { UploadIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import MDEditor from '@uiw/react-md-editor';

import { cn } from '@/shared/utils';

import { useNewPetitionWidget } from './hooks';

export const NewPetitionWidget = () => {
  const {
    title,
    summary,
    image,
    content,
    setTitle,
    setSummary,
    setImage,
    setContent,
    post,
    isUploadingMedia,
    fileInputRef,
    openUploadMediaDialog,
    handleFileChange
  } = useNewPetitionWidget();
  const { t } = useTranslation();

  const onChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setContent(value);
    }
  }, [setContent]);

  return (
    <>
      {/* 非表示のファイル入力要素 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
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
            <div className="flex items-center space-x-2">
              <Input
                id="petition-picture"
                className="bg-background"
                placeholder={t('petition.picturePlaceholder')}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <Button
                type="button"
                variant="secondary"
                className="flex items-center"
                onClick={openUploadMediaDialog}
                disabled={isUploadingMedia}
              >
                {isUploadingMedia ? (
                  <Spinner />
                ) : (
                  <>
                    <UploadIcon className="mr-2" />
                    <span>{t('petition.uploadImage')}</span>
                  </>
                )}
              </Button>
            </div>

            {/* 画像プレビュー */}
            {image && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">{t('petition.imagePreview')}</p>
                <div className="relative w-full h-60 rounded-md border">
                  <img
                    src={image}
                    alt={t('petition.imagePreview')}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      // エラー時に代替テキストを表示
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">${t('petition.picturePlaceholder')}</div>`;
                    }}
                  />
                </div>
              </div>
            )}
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
            <div className="bg-background rounded-md" data-color-mode="light">
              <MDEditor value={content} onChange={onChange} />
            </div>
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
