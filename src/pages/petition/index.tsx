import { useActiveUser } from 'nostr-hooks';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/shared/components/spinner';

import { PetitionDetailWidget } from "@/features/petition-detail-widget";
import { PetitionByPetitionId } from '@/features/petition-widget';

export const PetitionPage = () => {
    const { petitionId } = useParams();


  return (
        <div className="pt-2 h-full w-full overflow-y-auto">
      <PetitionDetailWidget petitionId={petitionId} />
</div>
  );
};
