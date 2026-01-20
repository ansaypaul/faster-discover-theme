'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour détecter si l'hydratation est terminée
 * Utile pour éviter les erreurs d'hydratation en rendant différemment côté serveur/client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook plus avancé qui permet de détecter si on est côté client
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
