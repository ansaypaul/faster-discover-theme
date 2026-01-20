'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from '../Pagination';

interface AuthorPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function AuthorPagination({ currentPage, totalPages }: AuthorPaginationProps) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const newPath = params.toString() 
      ? `${pathname}?${params.toString()}`
      : pathname;
      
    router.push(newPath);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
} 