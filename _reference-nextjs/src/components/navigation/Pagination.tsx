'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gaming-dark-card text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gaming-dark-card/80 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 rounded-lg text-sm font-medium transition-colors
              ${currentPage === page
                ? 'bg-gaming-accent text-white'
                : 'bg-gaming-dark-card text-white hover:bg-gaming-dark-card/80'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gaming-dark-card text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gaming-dark-card/80 transition-colors"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 