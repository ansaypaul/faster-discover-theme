'use client';

import { useEffect } from 'react';
import { setupHydrationErrorLogging } from '@/lib/hydrationDebug';

/**
 * Composant pour initialiser le debug des erreurs d'hydratation en développement
 */
export default function HydrationDebugProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialiser le logging des erreurs d'hydratation uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      setupHydrationErrorLogging();
      console.log('🔧 Debug d\'hydratation activé');
    }
  }, []);

  return <>{children}</>;
}
