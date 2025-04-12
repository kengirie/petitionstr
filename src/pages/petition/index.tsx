import { useParams } from 'react-router-dom';


import { PetitionDetailWidget } from "@/features/petition-detail-widget";

export const PetitionPage = () => {
    const { petitionId } = useParams();


  return (
        <div className="pt-2 h-full w-full overflow-y-auto">
      <PetitionDetailWidget petitionId={petitionId} />
</div>
  );
};
