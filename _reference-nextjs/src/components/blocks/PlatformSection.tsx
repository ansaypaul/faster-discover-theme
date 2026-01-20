"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Article } from '@/types';
import SafeHtml from '@/components/common/SafeHtml';

const DEFAULT_IMAGE = "/images/placeholder.svg";

interface PlatformSectionProps {
  title: string;
  platform: string;
  posts: Article[];
  categoryLink?: string;
}

const PlatformSection = ({ title, platform, posts, categoryLink }: PlatformSectionProps) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const getPlatformColor = (platform: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    switch (platform.toLowerCase()) {
      case 'playstation':
        return 'bg-blue-600';
      case 'xbox':
        return 'bg-green-600';
      case 'nintendo':
        return 'bg-red-600';
      case 'pc':
        return 'bg-orange-600';
      default:
        return 'bg-gaming-primary';
    }
  };

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
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
      
      <div className="overflow-x-auto">
        <div className="flex gap-3 sm:gap-4 pb-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id}
              href={`/${post.slug}`}
              className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors duration-300 flex-shrink-0 w-64 sm:w-auto"
            >
              <div className="relative h-32 sm:h-36 overflow-hidden">
                <Image 
                  src={post.featuredImage?.sourceUrl || DEFAULT_IMAGE} 
                  alt={post.featuredImage?.altText || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {post.categories?.[0] && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-gaming-primary/80 text-white px-2 py-1 rounded text-xs font-medium">
                      {post.categories[0].name}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-gaming-accent transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <SafeHtml
                    html={post.excerpt}
                    as="div"
                    className="text-gray-400 text-xs mt-1 line-clamp-1"
                  />
                )}
                <time dateTime={post.date} className="mt-2 text-xs text-gray-400 block">
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection; 