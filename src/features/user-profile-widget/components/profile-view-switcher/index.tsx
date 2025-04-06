import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/utils';

import { ProfileView } from '../../types';

export const ProfileViewSwitcher = ({
  view,
  setView,
}: {
  view: ProfileView;
  setView: React.Dispatch<React.SetStateAction<ProfileView>>;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-y px-1">
        <Button
          onClick={() => setView('petitions')}
          size="sm"
          variant="link"
          className={cn(view == 'petitions' ? 'underline underline-offset-8' : 'hover:no-underline')}
        >
          {t('profile.petitions')}
        </Button>
        <Button
          onClick={() => setView('replies')}
          size="sm"
          variant="link"
          className={cn(view == 'replies' ? 'underline underline-offset-8' : 'hover:no-underline')}
        >
          {t('profile.replies')}
        </Button>
        <Button
          onClick={() => setView('notes')}
          size="sm"
          variant="link"
          className={cn(view == 'notes' ? 'underline underline-offset-8' : 'hover:no-underline')}
        >
          {t('profile.notes')}
        </Button>
      </div>
    </>
  );
};
