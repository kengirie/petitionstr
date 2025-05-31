import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useActiveUser } from 'nostr-hooks';
import { memo, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/shared/components/spinner';
import { NoteHeader } from '@/features/note-widget/components/note-header';
import { PetitionTitle } from '@/features/petition-widget/components/petition-title';
import { PetitionImage } from '@/features/petition-widget/components/petition-image';
import { PetitionSummary } from '@/features/petition-widget/components/petition-summary';
import { usePetitionDetail } from './hooks';
import { NewPetitionCommentWidget } from '@/features/new-petition-comment-widget';
import { PetitionCommentsWidget } from '@/features/petition-comments-widget';
import { PetitionEndorseBtn } from './components/petition-endorse-btn';
import { PetitionEndorsementCount } from './components/petition-endorsement-count';
import { PetitionZapBtn } from './components/petition-zap-btn';
import { PetitionZapCount } from './components/petition-zap-count';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { NoteByNoteId } from '@/features/note-widget';
import { PetitionByPetitionId } from '@/features/petition-widget';
import { nip19 } from 'nostr-tools';

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
    const { activeUser } = useActiveUser();

    return (
      <div className="px-4 py-2 max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="text-2xl font-bold mb-1">
            <PetitionTitle event={event} />
          </div>
          {publishedAt && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('petition.detail.publishedDate')}:{' '}
              {new Date(publishedAt * 1000).toLocaleDateString()}
            </div>
          )}
          <div className="pt-2 mt-2">
            <NoteHeader event={event} />
          </div>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <PetitionEndorsementCount event={event} inView={true} />
              <PetitionZapCount event={event} inView={true} />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <PetitionEndorseBtn event={event} inView={true} />
              <PetitionZapBtn event={event} inView={true} />
            </div>
          </div>
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
              <MarkdownPreview
                source={content}
                rehypeRewrite={(node, _, parent) => {
                  if ((node as any).tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test((parent as any).tagName)) {
                    parent.children = parent.children.slice(1);
                  }
                }}
                components={{
                  p: ({ children }) => {
                    return <>{getComponent(children)}</>;
                  },
                  h1: ({ children }) => {
                    return <h1 dir="auto">{children}</h1>;
                  },
                  h2: ({ children }) => {
                    return <h2 dir="auto">{children}</h2>;
                  },
                  h3: ({ children }) => {
                    return <h3 dir="auto">{children}</h3>;
                  },
                  h4: ({ children }) => {
                    return <h4 dir="auto">{children}</h4>;
                  },
                  h5: ({ children }) => {
                    return <h5 dir="auto">{children}</h5>;
                  },
                  h6: ({ children }) => {
                    return <h6 dir="auto">{children}</h6>;
                  },
                  li: ({ children }) => {
                    return <li dir="auto">{children}</li>;
                  },
                }}
              />
            </div>
          </div>
        )}

        {activeUser && (
          <div className="border-t pt-4 mt-6">
            <NewPetitionCommentWidget replyingToEvent={event} />
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          <PetitionCommentsWidget event={event} />
        </div>
      </div>
    );
  },
  (prev, next) => prev.event?.id === next.event?.id,
);



// メモ化されたNostrエンベッドコンポーネント
const MemoizedNoteEmbed = memo(({ noteId, embedKey }: { noteId: string; embedKey: string }) => (
  <div key={embedKey} className="-mx-2 py-2">
    <NoteByNoteId noteId={noteId} />
  </div>
));

const MemoizedPetitionEmbed = memo(({ petitionId, embedKey }: { petitionId: string; embedKey: string }) => (
  <div key={embedKey} className="-mx-2 py-2">
    <PetitionByPetitionId petitionId={petitionId} />
  </div>
));

const MemoizedLink = memo(({ href, embedKey }: { href: string; embedKey: string }) => (
  <a key={embedKey} href={href} className="text-blue-500 hover:underline">
    {href}
  </a>
));

export const getComponent = (children: any) => {
  if (!children) return children;

  // childrenが配列の場合、各要素を処理
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return processNostrLinks(child, index);
      }
      return child;
    });
  }

  // childrenが文字列の場合、nostr:リンクを処理
  if (typeof children === 'string') {
    return processNostrLinks(children, 0);
  }

  return children;
};

// nostr:リンクを処理する関数（メモ化対応）
const processNostrLinks = (text: string, key: number) => {
  // nostr:で始まるリンクを検出する正規表現
  const nostrLinkRegex = /nostr:([a-zA-Z0-9]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = nostrLinkRegex.exec(text)) !== null) {
    // マッチ前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const nostrId = match[1];
    const embedKey = `embed-${nostrId}-${key}-${match.index}`;

    try {
      // nip19でデコードしてタイプを判定
      const decoded = nip19.decode(nostrId);

      if (decoded.type === 'note') {
        // kind1の場合はMemoizedNoteEmbedを使用
        parts.push(
          <MemoizedNoteEmbed
            key={embedKey}
            noteId={decoded.data as string}
            embedKey={embedKey}
          />
        );
      } else if (decoded.type === 'nevent') {
        const eventData = decoded.data as { id: string; kind?: number };

        if (eventData.kind === 1) {
          // kind1の場合はMemoizedNoteEmbedを使用
          parts.push(
            <MemoizedNoteEmbed
              key={embedKey}
              noteId={eventData.id}
              embedKey={embedKey}
            />
          );
        } else if (eventData.kind === 30023) {
          // kind30023の場合はMemoizedPetitionEmbedを使用
          parts.push(
            <MemoizedPetitionEmbed
              key={embedKey}
              petitionId={eventData.id}
              embedKey={embedKey}
            />
          );
        } else {
          // その他のkindの場合は通常のリンクとして表示
          parts.push(
            <MemoizedLink
              key={embedKey}
              href={match[0]}
              embedKey={embedKey}
            />
          );
        }
      } else {
        // その他のタイプは通常のリンクとして表示
        parts.push(
          <MemoizedLink
            key={embedKey}
            href={match[0]}
            embedKey={embedKey}
          />
        );
      }
    } catch (error) {
      // デコードに失敗した場合は通常のリンクとして表示
      parts.push(
        <MemoizedLink
          key={embedKey}
          href={match[0]}
          embedKey={embedKey}
        />
      );
    }

    lastIndex = nostrLinkRegex.lastIndex;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // パーツが1つだけで文字列の場合はそのまま返す
  if (parts.length === 1 && typeof parts[0] === 'string') {
    return parts[0];
  }

  // 複数のパーツがある場合はフラグメントで包む
  return <>{parts}</>;
};
