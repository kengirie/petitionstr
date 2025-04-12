import { NDKEvent } from '@nostr-dev-kit/ndk';
import { usePetitionTitle } from './hooks';


export const PetitionTitle = ({ event }: { event: NDKEvent }) => {
  const { name } = usePetitionTitle(event);

  return (
    <div className="text-xl font-bold mb-1">{name}</div>
  );
};
