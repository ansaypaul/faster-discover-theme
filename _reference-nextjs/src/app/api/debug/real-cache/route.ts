import { NextResponse } from 'next/server';
import { 
  getRealCachedPages, 
  getAllGeneratedPages,
  getCacheStats,
  getPageCacheStatus,
  getTimeUntilExpiration 
} from '@/lib/isr-tracker';

// Types pour l'API
interface RealCacheResponse {
  cachedPages: {
    url: string;
    type: string;
    revalidateTime: number;
    generatedAt: string;
    status: 'cached' | 'expired' | 'static';
    timeUntilExpiration: number;
    isStatic: boolean;
  }[];
  stats: {
    totalGenerated: number;
    currentlyCached: number;
    static: number;
    expired: number;
    cacheHitRate: number;
  };
  lastUpdate: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    // Obtenir seulement les pages VRAIMENT en cache
    const realCachedPages = getRealCachedPages();
    const stats = getCacheStats();
    
    // Formater les données pour l'API
    const cachedPages = realCachedPages.map(page => ({
      url: page.url,
      type: page.type,
      revalidateTime: page.revalidateTime,
      generatedAt: page.generatedAt,
      status: getPageCacheStatus(page),
      timeUntilExpiration: getTimeUntilExpiration(page),
      isStatic: page.isStatic
    }));

    // Trier par date de génération (plus récent en premier)
    cachedPages.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );

    const response: RealCacheResponse = {
      cachedPages,
      stats,
      lastUpdate: new Date().toISOString()
    };

    console.log(`📊 Cache ISR Status: ${stats.currentlyCached} pages en cache sur ${stats.totalGenerated} générées`);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du cache réel:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération du cache réel',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: 500 }
    );
  }
}

// Endpoint pour voir toutes les pages générées (même expirées)
export async function POST(): Promise<NextResponse> {
  try {
    const allPages = getAllGeneratedPages();
    const stats = getCacheStats();
    
    const formattedPages = allPages.map(page => ({
      url: page.url,
      type: page.type,
      revalidateTime: page.revalidateTime,
      generatedAt: page.generatedAt,
      status: getPageCacheStatus(page),
      timeUntilExpiration: getTimeUntilExpiration(page),
      isStatic: page.isStatic
    }));

    // Trier par date de génération (plus récent en premier)
    formattedPages.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );

    return NextResponse.json({
      allPages: formattedPages,
      stats,
      lastUpdate: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les pages:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de toutes les pages',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: 500 }
    );
  }
}
