// Système de tracking du VRAI cache ISR Next.js

interface RealCacheEntry {
  url: string;
  type: 'page' | 'article' | 'category' | 'author' | 'game';
  revalidateTime: number;
  generatedAt: string;
  isStatic: boolean;
  buildTime?: string;
}

// Stockage persistant des pages réellement générées
const realCacheEntries = new Map<string, RealCacheEntry>();

// Fonction appelée quand une page est réellement générée par Next.js
export function trackPageGeneration(
  url: string, 
  revalidateTime: number,
  isStatic: boolean = false,
  buildTime?: string
) {
  const type = determinePageType(url);
  
  const entry: RealCacheEntry = {
    url: normalizeUrl(url),
    type,
    revalidateTime,
    generatedAt: new Date().toISOString(),
    isStatic,
    buildTime
  };

  realCacheEntries.set(entry.url, entry);
  
  console.log(`🔥 Page ISR générée et mise en cache: ${entry.url} (revalidate: ${revalidateTime}s)`);
}

// Fonction pour marquer qu'une page a été revalidée
export function trackPageRevalidation(url: string) {
  const normalizedUrl = normalizeUrl(url);
  const existing = realCacheEntries.get(normalizedUrl);
  
  if (existing) {
    existing.generatedAt = new Date().toISOString();
    console.log(`🔄 Page ISR revalidée: ${normalizedUrl}`);
  }
}

// Fonction pour vérifier si une page est encore en cache (pas expirée)
export function isPageInCache(entry: RealCacheEntry): boolean {
  if (entry.isStatic) return true; // Les pages statiques ne expirent jamais
  
  const now = new Date();
  const generated = new Date(entry.generatedAt);
  const timeSinceGenerated = (now.getTime() - generated.getTime()) / 1000;
  
  return timeSinceGenerated < entry.revalidateTime;
}

// Fonction pour obtenir seulement les pages VRAIMENT en cache
export function getRealCachedPages(): RealCacheEntry[] {
  const allEntries = Array.from(realCacheEntries.values());
  
  // Filtrer pour ne garder que les pages encore en cache
  return allEntries.filter(entry => isPageInCache(entry));
}

// Fonction pour obtenir toutes les pages générées (même expirées)
export function getAllGeneratedPages(): RealCacheEntry[] {
  return Array.from(realCacheEntries.values());
}

// Fonction pour obtenir le statut d'une page
export function getPageCacheStatus(entry: RealCacheEntry): 'cached' | 'expired' | 'static' {
  if (entry.isStatic) return 'static';
  return isPageInCache(entry) ? 'cached' : 'expired';
}

// Fonction pour calculer le temps restant avant expiration
export function getTimeUntilExpiration(entry: RealCacheEntry): number {
  if (entry.isStatic) return Infinity;
  
  const now = new Date();
  const generated = new Date(entry.generatedAt);
  const expiresAt = new Date(generated.getTime() + (entry.revalidateTime * 1000));
  
  return Math.max(0, (expiresAt.getTime() - now.getTime()) / 1000);
}

// Fonction pour déterminer le type de page
function determinePageType(url: string): RealCacheEntry['type'] {
  const normalizedUrl = normalizeUrl(url);
  
  if (normalizedUrl === '/' || normalizedUrl === '/jeux' || normalizedUrl === '/recherche') {
    return 'page';
  }
  if (normalizedUrl.startsWith('/auteur/')) {
    return 'author';
  }
  if (normalizedUrl.startsWith('/jeux/')) {
    return 'game';
  }
  if (normalizedUrl.includes('category=') || normalizedUrl.startsWith('/actualites')) {
    return 'category';
  }
  return 'article';
}

// Fonction pour normaliser les URLs
function normalizeUrl(url: string): string {
  // Enlever les paramètres de query sauf pour les catégories
  if (url.includes('category=')) {
    return url; // Garder les paramètres de catégorie
  }
  
  // Pour les autres, enlever les query params
  const baseUrl = url.split('?')[0];
  return baseUrl === '' ? '/' : baseUrl;
}

// Fonction pour supprimer une page du cache (quand elle est revalidée)
export function removeFromCache(url: string) {
  const normalizedUrl = normalizeUrl(url);
  realCacheEntries.delete(normalizedUrl);
  console.log(`🗑️ Page supprimée du cache: ${normalizedUrl}`);
}

// Fonction pour obtenir les statistiques du cache
export function getCacheStats() {
  const allPages = getAllGeneratedPages();
  const cachedPages = getRealCachedPages();
  const staticPages = allPages.filter(p => p.isStatic);
  const expiredPages = allPages.filter(p => !isPageInCache(p) && !p.isStatic);
  
  return {
    totalGenerated: allPages.length,
    currentlyCached: cachedPages.length,
    static: staticPages.length,
    expired: expiredPages.length,
    cacheHitRate: allPages.length > 0 ? (cachedPages.length / allPages.length) * 100 : 0
  };
}
