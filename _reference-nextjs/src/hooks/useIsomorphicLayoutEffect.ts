import { useEffect, useLayoutEffect } from 'react';

/**
 * Hook pour utiliser useLayoutEffect côté client et useEffect côté serveur
 * Évite les warnings d'hydratation
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
