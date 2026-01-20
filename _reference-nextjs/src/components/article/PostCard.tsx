"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { Article } from '@/types';
import SafeHtml from '@/components/common/SafeHtml';

interface PostCardProps {
  post: Article;
  layout?: 'hero' | 'side' | 'news';
  priority?: boolean;
}

const PostCard = memo(function PostCard({ post, layout = 'news', priority = false }: PostCardProps) {

  // Ensure we have required fields or provide defaults
  const {
    title = 'Article sans titre',
    slug = '',
    excerpt = '',
    date = new Date().toISOString(),
    featuredImage = {
      sourceUrl: '/images/placeholder.jpg',
      altText: 'Image non disponible'
    },
    author = {
      name: 'Auteur inconnu'
    }
  } = post;

  // Dimensions prédéfinies pour éviter le CLS
  const imageDimensions = {
    hero: { width: 1200, height: 675 },
    side: { width: 160, height: 90 },
    news: { width: 384, height: 216 }
  }[layout];

  if (!slug) {
    return null; // Don't render cards without a slug
  }

  if (layout === 'hero') {
    return (
      <Link 
        href={`/${slug}`}
        className="group block relative overflow-hidden rounded-xl bg-gaming-dark-card min-h-[400px]"
      >
        <div className="relative h-[400px] overflow-hidden">
          <Image 
            src={featuredImage.sourceUrl} 
            alt={featuredImage.altText || title}
            {...imageDimensions}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            className="object-cover"
            sizes="(min-width: 1280px) 800px, (min-width: 1024px) 640px, (min-width: 768px) 700px, calc(100vw - 32px)"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-gaming-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <SafeHtml
              html={excerpt}
              as="div"
              className="text-gray-300 text-sm line-clamp-2 block sm:block sm:min-h-[40px] mb-2"
            />
            <div className="flex items-center text-xs text-gray-400">
              <span>{author.name}</span>
              <span className="mx-2">•</span>
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (layout === 'side') {
    return (
      <Link 
        href={`/${slug}`}
        className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors min-h-[90px]"
      >
        <div className="flex">
          <div className="w-[160px] h-[90px] flex-shrink-0 relative">
            <Image 
              src={featuredImage.sourceUrl} 
              alt={featuredImage.altText || title}
              {...imageDimensions}
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="p-2 sm:p-3 flex-1 min-w-0">
            <h4 className="text-white text-xs sm:text-sm font-semibold line-clamp-2 group-hover:text-gaming-accent transition-colors min-h-[32px]">
              {title}
            </h4>
            <time dateTime={date} className="mt-1 text-xs text-gray-400 block">
              {new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </Link>
    );
  }

  // Default news layout
  return (
    <Link 
      href={`/${slug}`}
      className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors min-h-[216px]"
    >
      <div className="relative aspect-video">
        <Image 
            src={featuredImage.sourceUrl} 
            alt={featuredImage.altText || title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 768px) 350px, calc(100vw - 32px)"
            loading="lazy"
            quality={80}
          />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-gaming-accent transition-colors line-clamp-2 min-h-[56px]">
          {title}
        </h3>
        <SafeHtml
          html={excerpt}
          as="div"
          className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-[40px]"
        />
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{author.name}</span>
          <time dateTime={date}>
            {new Date(date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </Link>
  );
});

export default PostCard; 