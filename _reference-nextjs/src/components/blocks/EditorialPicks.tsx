"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Article } from '@/types';
import CategoryBadge from '@/components/category/CategoryBadge'; // eslint-disable-line @typescript-eslint/no-unused-vars
import SafeHtml from '@/components/common/SafeHtml';

interface EditorialPicksProps {
  title?: string;
  articles: Article[];
}

const EditorialPicks = ({ title = "Le top de la rédac", articles }: EditorialPicksProps) => {
  if (!articles?.length) {
    return null;
  }

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-gaming-accent mr-2" />
        <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
          {title}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article, index) => (
          <Link 
            key={article.id}
            href={`/${article.slug}`}
            className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors duration-300"
          >
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <Image 
                src={article.featuredImage.sourceUrl} 
                alt={article.featuredImage.altText}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="bg-gaming-accent text-gaming-dark px-2 py-1 rounded text-xs font-bold">
                  #{index + 1}
                </span>
              </div>
              {article.categories && article.categories.length > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gaming-primary/80 text-white px-2 py-1 rounded text-xs font-medium">
                    {article.categories[0].name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-3 sm:p-4">
              <h3 className="text-white text-sm sm:text-base font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <SafeHtml
                  html={article.excerpt}
                  as="div"
                  className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2"
                />
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.author.name}</span>
                <span>{article.readTime} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EditorialPicks; 