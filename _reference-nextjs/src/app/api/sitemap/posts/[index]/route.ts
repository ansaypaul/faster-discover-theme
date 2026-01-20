import { NextResponse } from 'next/server';
import { getAllPostsForSitemap } from '@/lib/wordpress';

// Fonction pour obtenir l'URL de base selon l'environnement
function getBaseUrl(request: Request): string {
  const host = request.headers.get('host') || 'worldofgeek.fr';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Fonction pour échapper les caractères spéciaux XML
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

const POSTS_PER_SITEMAP = 250;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ index: string }> }
) {
  let sitemapIndex = 0;
  
  try {
    const BASE_URL = getBaseUrl(request);
    const { index } = await params;
    sitemapIndex = parseInt(index, 10);

    if (isNaN(sitemapIndex) || sitemapIndex < 1) {
      return new NextResponse('Invalid sitemap index', { status: 400 });
    }

    // Get ALL posts (cached)
    const allPosts = await getAllPostsForSitemap();

    // Déduplication par slug
    const uniquePosts = Array.from(
      new Map(allPosts.map(post => [post.slug, post])).values()
    );

    // Calculate pagination (index starts at 1)
    const startIndex = (sitemapIndex - 1) * POSTS_PER_SITEMAP;
    const endIndex = startIndex + POSTS_PER_SITEMAP;
    const posts = uniquePosts.slice(startIndex, endIndex);

    // Si pas d'articles pour cet index, retourner 404
    if (posts.length === 0) {
      return new NextResponse('No posts found for this sitemap index', { status: 404 });
    }

    console.log(`📄 post-sitemap${sitemapIndex}.xml: ${posts.length} articles (${startIndex + 1}-${startIndex + posts.length})`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map(post => `
  <url>
    <loc>${BASE_URL}/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    ${post.featuredImage?.sourceUrl ? `
    <image:image>
      <image:loc>${escapeXml(post.featuredImage.sourceUrl)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>` : ''}
  </url>`).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error(`❌ Error generating post-sitemap${sitemapIndex}.xml:`, error);
    
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error generating sitemap: ${error instanceof Error ? error.message : 'Unknown error'} -->
</urlset>`;
    
    return new NextResponse(fallbackXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
}
