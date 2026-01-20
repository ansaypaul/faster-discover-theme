import { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface TopStoriesBlockProps {
  articles: Article[];
}

export default function TopStoriesBlock({ articles }: TopStoriesBlockProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 6);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
      {/* Article principal */}
      <div className="lg:col-span-2">
        <Link href={`/${mainArticle.slug}`} className="group">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={mainArticle.featuredImage?.sourceUrl || '/images/placeholder.jpg'}
              alt={mainArticle.featuredImage?.altText || mainArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white group-hover:text-gaming-accent transition-colors">
              {mainArticle.title}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {formatDate(mainArticle.date)}
            </p>
          </div>
        </Link>
      </div>

      {/* Articles secondaires */}
      <div className="space-y-4">
        {sideArticles.map((article) => (
          <Link 
            key={article.id} 
            href={`/${article.slug}`}
            className="group flex gap-4 items-start"
          >
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={article.featuredImage?.sourceUrl || '/images/placeholder.jpg'}
                alt={article.featuredImage?.altText || article.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div>
              <h3 className="text-white group-hover:text-gaming-accent transition-colors font-semibold line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {formatDate(article.date)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 