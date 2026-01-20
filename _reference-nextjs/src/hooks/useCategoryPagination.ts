'use client';

import { useState, useCallback } from 'react';
import { Article } from '@/types';

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

interface UseCategoryPaginationParams {
  initialArticles: Article[];
  initialPageInfo: PageInfo;
  categorySlug: string;
}

export function useCategoryPagination({
  initialArticles,
  initialPageInfo,
  categorySlug
}: UseCategoryPaginationParams) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || loading) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/category-pagination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: categorySlug,
          after: pageInfo.endCursor,
          first: 12
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch more articles');
      }

      const data = await response.json();
      
      // Ajouter les nouveaux articles à la liste existante
      setArticles(prev => [...prev, ...data.articles]);
      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [pageInfo.hasNextPage, pageInfo.endCursor, categorySlug, loading]);

  return {
    articles,
    pageInfo,
    loading,
    loadMore
  };
}
