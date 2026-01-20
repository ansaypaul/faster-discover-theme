'use client';

import { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useCategoryPagination } from '@/hooks/useCategoryPagination';
import LoadMorePagination from '@/components/navigation/LoadMorePagination';

interface CategoryBlockProps {
  initialArticles: Article[];
  initialPageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
  };
  categorySlug: string;
}

export default function CategoryBlock({ 
  initialArticles, 
  initialPageInfo, 
  categorySlug 
}: CategoryBlockProps) {
  const { articles, pageInfo, loading, loadMore } = useCategoryPagination({
    initialArticles,
    initialPageInfo,
    categorySlug
  });

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucun article disponible dans cette catégorie.</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.map((article, index) => {
          // Les 2 premiers articles sont dans le viewport, on optimise leur chargement
          const isPriority = index < 2;
          
          return (
            <Link 
              key={article.id}
              href={`/${article.slug}`}
              className="group"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={article.featuredImage?.sourceUrl || '/images/placeholder.jpg'}
                  alt={article.featuredImage?.altText || article.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 310px, (min-width: 768px) 350px, calc(100vw - 32px)"
                  priority={isPriority}
                  fetchPriority={isPriority ? "high" : undefined}
                  quality={80}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-white group-hover:text-gaming-accent transition-colors font-semibold line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDate(article.date)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <LoadMorePagination
        hasNextPage={pageInfo.hasNextPage}
        loading={loading}
        onLoadMore={loadMore}
      />
    </section>
  );
} 