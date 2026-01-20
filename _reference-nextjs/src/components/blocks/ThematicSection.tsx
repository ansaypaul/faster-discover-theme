"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Article } from '@/types';
import SafeHtml from '@/components/common/SafeHtml';

interface ThematicSectionProps {
  title: string;
  articles: Article[];
  categoryLink?: string;
}

const DEFAULT_ARTICLE_IMAGE = "/images/article-placeholder.jpg";

const ThematicSection = ({ title, articles, categoryLink }: ThematicSectionProps) => {
  if (!articles?.length) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white border-l-4 border-gaming-accent pl-4">
            {title}
          </h2>
        </div>
        <div className="bg-gaming-dark-card rounded-lg p-6 text-center text-gray-400">
          Aucun article disponible pour le moment
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-gaming-accent pl-4">
          {title}
        </h2>
        {categoryLink && (
          <Link 
            href={categoryLink}
            className="flex items-center text-gaming-accent hover:text-gaming-accent/80 transition-colors text-sm"
          >
            Voir plus
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {articles.map((article) => (
          <Link 
            key={article.id}
            href={`/${article.slug}`}
            className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors duration-300"
          >
            <div className="relative h-32 overflow-hidden">
              <Image 
                src={article.featuredImage?.sourceUrl || DEFAULT_ARTICLE_IMAGE}
                alt={article.featuredImage?.altText || article.title || 'Article'}
                fill
                className="object-cover"
              />
              {article.categories?.[0] && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gaming-primary text-white px-2 py-1 rounded text-xs font-medium">
                    {article.categories[0].name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-gaming-accent transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <SafeHtml
                  html={article.excerpt}
                  as="div"
                  className="text-gray-400 text-xs mt-1 line-clamp-1"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ThematicSection; 