'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Article } from '@/types';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import Sidebar from './Sidebar';
import RelatedArticles from './RelatedArticles';
import Breadcrumbs from './Breadcrumbs';

// Garder uniquement les composants qui nécessitent vraiment un chargement dynamique
const NewsletterForm = dynamic(() => import('./NewsletterForm'), {
  ssr: false
});

interface ArticleClientWrapperProps {
  article: Article;
  relatedArticles?: Article[];
  latestPosts: Article[];
}

export default function ArticleClientWrapper({ article, relatedArticles, latestPosts }: ArticleClientWrapperProps) {
  const categoryName = article.categories?.[0]?.name || 'Articles';
  const categorySlug = article.categories?.[0]?.slug || '';
  
  const breadcrumbItems = [
    { label: categoryName, href: `/${categorySlug}` },
    { label: article.title }
  ];

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-4">
        <div className="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-6">
          <p className="text-gray-500 text-sm">Emplacement publicitaire - Bannière horizontale 728x90</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gaming-accent hover:text-gaming-accent/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <main className="flex-1">
            <article>
              <ArticleHeader article={article} />
              
              {/* Share Button */}
              <div className="mb-6">
                <button className="inline-flex items-center text-gray-400 hover:text-gaming-accent transition-colors text-sm px-3 py-1.5 rounded-lg bg-gaming-dark-card hover:bg-gaming-dark-lighter">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </button>
              </div>

              <ArticleContent article={article} />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gaming-dark-card">
                  <h4 className="text-white font-semibold mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link 
                        key={tag.slug}
                        href={`/actualites?tag=${tag.slug}`}
                        className="bg-gaming-dark-card text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gaming-primary hover:text-white transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
            
            <RelatedArticles 
              articles={relatedArticles} 
              articleId={relatedArticles ? undefined : article.id}
            />
          </main>
          
          <Sidebar latestPosts={latestPosts}>
            <NewsletterForm />
          </Sidebar>
        </div>

        {/* Mobile Sidebar Content */}
        <div className="lg:hidden mt-8 space-y-6">
          {/* Mobile Ad */}
          <div className="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Emplacement publicitaire - Bannière mobile</p>
          </div>
          
          <Sidebar latestPosts={latestPosts} />
        </div>
      </div>
    </div>
  );
} 