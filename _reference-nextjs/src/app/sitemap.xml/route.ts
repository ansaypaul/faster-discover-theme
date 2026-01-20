import { NextResponse } from 'next/server';

// Redirection vers le nouveau sitemap index
export async function GET(request: Request) {
  const host = request.headers.get('host') || 'worldofgeek.fr';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const BASE_URL = `${protocol}://${host}`;
  
  // Redirect vers sitemap_index.xml (format Rank Math)
  return NextResponse.redirect(`${BASE_URL}/sitemap_index.xml`, 301);
}
