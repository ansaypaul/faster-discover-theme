'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthorArticle } from '@/types/author';

interface AuthorArticlesProps {
  articles: AuthorArticle[];
  authorName: string;
  currentPage: number;
  totalPages: number;
}

const AuthorArticles = memo(function AuthorArticles({
  articles,
  authorName,
  currentPage,
  totalPages,
}: AuthorArticlesProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        Aucun article publié pour le moment.
      </div>
    );
  }

  return (
    <section className="border-t border-gaming-dark-card pt-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Articles de {authorName}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/${article.uri.replace(/^\//, '')}`}
            className="group block"
          >
            <article>
              {/* Image */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gaming-dark-card mb-4">
                {article.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={article.featuredImage.node.sourceUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                {article.categories?.nodes?.[0] && (
                  <span className="text-gaming-accent text-sm font-medium mb-2 block">
                    {article.categories.nodes[0].name}
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

      {totalPages > 1 && (
        <div className="mt-8">
          <nav className="flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`?page=${page}`}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? 'bg-gaming-accent text-white'
                    : 'bg-gaming-dark-card text-gray-300 hover:bg-gaming-accent/20'
                }`}
              >
                {page}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </section>
  );
});

export default AuthorArticles; 