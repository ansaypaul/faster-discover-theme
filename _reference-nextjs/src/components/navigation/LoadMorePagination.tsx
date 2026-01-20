'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMorePaginationProps {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export default function LoadMorePagination({ 
  hasNextPage, 
  loading, 
  onLoadMore 
}: LoadMorePaginationProps) {
  if (!hasNextPage) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">✅ Tous les articles ont été chargés.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Button
        onClick={onLoadMore}
        disabled={loading}
        className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          'Charger plus d\'articles'
        )}
      </Button>
    </div>
  );
}
