import { Article, Category, Page } from '@/types';
import { 
  getPostBySlug, 
  getCategoryBySlug as getWPCategoryBySlug, 
  getPostsByCategorySlug,
  getAllCategories,
  getRecentPostsWithCategories,
  getPageBySlug as getWPPageBySlug,
  getAllPageSlugs as getWPPageSlugs
} from './wordpress';
import { RenderType } from './buildInfo';

// Variable pour suivre l'origine des données
let currentRenderType: RenderType = 'isr';

// Variable pour suivre si on utilise le cache ISR
let isUsingCache = true;
let requestStartTime: number | null = null;

export function setRenderType(type: RenderType) {
  currentRenderType = type;
}

export function getCurrentRenderType(): RenderType {
  return currentRenderType;
}

export function startRequestTimer() {
  requestStartTime = Date.now();
  isUsingCache = true; // On suppose qu'on utilise le cache par défaut
}

export function endRequestTimer() {
  if (!requestStartTime) return;
  
  // Si la requête prend plus de 100ms, c'est qu'on n'utilise pas le cache
  const requestTime = Date.now() - requestStartTime;
  isUsingCache = requestTime < 100;
  requestStartTime = null;
}

export function isISRCache(): boolean {
  return isUsingCache;
}

// Type pour les options de revalidation
type FetchOptions = {
  next?: {
    revalidate?: number;
  };
};

// Fonction pour récupérer tous les slugs d'articles
export async function getAllArticleSlugs(options?: FetchOptions): Promise<string[]> {
  // TODO: Implémenter avec une requête GraphQL spécifique pour les slugs
  const posts = await getRecentPostsWithCategories(100, options); // Limite à 100 pour l'exemple
  return posts.map(post => post.slug);
}

// Fonction pour récupérer tous les slugs de catégories
export async function getAllCategorySlugs(options?: FetchOptions): Promise<string[]> {
  const categories = await getAllCategories(options);
  return categories.map(category => category.slug);
}

// Fonction pour récupérer un article par son slug
export async function getArticleBySlug(slug: string, options?: FetchOptions): Promise<Article | null> {
  startRequestTimer();
  try {
    // Si l'appel vient d'une requête OpenGraph
    if (process.env.NEXT_PUBLIC_IS_OPENGRAPH) {
      setRenderType('opengraph');
    } else {
      setRenderType('isr');
    }
    
    const article = await getPostBySlug(slug, options);
    endRequestTimer();
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    endRequestTimer();
    return null;
  }
}

// Fonction pour récupérer une catégorie par son slug
export async function getCategoryBySlug(slug: string, options?: FetchOptions): Promise<Category | null> {
  return getWPCategoryBySlug(slug, options);
}

// Fonction pour récupérer les articles d'une catégorie
export async function getArticlesInCategory(slug: string, options?: FetchOptions): Promise<Article[]> {
  return getPostsByCategorySlug(slug, options);
}

// Fonction pour récupérer une page par son slug
export async function getPageBySlug(slug: string, options?: FetchOptions): Promise<Page | null> {
  return getWPPageBySlug(slug, options);
}

// Fonction pour récupérer tous les slugs de pages
export async function getAllPageSlugs(options?: FetchOptions): Promise<string[]> {
  return getWPPageSlugs(options);
} 