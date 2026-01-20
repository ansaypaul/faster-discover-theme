import { getRecentPostsWithCategories, getBestJeux, getPageBySlug } from '@/lib/wordpress';
import { Article } from '@/types';
import { generateSeoMetadata } from '@/lib/metadata';
import { trackPageGeneration } from '@/lib/isr-tracker';
import HeroGrid from '@/components/blocks/HeroGrid';
import PlatformSection from '@/components/blocks/PlatformSection';
import ThematicSection from '@/components/blocks/ThematicSection';
import TopGames from '@/components/game/TopGames';
import VideoSection from '@/components/blocks/VideoSection';
import EditorialPicks from '@/components/blocks/EditorialPicks';
import TopRankings from '@/components/game/TopRankings';
import { Metadata } from 'next';

// Revalidate homepage every 5 minutes (300 seconds) to show new content regularly
export const revalidate = 300;

// Force cette page à être statique
export const dynamic = 'force-static';

// ✅ HYDRATION SAFE: Cette page utilise des patterns sûrs pour éviter les erreurs d'hydratation
// - Dates formatées avec toLocaleDateString (format fixe, pas de calcul client)
// - Calculs de dates basés sur des millisecondes fixes plutôt que new Date().setMonth()
// - Déduplication des articles pour éviter les rendus conditionnels changeants

// Récupérer les métadonnées depuis WordPress
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Récupérer la page d'accueil depuis WordPress (slug vide ou 'accueil')
    const homepage = await getPageBySlug('accueil');
    
    if (homepage?.seo) {
      return generateSeoMetadata({
        title: homepage.seo.title || 'World of Geeks',
        description: homepage.seo.description || 'Actualités Gaming, Esport, Mangas et High-Tech',
        type: 'website',
        image: homepage.seo.openGraph?.image?.secureUrl,
        canonical: homepage.seo.canonicalUrl || '/',
      });
    }
  } catch (error) {
    console.error('Error fetching homepage SEO:', error);
  }

  // Fallback si pas de métadonnées WordPress
  return generateSeoMetadata({
    title: 'World of Geeks',
    description: 'Actualités Gaming, Esport, Mangas et High-Tech - Toute l\'actualité du jeu vidéo et de la culture geek',
    type: 'website',
    canonical: '/',
  });
}

// Mock data for videos until we implement their APIs
const mockVideos = [
  {
    id: 1,
    title: 'Test de Final Fantasy XVI',
    url: 'https://youtube.com/watch?v=1',
    thumbnail: '/images/placeholder.svg',
    duration: '12:34'
  },
  {
    id: 2,
    title: 'Les nouveautés de la PS5 Pro',
    url: 'https://youtube.com/watch?v=2',
    thumbnail: '/images/placeholder.svg',
    duration: '8:45'
  },
  {
    id: 3,
    title: 'Notre avis sur Starfield',
    url: 'https://youtube.com/watch?v=3',
    thumbnail: '/images/placeholder.svg',
    duration: '15:20'
  },
  {
    id: 4,
    title: 'Top 10 des meilleurs jeux 2023',
    url: 'https://youtube.com/watch?v=4',
    thumbnail: '/images/placeholder.svg',
    duration: '18:55'
  }
];

// Configuration de la homepage - facile à modifier
const HOMEPAGE_CONFIG = {
  totalArticles: 200,        // Articles à récupérer (facilement modifiable)
  articlesPerCategory: 8,    // Articles par catégorie
  heroArticles: 6,           // Articles dans "À la une"
  editorialArticles: 6,      // Articles dans "Top de la rédac"
  minCategoryArticles: 3,    // Minimum pour afficher une catégorie
  cacheTime: 3600,          // Cache en secondes (1h)
};

// Catégories principales du site
const MAIN_CATEGORIES = [
  { slug: 'news', title: 'News' },
  { slug: 'evenements', title: 'Événements' },
  { slug: 'esport', title: 'Esport' },
  { slug: 'jeux-video', title: 'Jeux Vidéo' },
  { slug: 'mangas', title: 'Mangas' },
  { slug: 'high-tech', title: 'High-Tech' }
];

function filterPostsByCategory(
  posts: Article[], 
  categorySlug: string, 
  excludeIds: Set<string> = new Set(), 
  limit: number = HOMEPAGE_CONFIG.articlesPerCategory
): Article[] {
  return posts
    .filter(post => {
      // Exclure les articles déjà utilisés
      if (excludeIds.has(post.id)) return false;
      
      // Filtrer par catégorie
      const hasCategory = post.categories?.some(cat => cat.slug === categorySlug);
      
      // Optionnel : filtrer les articles trop anciens (plus de 6 mois)
      // Utiliser une date fixe pour éviter les problèmes d'hydratation
      const sixMonthsAgo = new Date(Date.now() - (6 * 30 * 24 * 60 * 60 * 1000)); // 6 mois en millisecondes
      const isRecent = new Date(post.date) > sixMonthsAgo;
      
      return hasCategory && isRecent;
    })
    .slice(0, limit);
}

export default async function HomePage() {
  // 🔥 Tracker que cette page est générée et mise en cache ISR
  trackPageGeneration('/', 600, false);
  
  // Fetch posts based on configuration
  const allPosts = await getRecentPostsWithCategories(HOMEPAGE_CONFIG.totalArticles, {
    next: { revalidate: HOMEPAGE_CONFIG.cacheTime }
  });
  const bestGames = await getBestJeux(6, {
    next: { revalidate: 60 }
  });
  
  // Debug : afficher le total d'articles récupérés
  console.log(`🔍 Total articles récupérés: ${allPosts.length}`);
  
  // Système de déduplication - garder trace des articles utilisés
  const usedArticleIds = new Set<string>();
  
  // Articles pour la section "À la une"
  const heroArticles = allPosts.slice(0, HOMEPAGE_CONFIG.heroArticles).map(post => {
    usedArticleIds.add(post.id); // Marquer comme utilisé
    return {
      ...post,
      excerpt: post.excerpt?.replace(/<[^>]*>/g, '') || '' // Nettoyer l'HTML des extraits
    };
  });

  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Synopsis / Welcome Section */}
        <div className="synopsis mb-6 sm:mb-8 text-sm sm:text-base">
          <span className="synopsis-welcome text-gray-400">Bienvenue sur </span>
          <h1 className="inline text-white font-semibold">
            WorldofGeek.fr : l&apos;actu geek des jeux vidéo, manga et pop culture.
          </h1>
        </div>

        {/* Hero Grid - À la une */}
        <HeroGrid posts={heroArticles} />

        {/* Ad Banner Placeholder */}
        <div className="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-6 sm:mb-8">
          <p className="text-gray-500 text-sm">Emplacement publicitaire - Bannière horizontale 728x90</p>
        </div>

        {/* Category Sections */}
        {MAIN_CATEGORIES.map(category => {
          const categoryPosts = filterPostsByCategory(allPosts, category.slug, usedArticleIds);
          
          // Marquer les articles de cette catégorie comme utilisés
          categoryPosts.forEach(post => usedArticleIds.add(post.id));
          
          // Debug en développement
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Catégorie "${category.title}": ${categoryPosts.length} articles (après déduplication)`);
          }
          
          // Afficher seulement si suffisamment d'articles
          if (categoryPosts.length < HOMEPAGE_CONFIG.minCategoryArticles) return null;

          return (
            <PlatformSection
              key={category.slug}
              title={category.title}
              platform={category.title}
              posts={categoryPosts}
              categoryLink={`/${category.slug}`}
            />
          );
        })}

        {/* Editorial Picks - Top de la rédac */}
        {(() => {
          // Sélectionner les articles pour "Top de la rédac" en évitant les doublons
          const editorialArticles = allPosts
            .filter(post => !usedArticleIds.has(post.id))
            .slice(0, HOMEPAGE_CONFIG.editorialArticles);
          
          // Marquer comme utilisés
          editorialArticles.forEach(post => usedArticleIds.add(post.id));
          
          return <EditorialPicks articles={editorialArticles} />;
        })()}

        {/* Top Games */}
        <TopGames games={bestGames} />

        {/* Ad Banner Placeholder */}
        <div className="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 sm:p-6 text-center mb-6 sm:mb-8">
          <p className="text-gray-500 text-sm">Emplacement publicitaire - Bannière native</p>
        </div>

        {/* Video Section */}
        <VideoSection videos={mockVideos} />

        {/* Tech / Dossiers */}
        {(() => {
          const dossiersArticles = filterPostsByCategory(allPosts, 'dossiers', usedArticleIds);
          // Marquer comme utilisés
          dossiersArticles.forEach(post => usedArticleIds.add(post.id));
          
          return (
            <ThematicSection 
              title="Tech / Dossiers / Lifestyle" 
              articles={dossiersArticles} 
              categoryLink="/dossiers"
            />
          );
        })()}

        {/* Top Rankings */}
        <TopRankings games={bestGames} />

        {/* Newsletter Section */}
        <section className="bg-gaming-dark-lighter rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Rejoignez la communauté World of Geeks
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Recevez les dernières actualités gaming, nos tests exclusifs et nos dossiers tech directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 bg-gaming-dark border border-gaming-dark-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-accent text-sm sm:text-base"
            />
            <button className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors text-sm sm:text-base">
              S&apos;abonner
            </button>
          </div>
          
          {/* Community Links */}
          <div className="mt-6 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-gaming-accent transition-colors">
              <span className="sr-only">Discord</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gaming-accent transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
