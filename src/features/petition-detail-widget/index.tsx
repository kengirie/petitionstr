import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/shared/components/spinner';
import { NoteHeader } from '@/features/note-widget/components/note-header';
import { PetitionTitle } from '../petition-widget/components/petition-title';
import { PetitionImage } from '../petition-widget/components/petition-image';
import { PetitionSummary } from '../petition-widget/components/petition-summary';
import { usePetitionDetail } from './hooks';

export const PetitionDetailWidget = memo(
  ({ petitionId }: { petitionId: string | undefined }) => {
    const [event, setEvent] = useState<NDKEvent | null | undefined>(undefined);
    const { ndk } = useNdk();

    useEffect(() => {
      if (!ndk || !petitionId) {
        return;
      }

      ndk.fetchEvent(petitionId).then((event) => {
        setEvent(event);
      });
    }, [petitionId, ndk, setEvent]);

    if (event === undefined) {
      return <Spinner />;
    }

    if (event === null) {
      return <div className="px-2 border-b">Petition not found</div>;
    }

    return <PetitionDetail event={event} />;
  },
  (prev, next) => prev.petitionId === next.petitionId,
);

const PetitionDetail = memo(
  ({ event }: { event: NDKEvent }) => {
    const { publishedAt, content } = usePetitionDetail(event);
    const { t } = useTranslation();

    return (
      <div className="px-4 py-2 max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="text-2xl font-bold mb-1">
            <PetitionTitle event={event} />
          </div>
          {publishedAt && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('petition.detail.publishedDate')}: {new Date(publishedAt * 1000).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="mb-6">
          <PetitionImage event={event} />
        </div>

        <div className="prose dark:prose-invert max-w-none mb-6">
          <h3 className="text-xl font-semibold">{t('petition.detail.summary')}</h3>
          <PetitionSummary event={event} />
        </div>

        {content && (
          <div className="prose dark:prose-invert max-w-none mb-6">
            <h3 className="text-xl font-semibold">{t('petition.detail.content')}</h3>
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          <NoteHeader event={event} />
        </div>
      </div>
    );
  },
  (prev, next) => prev.event?.id === next.event?.id,
);
