import { useEffect, useState } from 'react';
import { EventPointer, NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { usePetitionTitle } from './hooks';


export const PetitionTitle = ({ event }: { event: NDKEvent }) => {
  const { name } = usePetitionTitle(event);

  return (
    <div className="text-2xl font-bold">{name}</div>
  );
};
