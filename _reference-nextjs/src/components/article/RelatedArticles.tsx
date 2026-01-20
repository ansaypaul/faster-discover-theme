'use client';

import { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

interface RelatedArticlesProps {
  articles?: Article[];
  articleId?: string;
  limit?: number;
}

const RelatedArticles = memo(function RelatedArticles({ articles, articleId, limit = 4 }: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>(articles || []);
  const [isLoading, setIsLoading] = useState(!articles && !!articleId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si on a déjà les articles ou pas d'articleId, on ne fait rien
    if (articles || !articleId) return;

    const fetchRelatedArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/related-articles?articleId=${articleId}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des articles reliés');
        }
        const data = await response.json();
        setRelatedArticles(data.articles);
      } catch (err) {
        console.error('Erreur chargement articles reliés:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    // Delay de 100ms pour laisser le temps à la page principale de se charger
    const timer = setTimeout(fetchRelatedArticles, 100);
    return () => clearTimeout(timer);
  }, [articleId, limit, articles]);

  if (isLoading) {
    return (
      <section className="border-t border-gaming-dark-card pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Articles similaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="relative aspect-[16/9] rounded-lg bg-gaming-dark-card mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gaming-dark-card rounded w-1/3"></div>
                <div className="h-4 bg-gaming-dark-card rounded w-4/5"></div>
                <div className="h-3 bg-gaming-dark-card rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-t border-gaming-dark-card pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Articles similaires
        </h2>
        <div className="text-gray-500 text-center py-8">
          Une erreur est survenue lors du chargement des articles similaires.
        </div>
      </section>
    );
  }

  if (relatedArticles.length === 0) return null;

  return (
    <section className="border-t border-gaming-dark-card pt-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Articles similaires
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedArticles.map((article) => (
          <Link 
            key={article.id} 
            href={`/${article.slug}`}
            className="group block"
          >
            <article>
              {/* Image */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gaming-dark-card mb-4">
                <Image
                  src={article.featuredImage.sourceUrl}
                  alt={article.featuredImage.altText}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              {/* Content */}
              <div>
                {article.categories && article.categories[0] && (
                  <span className="text-gaming-accent text-sm font-medium mb-2 block">
                    {article.categories[0].name}
                  </span>
                )}
                <h3 className="text-gray-300 group-hover:text-gaming-accent transition-colors line-clamp-2 text-base font-medium mb-2">
                  {article.title}
                </h3>
                <time dateTime={article.date} className="text-sm text-gray-400">
                  {new Date(article.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
});

export default RelatedArticles; 