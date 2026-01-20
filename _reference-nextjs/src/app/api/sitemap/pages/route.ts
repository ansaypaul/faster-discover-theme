import { NextResponse } from 'next/server';
import { getAllPageSlugs } from '@/lib/wordpress';

function getBaseUrl(request: Request): string {
  const host = request.headers.get('host') || 'worldofgeek.fr';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

const STATIC_PAGES = [
  { slug: '', priority: '1.0' },
  { slug: 'actualites', priority: '0.9' },
  { slug: 'jeux', priority: '0.9' },
  { slug: 'recherche', priority: '0.7' }
];

export async function GET(request: Request) {
  try {
    const BASE_URL = getBaseUrl(request);
    
    const pageSlugs = await getAllPageSlugs();

    const uniquePageSlugs = Array.from(
      new Set(pageSlugs.filter(slug => 
        slug !== '' && slug !== '/' && slug !== 'front-page' && slug !== 'home'
      ))
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${STATIC_PAGES.map(page => `
  <url>
    <loc>${BASE_URL}/${page.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${uniquePageSlugs.map(slug => `
  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('❌ Error generating page-sitemap.xml:', error);
    
    const BASE_URL = getBaseUrl(request);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${STATIC_PAGES.map(page => `
  <url>
    <loc>${BASE_URL}/${page.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
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
