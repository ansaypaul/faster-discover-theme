import { NextResponse } from 'next/server';
import { getLatestPosts, getAllPostsForSitemap } from '@/lib/wordpress';

function getBaseUrl(request: Request): string {
  const host = request.headers.get('host') || 'worldofgeek.fr';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

const POSTS_PER_SITEMAP = 250;

export async function GET(request: Request) {
  try {
    const BASE_URL = getBaseUrl(request);
    
    const [latestPosts, allPosts] = await Promise.all([
      getLatestPosts(1),
      getAllPostsForSitemap(),
    ]);

    const uniquePosts = Array.from(
      new Map(allPosts.map(post => [post.slug, post])).values()
    );

    const totalPosts = uniquePosts.length;
    const numPostSitemaps = Math.ceil(totalPosts / POSTS_PER_SITEMAP);

    console.log(`📚 sitemap_index.xml: ${totalPosts} articles sur ${numPostSitemaps} sitemaps`);

    const postsLastMod = latestPosts[0]?.date || new Date().toISOString();
    const categoriesLastMod = new Date().toISOString();
    const pagesLastMod = new Date().toISOString();

    const postSitemaps = Array.from({ length: numPostSitemaps }, (_, i) => {
      const index = i + 1; // Commencer à 1 comme Rank Math
      return `
  <sitemap>
    <loc>${BASE_URL}/post-sitemap${index}.xml</loc>
    <lastmod>${postsLastMod}</lastmod>
  </sitemap>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postSitemaps}
  <sitemap>
    <loc>${BASE_URL}/page-sitemap.xml</loc>
    <lastmod>${pagesLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/category-sitemap.xml</loc>
    <lastmod>${categoriesLastMod}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('❌ Error generating sitemap_index.xml:', error);
    
    const BASE_URL = getBaseUrl(request);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/page-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/category-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    return new NextResponse(fallbackXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
}
