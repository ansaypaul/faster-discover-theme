/**
 * Utilitaires pour éviter les erreurs d'hydratation
 * 
 * Ce fichier contient des fonctions et des patterns pour s'assurer que le rendu
 * côté serveur correspond exactement au rendu côté client.
 */

/**
 * Vérifie si on est côté client de manière sûre
 */
export const isClient = () => typeof window !== 'undefined';

/**
 * Vérifie si on est côté serveur de manière sûre
 */
export const isServer = () => typeof window === 'undefined';

/**
 * Format une date de manière cohérente entre serveur et client
 * Utilise toujours la même timezone pour éviter les différences
 */
export const formatDateSafe = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Utiliser UTC pour garantir la cohérence
    return dateObj.toLocaleDateString('fr-FR', {
      timeZone: 'Europe/Paris', // Timezone fixe pour éviter les différences serveur/client
      ...options
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Date invalide';
  }
};

/**
 * Génère un ID stable basé sur le contenu pour éviter les problèmes d'hydratation
 */
export const generateStableId = (content: string): string => {
  // Simple hash pour créer un ID stable basé sur le contenu
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en 32-bit integer
  }
  return `stable-${Math.abs(hash)}`;
};

/**
 * Constantes pour les fallbacks d'hydratation
 */
export const HYDRATION_FALLBACKS = {
  LOADING: 'Chargement...',
  DATE_LOADING: 'Date en cours de chargement...',
  CONTENT_LOADING: 'Contenu en cours de chargement...',
  INVALID_DATE: 'Date invalide',
  NO_CONTENT: 'Aucun contenu disponible'
} as const;

/**
 * Pattern pour créer des composants résistants à l'hydratation
 */
export type HydrationSafeComponentProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Liste des problèmes d'hydratation les plus courants et leurs solutions
 */
export const HYDRATION_BEST_PRACTICES = {
  // ❌ Éviter : new Date() sans paramètres
  // ✅ Utiliser : new Date(dateString) avec une date fixe
  
  // ❌ Éviter : Math.random() pour les IDs
  // ✅ Utiliser : IDs stables basés sur le contenu
  
  // ❌ Éviter : typeof window !== 'undefined' dans le rendu
  // ✅ Utiliser : useEffect + useState pour les différences client/serveur
  
  // ❌ Éviter : formatage de date avec toLocaleDateString() sans timezone
  // ✅ Utiliser : formatage avec timezone fixe ou composant SafeDate
  
  // ❌ Éviter : innerHTML directement dans les composants
  // ✅ Utiliser : dangerouslySetInnerHTML avec suppressHydrationWarning si nécessaire
} as const;
