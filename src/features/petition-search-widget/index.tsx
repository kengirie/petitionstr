import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';

import { PetitionSearchResult } from './components';

export const PetitionSearchWidget = () => {
  const [debouncedValue, setValue] = useDebounceValue('', 500);
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search"
          className="pl-10 focus-visible:ring-2 focus-visible:ring-primary"
          autoComplete="off"
          placeholder={t('search.searchPlaceholder')}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <div className="h-full max-h-[500px] overflow-y-auto overflow-x-hidden rounded-md border bg-background shadow-sm">
        <PetitionSearchResult input={debouncedValue} />
      </div>
    </div>
  );
};
