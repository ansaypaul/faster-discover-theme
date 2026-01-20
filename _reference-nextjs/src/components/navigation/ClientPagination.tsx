'use client';

import { useState } from 'react';
import Pagination from './Pagination';

interface ClientPaginationProps {
  totalPages: number;
}

export default function ClientPagination({ totalPages }: ClientPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Plus tard, on pourra ajouter ici la logique pour charger les données de la nouvelle page
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
} 