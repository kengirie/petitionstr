import { NDKEvent, NDKKind, zapInvoiceFromEvent } from '@nostr-dev-kit/ndk';
import { useSubscription } from 'nostr-hooks';
import { useEffect, useMemo } from 'react';

export const usePetitionZapCount = (event: NDKEvent | undefined) => {
  const subId = event ? `petition-zaps-${event.id}` : undefined;

  const { createSubscription, events } = useSubscription(subId);

  const count = useMemo(() => events?.length || 0, [events]);

  const totalAmount = useMemo(
    () =>
      events?.reduce((acc, e) => acc + Math.floor(zapInvoiceFromEvent(e)?.amount || 0) / 1000, 0) ||
      0,
    [events],
  );

  useEffect(() => {
    event &&
      createSubscription({
        filters: [{ kinds: [NDKKind.Zap], '#e': [event.id], limit: 1000 }],
        opts: { groupableDelay: 500 },
      });
  }, [createSubscription, event]);

  return { count, totalAmount };
};
