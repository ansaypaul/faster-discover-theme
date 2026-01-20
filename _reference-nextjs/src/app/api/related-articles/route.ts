import { NextRequest, NextResponse } from 'next/server';
import { getRelatedArticlesImproved } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const limitParam = searchParams.get('limit');
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId est requis' },
        { status: 400 }
      );
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 4;
    
    if (isNaN(limit) || limit < 1 || limit > 12) {
      return NextResponse.json(
        { error: 'limit doit être entre 1 et 12' },
        { status: 400 }
      );
    }

    const articles = await getRelatedArticlesImproved(articleId, limit);

    return NextResponse.json(
      { articles },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    );

  } catch (error) {
    console.error('Erreur API related-articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
