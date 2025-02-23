import { memo } from 'react';


export const PetitionDetailWidget = memo(
  ({ npub }: { npub: string | undefined }) => {
    return (
      <>

      </>
    );
  },
  (prev, next) => prev.npub === next.npub,
);
