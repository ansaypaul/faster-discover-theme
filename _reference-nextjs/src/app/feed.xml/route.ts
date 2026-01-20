import { getLatestPosts } from '@/lib/wordpress';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate toutes les heures

export async function GET() {
  try {
    // Récupérer les 50 derniers articles
    const posts = await getLatestPosts(50);
    
    const siteUrl = 'https://worldofgeek.fr';
    const currentDate = new Date().toUTCString();

    // Générer le flux RSS 2.0
    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>World of Geeks</title>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${siteUrl}</link>
    <description>Découvrez toute l'actualité du jeu vidéo, esport, mangas et high-tech sur World of Geeks</description>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <language>fr-FR</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Next.js 15</generator>
    <image>
      <url>${siteUrl}/images/logo.png</url>
      <title>World of Geeks</title>
      <link>${siteUrl}</link>
    </image>
${posts.map(post => {
  const postUrl = `${siteUrl}/${post.slug}`;
  const pubDate = new Date(post.date).toUTCString();
  const image = post.featuredImage?.sourceUrl || '';
  
  // Nettoyer le contenu HTML pour le flux
  const content = post.content
    ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Retirer les scripts
    ?.replace(/\s+/g, ' ') // Normaliser les espaces
    ?.trim() || post.excerpt || '';
  
  const excerpt = post.excerpt
    ?.replace(/<[^>]+>/g, '') // Retirer les tags HTML
    ?.replace(/\s+/g, ' ')
    ?.trim()
    ?.substring(0, 300) || '';

  return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${post.author?.name || 'World of Geeks'}]]></dc:creator>
      ${post.categories?.map(cat => 
        `<category><![CDATA[${cat.name}]]></category>`
      ).join('\n      ') || ''}
      ${image ? `<media:content url="${image}" medium="image" />
      <enclosure url="${image}" type="image/jpeg" />` : ''}
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
