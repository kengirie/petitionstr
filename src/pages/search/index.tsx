import { useTranslation } from 'react-i18next';

import { PetitionSearchWidget } from '@/features/petition-search-widget';

export const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('search.searchPetitions')}</h1>
      <PetitionSearchWidget />
    </div>
  );
};

export default SearchPage;
