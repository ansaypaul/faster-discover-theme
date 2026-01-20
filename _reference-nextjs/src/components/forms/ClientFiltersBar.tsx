'use client';

import FiltersBar from './FiltersBar';
import { FilterOption, SortOption } from '@/types';

interface ClientFiltersBarProps {
  platforms: FilterOption[];
  genres: FilterOption[];
  sortOptions: SortOption[];
}

export default function ClientFiltersBar(props: ClientFiltersBarProps) {
  return <FiltersBar {...props} />;
} 