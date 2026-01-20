import { getLatestPosts } from '@/lib/wordpress';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate toutes les heures

export async function GET() {
  try {
    // Récupérer les 50 derniers articles
    const posts = await getLatestPosts(50);
    
    const siteUrl = 'https://worldofgeek.fr';
    const currentDate = new Date().toISOString();

    // Générer le flux Atom 1.0 (préféré par certains agrégateurs)
    const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <title>World of Geeks</title>
  <subtitle>Découvrez toute l'actualité du jeu vidéo, esport, mangas et high-tech</subtitle>
  <link href="${siteUrl}" rel="alternate" />
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${siteUrl}/</id>
  <updated>${currentDate}</updated>
  <rights>© ${new Date().getFullYear()} World of Geeks</rights>
  <generator>Next.js 15</generator>
  <icon>${siteUrl}/favicon.ico</icon>
  <logo>${siteUrl}/images/logo.png</logo>
${posts.map(post => {
  const postUrl = `${siteUrl}/${post.slug}`;
  const pubDate = new Date(post.date).toISOString();
  const image = post.featuredImage?.sourceUrl || '';
  
  // Nettoyer le contenu HTML pour le flux
  const content = post.content
    ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Retirer les scripts
    ?.replace(/\s+/g, ' ') // Normaliser les espaces
    ?.trim() || post.excerpt || '';
  
  const excerpt = post.excerpt
    ?.replace(/<[^>]+>/g, '') // Retirer les tags HTML
    ?.replace(/\s+/g, ' ')
    ?.trim() || '';

  return `  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${postUrl}" rel="alternate" />
    <id>${postUrl}</id>
    <published>${pubDate}</published>
    <updated>${pubDate}</updated>
    <author>
      <name>${post.author?.name || 'World of Geeks'}</name>
    </author>
    <summary type="html"><![CDATA[${excerpt}]]></summary>
    <content type="html"><![CDATA[${content}]]></content>
    ${post.categories?.map(cat => 
      `<category term="${cat.slug}" label="${cat.name}" />`
    ).join('\n    ') || ''}
    ${image ? `<media:thumbnail url="${image}" />
    <media:content url="${image}" medium="image" type="image/jpeg" />` : ''}
  </entry>`;
}).join('\n')}
</feed>`;

    return new NextResponse(atomFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    return new NextResponse('Error generating Atom feed', { status: 500 });
  }
}
