import { Article } from '@/types';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleContentWithProducts from '@/components/article/ArticleContentWithProducts';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import RelatedArticles from '@/components/article/RelatedArticles';
import JsonLdNewsArticle from '@/components/seo/JsonLdNewsArticle';
import { processContentServer } from '@/lib/processContent';

interface ArticlePageProps {
  article: Article;
  relatedArticles?: Article[];
  latestPosts: Article[];
}

export default function ArticlePage({ 
  article, 
  relatedArticles, 
  latestPosts 
}: ArticlePageProps) {
  // URL complète pour le JSON-LD (statique, pas de hydration mismatch)
  const articleUrl = `https://worldofgeek.fr/${article.slug}`;
  
  // Traiter le contenu côté serveur (1 seule fois, pas à chaque render client)
  const { html: processedContent, products } = processContentServer(article.content || '');

  return (
    <>
      <JsonLdNewsArticle
        title={article.title}
        description={article.excerpt || article.seo?.description || ''}
        image={article.featuredImage?.sourceUrl || article.seo?.openGraph?.image?.secureUrl}
        datePublished={article.date}
        dateModified={article.modified || article.date}
        authorName={article.author?.name}
        authorSlug={article.author?.slug}
        articleUrl={articleUrl}
      />
      
      <div className="min-h-screen bg-gaming-dark">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs 
            items={[
              { 
                label: article.categories?.[0]?.name || 'Articles', 
                href: article.categories?.[0] ? `/${article.categories[0].slug}` : '/actualites' 
              },
              { label: article.title, href: `/${article.slug}` }
            ]} 
          />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            <main className="flex-1 max-w-[956px] mx-auto">
              <article className="mb-8">
                <ArticleHeader article={article} />
                {products.length > 0 ? (
                  <ArticleContentWithProducts html={processedContent} products={products} />
                ) : (
                  <ArticleContent content={processedContent} />
                )}
              </article>
              <RelatedArticles 
                articles={relatedArticles} 
                articleId={relatedArticles ? undefined : article.id}
              />
            </main>
            
            <Sidebar latestPosts={latestPosts} />
          </div>
        </div>
      </div>
    </>
  );
} 