'use client';

/**
 * Utilitaires de debug pour les erreurs d'hydratation
 * Aide à identifier et résoudre les problèmes d'hydratation en développement
 */

/**
 * Intercepte et logue les erreurs d'hydratation en mode développement
 */
export function setupHydrationErrorLogging() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Intercepter les erreurs d'hydratation
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0];
    
    if (typeof message === 'string' && message.includes('Hydration failed')) {
      console.group('🚨 ERREUR D\'HYDRATATION DÉTECTÉE');
      console.error('Message:', message);
      console.warn('💡 Solutions possibles:');
      console.log('1. Vérifier les différences de dates entre serveur/client');
      console.log('2. Utiliser useEffect pour les états dépendants du client');
      console.log('3. Utiliser suppressHydrationWarning pour le contenu dynamique');
      console.log('4. Vérifier les Math.random() ou Date.now() dans le rendu');
      console.log('5. Utiliser le composant NoSSR pour le contenu client-only');
      console.groupEnd();
    }
    
    originalError.apply(console, args);
  };

  // Logger les performances d'hydratation
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length > 0) {
          const navEntry = perfEntries[0] as PerformanceNavigationTiming;
          const hydrationTime = navEntry.loadEventEnd - navEntry.responseEnd;
          
          if (hydrationTime > 1000) {
            console.warn(`⚠️ Hydratation lente: ${hydrationTime}ms`);
            console.log('💡 Considérer lazy loading ou code splitting');
          } else {
            console.log(`✅ Hydratation rapide: ${hydrationTime}ms`);
          }
        }
      }, 100);
    });
  }
}

/**
 * Fonction utilitaire pour logger les composants en développement
 * Utilise console.log simple pour éviter les problèmes de hooks
 */
export function logHydrationDebug(componentName: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 [${componentName}] Hydratation terminée`, props);
  }
}
