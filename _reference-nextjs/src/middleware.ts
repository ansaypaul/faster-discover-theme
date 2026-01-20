import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Réécriture des sitemaps post-sitemap1.xml -> /api/sitemap/posts/1
  const postSitemapMatch = pathname.match(/^\/post-sitemap(\d+)\.xml$/);
  if (postSitemapMatch) {
    const index = postSitemapMatch[1];
    return NextResponse.rewrite(new URL(`/api/sitemap/posts/${index}`, request.url));
  }
  
  // Réécriture page-sitemap.xml -> /api/sitemap/pages
  if (pathname === '/page-sitemap.xml') {
    return NextResponse.rewrite(new URL('/api/sitemap/pages', request.url));
  }
  
  // Réécriture category-sitemap.xml -> /api/sitemap/categories
  if (pathname === '/category-sitemap.xml') {
    return NextResponse.rewrite(new URL('/api/sitemap/categories', request.url));
  }
  
  // Réécriture sitemap_index.xml -> /api/sitemap/index
  if (pathname === '/sitemap_index.xml') {
    return NextResponse.rewrite(new URL('/api/sitemap/index', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(post-sitemap\\d+|page-sitemap|category-sitemap|sitemap_index)\\.xml',
  ],
}; 