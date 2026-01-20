import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Route pour vider le cache en mémoire et forcer la revalidation
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { secret } = await request.json();
    
    // En développement, accepter n'importe quel secret
    const isValidSecret = process.env.NODE_ENV === 'development' || 
                          secret === process.env.REVALIDATE_SECRET ||
                          secret === 'dev-clear-cache';
    
    if (!isValidSecret) {
      return NextResponse.json(
        { error: 'Invalid secret. Configure REVALIDATE_SECRET in Vercel environment variables.' },
        { status: 401 }
      );
    }

    // Forcer la revalidation de toutes les routes dynamiques
    const pathsToRevalidate = [
      '/',
      '/[slug]',
    ];

    const results = [];
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path, 'page');
        results.push({ path, status: 'revalidated' });
      } catch (error) {
        results.push({ 
          path, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared and paths revalidated',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { 
        error: 'Error clearing cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// GET pour faciliter les tests
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // En développement, accepter n'importe quel secret ou pas de secret
  const isValidSecret = process.env.NODE_ENV === 'development' || 
                        secret === process.env.REVALIDATE_SECRET ||
                        secret === 'dev-clear-cache';
  
  if (!isValidSecret) {
    return NextResponse.json(
      { error: 'Invalid secret. Configure REVALIDATE_SECRET in Vercel environment variables.' },
      { status: 401 }
    );
  }

  try {
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Full cache cleared',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error clearing cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
