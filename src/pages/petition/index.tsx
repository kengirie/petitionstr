import { useActiveUser } from 'nostr-hooks';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/shared/components/spinner';

import { PetitionDetailWidget } from "@/features/petition-detail-widget";

export const PetitionPage = () => {

    const { npub } = useParams();

    const { activeUser } = useActiveUser();

    if (activeUser === undefined) {
      return <Spinner />;
    }

    if (activeUser === null) {
      return (
        <div className="flex flex-col h-full w-full items-center justify-center">
          <h3>Please Login</h3>
        </div>
      );
    }

  return (
    <>
      <PetitionDetailWidget npub={npub} />

    </>
  );
};
