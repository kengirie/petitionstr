import { useActiveUser } from 'nostr-hooks';

import { PetitionsFeedWidget } from '@/features/petitions-feed-widget';

export const PetitionsPage = () => {
  const { activeUser } = useActiveUser();

  return (
    <>
      {activeUser ? (
        <PetitionsFeedWidget />
      ) : (
        <div className="flex flex-col h-full w-full items-center justify-center">
          <h3>Welcome to Nostribe!</h3>
          <p>Log-in to view and create notes</p>
        </div>
      )}
    </>
  );
};
