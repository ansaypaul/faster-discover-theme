'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Article } from '@/types';

interface ArticleHeaderProps {
  article: Article;
}

const ArticleHeader = memo(function ArticleHeader({ article }: ArticleHeaderProps) {

  // Ensure we have required fields or provide defaults
  const {
    title,
    date,
    categories,
    author = {
      name: 'World of Geeks',
      avatar: {
        url: '/images/default-avatar.jpg'
      }
    },
    readTime,
    featuredImage
  } = article;

  return (
    <header className="mb-8">
      {/* Category */}
      {categories && categories[0] && (
        <Link 
          href={`/${categories[0].slug}`}
          className="inline-block text-gaming-accent hover:text-gaming-accent/80 font-medium text-sm mb-4 transition-colors"
        >
          {categories[0].name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      
      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
        {author.slug ? (
          <Link 
            href={`/author/${author.slug}`}
            className="flex items-center gap-2 text-gray-300 hover:text-gaming-accent transition-colors"
          >
            {author.avatar?.url && (
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="font-medium">{author.name}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-gray-300">
            {author.avatar?.url && (
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="font-medium">{author.name}</span>
          </div>
        )}
        <time dateTime={date} className="text-gray-400">
          {new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
        {readTime && (
          <span className="text-gray-400">
            {readTime} min de lecture
          </span>
        )}
      </div>

      {/* Featured Image */}
      <div className="relative rounded-xl overflow-hidden bg-gaming-dark-card">
        {featuredImage?.sourceUrl ? (
          <Image
            src={featuredImage.sourceUrl}
            alt={featuredImage.altText || title}
            width={964}
            height={542}
            priority={true}
            fetchPriority="high"
            className="object-contain w-full h-auto mx-auto"
            sizes="(min-width: 1024px) 956px, (min-width: 768px) 708px, calc(100vw - 32px)"
            quality={90}
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gaming-dark-card">
            <span className="text-gray-500 text-sm">Image non disponible</span>
          </div>
        )}
      </div>
    </header>
  );
});

export default ArticleHeader; 