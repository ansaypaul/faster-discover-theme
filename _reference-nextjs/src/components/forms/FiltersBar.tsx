'use client';

import { useState } from 'react';
import { FilterOption, SortOption } from '@/types';
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import FilterModal from './FilterModal';

interface FiltersBarProps {
  platforms: FilterOption[];
  genres: FilterOption[];
  sortOptions: SortOption[];
}

export default function FiltersBar({ platforms, genres, sortOptions }: FiltersBarProps) {
  const [activeModal, setActiveModal] = useState<'platforms' | 'genres' | 'sort' | null>(null);

  return (
    <>
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveModal('platforms')}
          className="flex items-center gap-2 px-4 py-2 bg-gaming-dark-card rounded-full text-sm font-medium text-white hover:bg-gaming-dark-card/80 transition-colors whitespace-nowrap"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Plateformes
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveModal('genres')}
          className="flex items-center gap-2 px-4 py-2 bg-gaming-dark-card rounded-full text-sm font-medium text-white hover:bg-gaming-dark-card/80 transition-colors whitespace-nowrap"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Genres
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveModal('sort')}
          className="flex items-center gap-2 px-4 py-2 bg-gaming-dark-card rounded-full text-sm font-medium text-white hover:bg-gaming-dark-card/80 transition-colors whitespace-nowrap ml-auto"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Trier
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>

      <FilterModal
        isOpen={activeModal === 'platforms'}
        onClose={() => setActiveModal(null)}
        title="Plateformes"
        options={platforms}
      />

      <FilterModal
        isOpen={activeModal === 'genres'}
        onClose={() => setActiveModal(null)}
        title="Genres"
        options={genres}
      />

      <FilterModal
        isOpen={activeModal === 'sort'}
        onClose={() => setActiveModal(null)}
        title="Trier par"
        options={sortOptions}
      />
    </>
  );
} 