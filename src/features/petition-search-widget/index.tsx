import { useDebounceValue } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

import { PetitionSearchResult } from './components';

export const PetitionSearchWidget = ({ children }: { children: React.ReactNode }) => {
  const [debouncedValue, setValue] = useDebounceValue('', 500);
  const { t } = useTranslation();

  return (
    <Dialog onOpenChange={(open) => !open && setValue('')}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('search.searchPetitions')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input
            id="search"
            autoComplete="off"
            placeholder={t('search.searchPlaceholder')}
            onChange={(event) => setValue(event.target.value)}
          />

          <div className="h-full max-h-80 overflow-y-auto overflow-x-hidden">
            <PetitionSearchResult input={debouncedValue} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
