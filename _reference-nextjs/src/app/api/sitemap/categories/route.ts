import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/wordpress';

function getBaseUrl(request: Request): string {
  const host = request.headers.get('host') || 'worldofgeek.fr';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function GET(request: Request) {
  try {
    const BASE_URL = getBaseUrl(request);
    
    const categories = await getAllCategories();

    const uniqueCategories = Array.from(
      new Map(categories.map(cat => [cat.slug, cat])).values()
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${uniqueCategories.map(category => `
  <url>
    <loc>${BASE_URL}/${category.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('❌ Error generating category-sitemap.xml:', error);
    
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error: ${error instanceof Error ? error.message : 'Unknown error'} -->
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
