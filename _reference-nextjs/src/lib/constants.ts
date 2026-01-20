// Temps de revalidation en secondes
export const REVALIDATE_TIMES = {
  HOME: 600,        // 10 minutes - page d'accueil
  ARTICLES: 86400,  // 24 heures - les articles changent rarement une fois publiés
  NEWS: 600,        // 10 minutes - actualités
  GAMES: 86400,     // 24 heures - les fiches de jeux changent rarement
  CATEGORIES: 3600, // 1 heure - pour les listes d'articles dans les catégories
  PAGES: 86400,     // 24 heures - les pages statiques changent rarement
  DEFAULT: 3600     // 1 heure par défaut
} as const; 