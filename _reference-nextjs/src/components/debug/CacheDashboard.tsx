'use client';

import { useState, useEffect } from 'react';

// Types pour les informations de cache
interface CacheEntry {
  url: string;
  type: 'page' | 'article' | 'category' | 'author' | 'game';
  revalidateTime: number;
  lastGenerated?: string;
  expiresAt?: string;
  status: 'cached' | 'generating' | 'expired' | 'unknown';
}

interface CacheInfo {
  entries: CacheEntry[];
  totalEntries: number;
  cacheHitRate?: number;
  lastUpdate: string;
}

// Fonction pour formater la durée
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}j`;
}

// Fonction pour formater une date relative
function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) return `il y a ${diffSeconds}s`;
  if (diffSeconds < 3600) return `il y a ${Math.floor(diffSeconds / 60)}min`;
  if (diffSeconds < 86400) return `il y a ${Math.floor(diffSeconds / 3600)}h`;
  return `il y a ${Math.floor(diffSeconds / 86400)}j`;
}

// Fonction pour calculer le temps jusqu'à expiration
function getTimeUntilExpiration(expiresAt: string): { text: string; isExpired: boolean; isNearExpiry: boolean } {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds <= 0) {
    return { text: 'Expiré', isExpired: true, isNearExpiry: false };
  }
  
  const isNearExpiry = diffSeconds < 300; // Moins de 5 minutes
  
  if (diffSeconds < 60) return { text: `dans ${diffSeconds}s`, isExpired: false, isNearExpiry };
  if (diffSeconds < 3600) return { text: `dans ${Math.floor(diffSeconds / 60)}min`, isExpired: false, isNearExpiry };
  if (diffSeconds < 86400) return { text: `dans ${Math.floor(diffSeconds / 3600)}h`, isExpired: false, isNearExpiry: false };
  return { text: `dans ${Math.floor(diffSeconds / 86400)}j`, isExpired: false, isNearExpiry: false };
}

// Composant pour le statut du cache
function CacheStatus({ status }: { status: CacheEntry['status'] }) {
  const statusConfig = {
    cached: { color: 'text-green-400', bg: 'bg-green-400/10', text: '✅ En cache' },
    generating: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', text: '🔄 Génération' },
    expired: { color: 'text-red-400', bg: 'bg-red-400/10', text: '❌ Expiré' },
    unknown: { color: 'text-gray-400', bg: 'bg-gray-400/10', text: '❓ Inconnu' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      {config.text}
    </span>
  );
}

// Composant pour le type de page
function PageType({ type }: { type: CacheEntry['type'] }) {
  const typeConfig = {
    page: { color: 'text-blue-400', bg: 'bg-blue-400/10', text: '📄 Page' },
    article: { color: 'text-purple-400', bg: 'bg-purple-400/10', text: '📝 Article' },
    category: { color: 'text-orange-400', bg: 'bg-orange-400/10', text: '📂 Catégorie' },
    author: { color: 'text-pink-400', bg: 'bg-pink-400/10', text: '👤 Auteur' },
    game: { color: 'text-green-400', bg: 'bg-green-400/10', text: '🎮 Jeu' }
  };

  const config = typeConfig[type];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      {config.text}
    </span>
  );
}

export default function CacheDashboard() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'all' | CacheEntry['type'] | CacheEntry['status']>('all');
  const [revalidating, setRevalidating] = useState<string | null>(null);
  const [clearingCache, setClearingCache] = useState(false);

  // Fonction pour récupérer les données du cache
  const fetchCacheInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const realCacheResponse = await fetch('/api/debug/real-cache', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!realCacheResponse.ok) {
        throw new Error(`Erreur cache ${realCacheResponse.status}: ${realCacheResponse.statusText}`);
      }
      
      const realCacheData = await realCacheResponse.json();
      
      // Adapter les données du real cache au format attendu
      const adaptedCacheData = {
        entries: realCacheData.cachedPages.map((page: {
          url: string;
          type: string;
          revalidateTime: number;
          generatedAt: string;
          status: string;
        }) => ({
          url: page.url,
          type: page.type,
          revalidateTime: page.revalidateTime,
          lastGenerated: page.generatedAt,
          expiresAt: new Date(new Date(page.generatedAt).getTime() + page.revalidateTime * 1000).toISOString(),
          status: page.status === 'static' ? 'cached' : page.status
        })),
        totalEntries: realCacheData.stats.currentlyCached,
        cacheHitRate: realCacheData.stats.cacheHitRate,
        lastUpdate: realCacheData.lastUpdate
      };
      
      setCacheInfo(adaptedCacheData);
      
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour revalider une URL
  const revalidateUrl = async (url: string) => {
    try {
      setRevalidating(url);
      
      // Simuler la revalidation dans notre tracker local
      const response = await fetch('/api/debug/simulate-revalidation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });
      
      if (response.ok) {
        // Rafraîchir les données après revalidation
        setTimeout(() => {
          fetchCacheInfo();
        }, 500);
      } else {
        console.error('Erreur lors de la revalidation:', response.statusText);
      }
    } catch (err) {
      console.error('Erreur lors de la revalidation:', err);
    } finally {
      setRevalidating(null);
    }
  };

  // Fonction pour vider tout le cache
  const clearAllCache = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider TOUT le cache ? Cela forcera la régénération de toutes les pages.')) {
      return;
    }

    try {
      setClearingCache(true);
      
      const response = await fetch('/api/debug/clear-cache?secret=dev-clear-cache', {
        method: 'GET',
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`✅ Cache vidé avec succès !\n\n${data.message}`);
        
        // Rafraîchir les données après un court délai
        setTimeout(() => {
          fetchCacheInfo();
        }, 1000);
      } else {
        const errorData = await response.json();
        alert(`❌ Erreur: ${errorData.error || 'Impossible de vider le cache'}`);
      }
    } catch (err) {
      console.error('Erreur lors du vidage du cache:', err);
      alert('❌ Erreur lors du vidage du cache. Vérifiez la console.');
    } finally {
      setClearingCache(false);
    }
  };

  // Charger les données au montage et configurer le refresh automatique
  useEffect(() => {
    fetchCacheInfo();
    
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchCacheInfo, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filtrer les entrées
  const filteredEntries = cacheInfo?.entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter || entry.status === filter;
  }) || [];

  if (loading && !cacheInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-accent mx-auto mb-4"></div>
          Chargement des informations de cache...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center text-red-400 mb-2">
          <span className="text-xl mr-2">❌</span>
          <span className="font-medium">Erreur de chargement</span>
        </div>
        <p className="text-red-300 text-sm">{error}</p>
        <button
          onClick={fetchCacheInfo}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gaming-dark-lighter rounded-lg p-4 border border-gaming-dark-card">
          <div className="text-gaming-accent text-2xl font-bold">
            {cacheInfo?.totalEntries || 0}
          </div>
          <div className="text-gray-400 text-sm">URLs totales</div>
        </div>
        
        <div className="bg-gaming-dark-lighter rounded-lg p-4 border border-gaming-dark-card">
          <div className="text-green-400 text-2xl font-bold">
            {cacheInfo?.cacheHitRate?.toFixed(1) || 0}%
          </div>
          <div className="text-gray-400 text-sm">Taux de cache</div>
        </div>
        
        <div className="bg-gaming-dark-lighter rounded-lg p-4 border border-gaming-dark-card">
          <div className="text-blue-400 text-2xl font-bold">
            {filteredEntries.filter(e => e.status === 'cached').length}
          </div>
          <div className="text-gray-400 text-sm">En cache</div>
        </div>
        
        <div className="bg-gaming-dark-lighter rounded-lg p-4 border border-gaming-dark-card">
          <div className="text-red-400 text-2xl font-bold">
            {filteredEntries.filter(e => e.status === 'expired').length}
          </div>
          <div className="text-gray-400 text-sm">Expirés</div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-gaming-accent text-gaming-dark' 
                : 'bg-gaming-dark-lighter text-gray-300 hover:bg-gaming-dark-card'
            }`}
          >
            Tous ({cacheInfo?.totalEntries || 0})
          </button>
          <button
            onClick={() => setFilter('cached')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'cached' 
                ? 'bg-green-500 text-white' 
                : 'bg-gaming-dark-lighter text-gray-300 hover:bg-gaming-dark-card'
            }`}
          >
            En cache ({filteredEntries.filter(e => e.status === 'cached').length})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'expired' 
                ? 'bg-red-500 text-white' 
                : 'bg-gaming-dark-lighter text-gray-300 hover:bg-gaming-dark-card'
            }`}
          >
            Expirés ({filteredEntries.filter(e => e.status === 'expired').length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            Dernière mise à jour: {formatRelativeTime(lastRefresh.toISOString())}
          </div>
          <button
            onClick={clearAllCache}
            disabled={clearingCache}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              clearingCache
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {clearingCache ? '⏳' : '🗑️'} Vider le cache
          </button>
          <button
            onClick={fetchCacheInfo}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark'
            }`}
          >
            {loading ? '🔄' : '🔄'} Actualiser
          </button>
        </div>
      </div>

      {/* Liste des URLs */}
      <div className="bg-gaming-dark-lighter rounded-lg border border-gaming-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gaming-dark-card border-b border-gaming-dark-lighter">
              <tr>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">URL</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Statut</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Revalidation</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Dernière génération</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Expire</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gaming-dark-card">
              {filteredEntries.map((entry, index) => {
                const expirationInfo = entry.expiresAt ? getTimeUntilExpiration(entry.expiresAt) : null;
                
                return (
                  <tr key={`${entry.url}-${index}`} className="hover:bg-gaming-dark-card/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-sm text-gray-200 max-w-xs truncate" title={entry.url}>
                        {entry.url}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PageType type={entry.type} />
                    </td>
                    <td className="py-3 px-4">
                      <CacheStatus status={entry.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {formatDuration(entry.revalidateTime)}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {entry.lastGenerated ? formatRelativeTime(entry.lastGenerated) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {expirationInfo ? (
                        <span className={`${
                          expirationInfo.isExpired 
                            ? 'text-red-400' 
                            : expirationInfo.isNearExpiry 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                        }`}>
                          {expirationInfo.text}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => revalidateUrl(entry.url)}
                        disabled={revalidating === entry.url}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          revalidating === entry.url
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gaming-accent/20 hover:bg-gaming-accent/30 text-gaming-accent'
                        }`}
                      >
                        {revalidating === entry.url ? '⏳' : '🔄'} Revalider
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Aucune entrée trouvée pour le filtre sélectionné
          </div>
        )}
      </div>

      {/* Légende */}
      <div className="bg-gaming-dark-lighter rounded-lg p-4 border border-gaming-dark-card">
        <h3 className="text-white font-medium mb-3">💡 Informations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p><strong className="text-gray-300">Revalidation:</strong> Temps après lequel la page sera regénérée</p>
            <p><strong className="text-gray-300">ISR:</strong> Incremental Static Regeneration de Next.js</p>
          </div>
          <div>
            <p><strong className="text-gray-300">En cache:</strong> Page servie depuis le cache statique</p>
            <p><strong className="text-gray-300">Expiré:</strong> Page qui sera regénérée à la prochaine visite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
