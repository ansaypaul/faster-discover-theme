"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PostCard from '@/components/article/PostCard';
import { Article } from '@/types';

interface LatestNewsProps {
  title?: string;
  articles?: Article[];
}

const LatestNews = ({ title = "Dernières actualités", articles = [] }: LatestNewsProps) => {
  if (!articles?.length) {
    return (
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
            {title}
          </h2>
          <Link 
            href="/actualites"
            className="flex items-center text-gaming-accent hover:text-gaming-accent/80 transition-colors text-sm"
          >
            Voir toutes
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="bg-gaming-dark-card rounded-lg p-4 text-center text-gray-400">
          Aucun article disponible pour le moment.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
          {title}
        </h2>
        <Link 
          href="/actualites"
          className="flex items-center text-gaming-accent hover:text-gaming-accent/80 transition-colors text-sm"
        >
          Voir toutes
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {articles.map((article) => (
          <PostCard key={article.id} post={article} layout="news" />
        ))}
      </div>
    </section>
  );
};

export default LatestNews; 