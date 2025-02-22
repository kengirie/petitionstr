import { useActiveUser } from 'nostr-hooks';

import { PetitionsFeedWidget } from '@/features/petitions-feed-widget';

export const PetitionsPage = () => {
  const { activeUser } = useActiveUser();

  return (
    <>
        <PetitionsFeedWidget />
    </>
  );
};
