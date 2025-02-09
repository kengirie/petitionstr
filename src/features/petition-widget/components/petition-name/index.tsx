import { useEffect, useState } from 'react';
import { EventPointer, NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { usePetitionName } from './hooks';


export const PetitionName = ({ event }: { event: NDKEvent }) => {
  const { name } = usePetitionName(event.content);

  return (
    <div className="text-2xl font-bold">{name}</div>
  );
};
