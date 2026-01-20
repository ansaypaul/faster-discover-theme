import { Metadata } from 'next';
import CacheDashboard from '@/components/debug/CacheDashboard';

export const metadata: Metadata = {
  title: 'Debug - Cache ISR Dashboard | World of Geeks',
  description: 'Dashboard de monitoring du cache ISR',
  robots: 'noindex, nofollow', // Empêcher l'indexation de cette page de debug
};

// Page de debug - pas de cache
export const dynamic = 'force-dynamic';

export default function CacheDebugPage() {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gaming-dark-card rounded-xl p-6 border border-gaming-dark-lighter">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🔥 Cache ISR Réel - Dashboard
              </h1>
              <p className="text-gray-400">
                Monitoring des pages VRAIMENT en cache ISR Next.js
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                  ✅ Cache réel Next.js
                </span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                  🔄 Tracking en temps réel
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Page de debug - Mode développement
              </div>
              <div className="text-xs text-yellow-500 mt-1">
                ⚠️ Cette page ne doit pas être accessible en production
              </div>
            </div>
          </div>

          <CacheDashboard />
        </div>
      </div>
    </div>
  );
}
