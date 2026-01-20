import { notFound } from "next/navigation";
import { getJeuBySlug, getBestJeux, getLatestPosts } from "@/lib/wordpress";
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleContent from '@/components/article/ArticleContent';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import SafeHtml from '@/components/common/SafeHtml';

// Revalidate game pages every 24 hours (86400 seconds)
export const revalidate = 86400;

export async function generateStaticParams() {
  const games = await getBestJeux(100, { next: { revalidate: 86400 } });
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getJeuBySlug(slug, { next: { revalidate: 86400 } });
  const latestPosts = await getLatestPosts(6, { next: { revalidate: 3600 } });

  if (!game) {
    notFound();
  }

  // Convertir le jeu en format Article pour la compatibilité avec les composants
  const gameAsArticle = {
    id: game.id,
    title: game.title,
    slug: game.slug,
    excerpt: '', // On n'a plus besoin du synopsis ici car il est affiché séparément
    content: game.content || '',
    date: new Date().toISOString(),
    author: game.author ? {
      name: game.author.name,
      slug: game.author.slug,
      avatar: {
        url: game.author.avatar?.url
      }
    } : {
      name: 'World of Geeks',
      slug: 'world-of-geeks',
      avatar: {
        url: '/images/default-avatar.jpg'
      }
    },
    featuredImage: {
      sourceUrl: game.featuredImage?.node?.sourceUrl || '/images/game-placeholder.jpg',
      altText: game.featuredImage?.node?.altText || game.title
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Jeux', href: '/jeux' },
            { label: game.title, href: `/jeux/${game.slug}` }
          ]} 
        />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <main className="flex-1 max-w-[956px] mx-auto px-4">
            <article>
              <ArticleHeader article={gameAsArticle} />
              
              {game.ficheJeu?.synopsis && (
                <blockquote className="border-l-4 border-gaming-accent bg-gaming-dark p-4 rounded-r-lg mb-6">
                  <SafeHtml
                    html={game.ficheJeu.synopsis}
                    as="div"
                    className="text-white text-base italic leading-relaxed"
                  />
                  <cite className="text-gaming-accent text-sm block mt-2">— Synopsis</cite>
                </blockquote>
              )}

              <ArticleContent article={gameAsArticle} />
            </article>
          </main>
          
          <Sidebar latestPosts={latestPosts} />
        </div>
      </div>
    </div>
  );
} 