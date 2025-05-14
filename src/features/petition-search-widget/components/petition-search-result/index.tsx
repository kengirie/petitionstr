import { NDKEvent, NDKRelaySet } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';

import { PetitionSearchResultItem } from '../petition-search-result-item/index';

export const PetitionSearchResult = memo(
  ({ input }: { input: string }) => {
    const [events, setEvents] = useState<NDKEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const { t } = useTranslation();

    const { ndk } = useNdk();

    const fetchEvents = (limit = 20) => {
      if (!ndk || !input) {
        setEvents([]);
        setHasMore(false);
        return;
      }

      setLoading(true);

      ndk
        .fetchEvents(
          [{ kinds: [30023], limit: limit, search: input }],
          { closeOnEose: true },
          NDKRelaySet.fromRelayUrls(['wss://search.nos.today/'], ndk),
        )
        .then((fetchedEvents) => {
          const eventsArray = [...fetchedEvents];
          setEvents(eventsArray);
          setHasMore(eventsArray.length >= limit);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const loadMore = (additionalLimit = 20) => {
      if (!ndk || !input) return;

      setLoading(true);

      ndk
        .fetchEvents(
          [{ kinds: [30023], limit: events.length + additionalLimit, search: input }],
          { closeOnEose: true },
          NDKRelaySet.fromRelayUrls(['wss://search.nos.today/'], ndk),
        )
        .then((fetchedEvents) => {
          const eventsArray = [...fetchedEvents];
          setEvents(eventsArray);
          setHasMore(eventsArray.length >= events.length + additionalLimit);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchEvents();
    }, [ndk, input]);

    return (
      <div className="w-full">
        {loading && events.length === 0 ? (
          <Spinner />
        ) : events.length > 0 ? (
          <div className="pt-2 flex flex-col gap-2">
            {events.map((event) => (
              <PetitionSearchResultItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          input && (
            <div className="pt-2 px-2">
              <p className="text-center text-muted-foreground">{t('search.noPetitionsFound')}</p>
            </div>
          )
        )}

        {hasMore && (
          <div className="py-4 flex justify-center">
            <Button variant="secondary" onClick={() => loadMore(20)} className="w-full">
              {t('common.loadMore')}
            </Button>
          </div>
        )}
      </div>
    );
  },
  (prev, next) => prev.input === next.input,
);
