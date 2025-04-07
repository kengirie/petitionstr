import { NDKEvent, NDKRelaySet } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@/shared/components/spinner';

import { PetitionSearchResultItem } from '../petition-search-result-item';

export const PetitionSearchResult = memo(
  ({ input }: { input: string }) => {
    const [events, setEvents] = useState<NDKEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const { ndk } = useNdk();

    useEffect(() => {
      if (!ndk || !input) {
        setEvents([]);
        return;
      }

      setLoading(true);

      ndk
        .fetchEvents(
          [{ kinds: [30023], limit: 100, search: input }],
          { closeOnEose: true },
          NDKRelaySet.fromRelayUrls(['wss://relay.nostr.band'], ndk),
        )
        .then((events) => {
          setEvents([...events]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [ndk, input, setEvents, setLoading]);

    if (loading) {
      return <Spinner />;
    }

    if (events.length === 0 && input) {
      return <div className="p-4 text-center text-muted-foreground">{t('search.noPetitionsFound')}</div>;
    }

    return (
      <>
        {events.map((event) => (
          <PetitionSearchResultItem key={event.id} event={event} />
        ))}
      </>
    );
  },
  (prev, next) => prev.input === next.input,
);
