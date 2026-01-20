import { Article, Category, Page } from '@/types';

// Cache pour éviter les appels redondants
const articleCache = new Map<string, Article | null>();
const categoryCache = new Map<string, Category | null>();
const pageCache = new Map<string, Page | null>();

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// Cache times in seconds
const CACHE_TIMES: Record<string, number> = {
  article: 86400,    // 24 heures - les articles changent rarement une fois publiés
  category: 3600,    // 1 heure - pour les listes d'articles dans les catégories
  page: 86400,       // 24 heures - les pages statiques changent rarement
  jeu: 86400,        // 24 heures - les fiches de jeux changent rarement
  default: 3600      // 1 heure par défaut
};

interface WPNode {
  id: string;
  name: string;
  slug: string;
}

interface WPPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  date: string;
  uri: string;
  seo?: {
    title: string;
    description: string;
    canonicalUrl: string;
    openGraph: {
      title: string;
      description: string;
      image: {
        secureUrl: string;
      };
    };
  };
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author?: {
    node?: {
      name: string;
      slug: string;
      avatar?: {
        url: string;
      };
    };
  };
  categories?: {
    nodes: WPNode[];
  };
}

interface WPCategory extends WPNode {
  databaseId: number;
  count?: number;
  description?: string;
}

interface LatestPostsResponse {
  posts: {
    nodes: WPPost[];
  };
}

interface PostBySlugResponse {
  post: WPPost | null;
}

interface CategoriesResponse {
  categories: {
    nodes: WPCategory[];
  };
}

interface CategoryBySlugResponse {
  category: WPCategory | null;
}

interface PostsByCategoryResponse {
  posts: {
    nodes: WPPost[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
  categories: {
    nodes: Array<{
      count: number;
    }>;
  };
}

interface PostsByCategorySlugResponse {
  posts: {
    nodes: WPPost[];
  };
}

interface PageBySlugResponse {
  page: Page | null;
}

interface AllPagesResponse {
  pages: {
    nodes: Page[];
  };
}

interface WPJeu {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author?: {
    node?: {
      name: string;
      slug: string;
      avatar?: {
        url: string;
      };
    };
  };
  plateformes?: {
    nodes: Array<{
      name: string;
    }>;
  };
  ficheJeu?: {
    imageVerticale?: {
      node?: {
        sourceUrl: string;
      };
    };
    synopsis?: string;
  };
}

interface JeuxResponse {
  jeux: {
    nodes: WPJeu[];
  };
}

interface JeuBySlugResponse {
  jeu: WPJeu;
}

export interface Jeu {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author?: {
    name: string;
    slug: string;
    avatar?: {
      url: string;
    };
  };
  plateformes?: {
    nodes: Array<{
      name: string;
    }>;
  };
  ficheJeu?: {
    imageVerticale?: {
      node?: {
        sourceUrl: string;
      };
    };
    synopsis?: string;
  };
}

// Type pour les options de revalidation
type FetchOptions = {
  next?: {
    revalidate?: number | false;
  };
  cache?: RequestCache;
};

// Initialize WordPress API
export async function initWordPressAPI() {
  try {
    await fetchAPI<{ status: string }>(`
      query HealthCheck {
        status: generalSettings {
          title
        }
      }
    `);
    console.log('✅ WordPress API initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize WordPress API:', error);
  }
}

// Internal API fetching function
async function fetchAPI<T>(
  query: string, 
  variables = {}, 
  options?: FetchOptions
): Promise<T> {
  if (!API_URL) {
    throw new Error('WordPress API URL is not defined');
  }

  // Par défaut, on utilise ISR avec le temps de cache par défaut
  const defaultOptions = {
    next: {
      revalidate: CACHE_TIMES.default
    }
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    ...defaultOptions,
    ...options // Les options passées peuvent surcharger les valeurs par défaut
  };

  const res = await fetch(API_URL, fetchOptions);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getLatestPosts(first = 10, options?: FetchOptions): Promise<Article[]> {
  const data = await fetchAPI<LatestPostsResponse>(
    `
    query LatestPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          uri
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
    `,
    { first },
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.article } }
  );

  return data.posts.nodes.map(transformPostData);
}

export async function getPostBySlug(slug: string): Promise<Article | null> {
  // Vérifie d'abord le cache en mémoire
  if (articleCache.has(slug)) {
    return articleCache.get(slug) ?? null;
  }

  const data = await fetchAPI<PostBySlugResponse>(
    `query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        content
        excerpt
        date
        uri
        seo {
          title
          description
          canonicalUrl
          openGraph {
            title
            description
            image {
              secureUrl
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            slug
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }`,
    { slug },
    { next: { revalidate: CACHE_TIMES.article } }
  );

  const article = data.post ? transformPostData(data.post) : null;
  articleCache.set(slug, article);
  return article;
}

export async function getCategories(options?: FetchOptions): Promise<Category[]> {
  const data = await fetchAPI<CategoriesResponse>(`
    query Categories {
      categories(first: 100, where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `, {}, { 
    next: { 
      revalidate: options?.next?.revalidate ?? CACHE_TIMES.category 
    } 
  });

  return data.categories.nodes;
}

function transformPostData(post: WPPost): Article {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    date: post.date,
    seo: post.seo,
    featuredImage: post.featuredImage?.node ? {
      sourceUrl: post.featuredImage.node.sourceUrl || '/images/article-placeholder.jpg',
      altText: post.featuredImage.node.altText || post.title
    } : undefined,
    author: post.author?.node ? {
      name: post.author.node.name || 'Anonyme',
      slug: post.author.node.slug,
      avatar: post.author.node.avatar
    } : undefined,
    categories: post.categories?.nodes.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug
    }))
  };
}

export async function generateStaticParams() {
  const posts = await getLatestPosts(100);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Récupère une catégorie par son slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // Vérifie d'abord le cache en mémoire
  if (categoryCache.has(slug)) {
    return categoryCache.get(slug) ?? null;
  }

  const data = await fetchAPI<CategoryBySlugResponse>(
    `query CategoryBySlug($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        databaseId
        description
        seo {
          title
          description
          canonicalUrl
          openGraph {
            title
            description
            image {
              secureUrl
            }
          }
        }
      }
    }`,
    { slug },
    { next: { revalidate: CACHE_TIMES.category } }
  );

  const category = data.category || null;
  categoryCache.set(slug, category);
  return category;
}

// Récupère les articles d'une catégorie
export async function getPostsByCategory(categoryId: number, page = 1, perPage = 10, options?: FetchOptions): Promise<{
  posts: Article[];
  total: number;
  totalPages: number;
}> {
  const data = await fetchAPI<PostsByCategoryResponse>(`
    query PostsByCategory($categoryId: Int!, $first: Int!) {
      posts(
        first: $first,
        where: {
          orderby: { field: DATE, order: DESC }
          categoryId: $categoryId
          status: PUBLISH
        }
      ) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
        pageInfo {
          total
        }
      }
      categories(where: { categoryId: $categoryId }) {
        nodes {
          count
        }
      }
    }
  `, { 
    categoryId, 
    first: perPage
  }, options);

  const posts = data?.posts?.nodes.map(transformPostData) ?? [];
  const total = data?.categories?.nodes?.[0]?.count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  // Si on n'est pas sur la première page, on skip les articles précédents
  const startIndex = (page - 1) * perPage;
  const paginatedPosts = posts.slice(startIndex, startIndex + perPage);

  return {
    posts: paginatedPosts,
    total,
    totalPages
  };
}

// Récupère toutes les catégories
export async function getAllCategories(options?: FetchOptions): Promise<Category[]> {
  const data = await fetchAPI<CategoriesResponse>(`
    query AllCategories {
      categories(first: 100) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `, {}, options);

  return data?.categories?.nodes ?? [];
}

// Récupère les articles d'une catégorie par son slug
export async function getPostsByCategorySlug(slug: string, options?: FetchOptions): Promise<Article[]> {
  const data = await fetchAPI<PostsByCategorySlugResponse>(
    `
    query PostsByCategory($slug: String!) {
      posts(where: { categoryName: $slug, orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          uri
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
    `,
    { slug },
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.category } }
  );

  return data.posts.nodes.map(transformPostData);
}

export async function getRecentPostsWithCategories(limit = 36, options?: FetchOptions): Promise<Article[]> {
  const data = await fetchAPI<LatestPostsResponse>(`
    query RecentPostsWithCategories($limit: Int!) {
      posts(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `, { limit }, options);

  return data.posts.nodes.map(transformPostData);
}

// Fonction pour récupérer TOUS les articles (pour le sitemap)
export async function getAllPostsForSitemap(options?: FetchOptions): Promise<Article[]> {
  let allPosts: Article[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  interface PaginatedPostsResponse {
    posts: {
      nodes: WPPost[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  }

  while (hasNextPage) {
    const data: PaginatedPostsResponse = await fetchAPI<PaginatedPostsResponse>(`
      query AllPostsForSitemap($after: String) {
        posts(first: 100, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                slug
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `, { after: endCursor }, options);

    const posts = data.posts.nodes.map(transformPostData);
    allPosts = [...allPosts, ...posts];
    
    hasNextPage = data.posts.pageInfo.hasNextPage;
    endCursor = data.posts.pageInfo.endCursor;

    console.log(`📄 Sitemap: ${allPosts.length} articles récupérés, hasNextPage: ${hasNextPage}`);
  }

  console.log(`✅ Sitemap: Total de ${allPosts.length} articles`);
  return allPosts;
}

export async function getRelatedArticles(articleId: string, limit = 4, options?: FetchOptions): Promise<Article[]> {
  const data = await fetchAPI<LatestPostsResponse>(
    `
    query RelatedPosts($articleId: ID!, $first: Int!) {
      posts(
        first: $first,
        where: {
          orderby: { field: DATE, order: DESC },
          notIn: [$articleId]
        }
      ) {
        nodes {
          id
          title
          slug
          excerpt
          date
          uri
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
    `,
    { articleId, first: limit },
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.article } }
  );

  return data.posts.nodes.map(transformPostData);
}

// Nouvelle fonction améliorée pour les articles reliés avec meilleure logique
export async function getRelatedArticlesImproved(articleId: string, limit = 4, options?: FetchOptions): Promise<Article[]> {
  // D'abord récupérer l'article actuel pour connaître ses catégories
  const currentArticle = await fetchAPI<{ post: WPPost | null }>(
    `
    query CurrentArticle($articleId: ID!) {
      post(id: $articleId, idType: DATABASE_ID) {
        categories {
          nodes {
            id
            slug
          }
        }
      }
    }
    `,
    { articleId }
  );

  const categoryIds = currentArticle.post?.categories?.nodes.map(cat => cat.id) || [];
  
  // Si on a des catégories, chercher d'abord dans les mêmes catégories
  if (categoryIds.length > 0) {
    const relatedByCategoryData = await fetchAPI<LatestPostsResponse>(
      `
      query RelatedPostsByCategory($articleId: ID!, $categoryIds: [ID!]!, $first: Int!) {
        posts(
          first: $first,
          where: {
            orderby: { field: DATE, order: DESC },
            notIn: [$articleId],
            categoryIn: $categoryIds
          }
        ) {
          nodes {
            id
            title
            slug
            excerpt
            date
            uri
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                slug
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
      `,
      { articleId, categoryIds, first: limit * 2 }, // Récupérer plus pour avoir le choix
      { next: { revalidate: options?.next?.revalidate ?? 7200 } } // Cache 2h pour les related
    );

    const relatedArticles = relatedByCategoryData.posts.nodes.map(transformPostData);
    
    // Si on a assez d'articles de la même catégorie, les retourner
    if (relatedArticles.length >= limit) {
      return relatedArticles.slice(0, limit);
    }

    // Sinon, compléter avec des articles récents
    const remainingLimit = limit - relatedArticles.length;
    const excludeIds = [articleId, ...relatedArticles.map(a => a.id)];
    
    const recentArticlesData = await fetchAPI<LatestPostsResponse>(
      `
      query RecentPosts($excludeIds: [ID!]!, $first: Int!) {
        posts(
          first: $first,
          where: {
            orderby: { field: DATE, order: DESC },
            notIn: $excludeIds
          }
        ) {
          nodes {
            id
            title
            slug
            excerpt
            date
            uri
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                slug
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
      `,
      { excludeIds, first: remainingLimit },
      { next: { revalidate: options?.next?.revalidate ?? 7200 } }
    );

    const recentArticles = recentArticlesData.posts.nodes.map(transformPostData);
    return [...relatedArticles, ...recentArticles];
  }

  // Fallback : articles récents si pas de catégories
  return getRelatedArticles(articleId, limit, options);
}

export async function getPageBySlug(slug: string, options?: FetchOptions): Promise<Page | null> {
  // Pages statiques : on peut utiliser force-cache car elles changent très rarement
  if (slug === 'mentions-legales' || slug === 'politique-de-confidentialite') {
    options = { cache: 'force-cache' };
  } else {
    options = { next: { revalidate: CACHE_TIMES.page } };
  }

  // Vérifie d'abord le cache en mémoire
  if (pageCache.has(slug)) {
    return pageCache.get(slug) ?? null;
  }

  const data = await fetchAPI<PageBySlugResponse>(
    `query PageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        slug
        content
        uri
        seo {
          title
          description
          canonicalUrl
          openGraph {
            title
            description
            image {
              secureUrl
            }
          }
        }
      }
    }`,
    { slug },
    options
  );

  const page = data.page || null;
  pageCache.set(slug, page);
  return page;
}

export async function getAllPageSlugs(options?: FetchOptions): Promise<string[]> {
  const data = await fetchAPI<AllPagesResponse>(
    `
    query AllPages {
      pages(first: 100) {
        nodes {
          slug
        }
      }
    }
    `,
    {},
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.page } }
  );

  return data.pages.nodes.map(page => page.slug);
}

function transformJeuData(jeu: WPJeu): Jeu {
  return {
    id: jeu.id,
    title: jeu.title,
    slug: jeu.slug,
    uri: jeu.uri,
    content: jeu.content,
    date: jeu.date,
    featuredImage: jeu.featuredImage,
    author: jeu.author?.node ? {
      name: jeu.author.node.name,
      slug: jeu.author.node.slug,
      avatar: jeu.author.node.avatar
    } : undefined,
    plateformes: jeu.plateformes,
    ficheJeu: jeu.ficheJeu,
  };
}

export async function getBestJeux(first = 10, options?: FetchOptions): Promise<Jeu[]> {
  const data = await fetchAPI<JeuxResponse>(
    `
    query BestJeux($first: Int!) {
      jeux(first: $first) {
        nodes {
          id
          title
          slug
          uri
          content
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          plateformes {
            nodes {
              name
            }
          }
          ficheJeu {
            imageVerticale {
              node {
                sourceUrl
              }
            }
            synopsis
          }
        }
      }
    }
    `,
    { first },
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.jeu } }
  );

  return data.jeux.nodes.map(transformJeuData);
}

export async function getJeuBySlug(slug: string, options?: FetchOptions): Promise<Jeu | null> {
  const data = await fetchAPI<JeuBySlugResponse>(
    `
    query JeuBySlug($slug: ID!) {
      jeu(id: $slug, idType: SLUG) {
        id
        title
        slug
        uri
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            slug
            avatar {
              url
            }
          }
        }
        plateformes {
          nodes {
            name
          }
        }
        ficheJeu {
          imageVerticale {
            node {
              sourceUrl
            }
          }
          synopsis
        }
      }
    }
    `,
    { slug },
    { next: { revalidate: options?.next?.revalidate ?? CACHE_TIMES.jeu } }
  );

  return data.jeu ? transformJeuData(data.jeu) : null;
}

// Nouvelle fonction pour la pagination des catégories avec curseurs (méthode WordPress GraphQL)
export async function getArticlesInCategoryPaginated(
  slug: string, 
  first = 12, 
  after?: string | null,
  options?: FetchOptions
): Promise<{
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
  };
}> {
  const data = await fetchAPI<{
    posts: {
      edges: Array<{
        node: WPPost;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        endCursor: string | null;
        startCursor: string | null;
      };
    };
  }>(`
    query PostsByCategoryPaginated($slug: String!, $first: Int!, $after: String) {
      posts(
        first: $first, 
        after: $after,
        where: { 
          categoryName: $slug, 
          orderby: { field: DATE, order: DESC },
          status: PUBLISH
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            id
            title
            slug
            excerpt
            date
            uri
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                slug
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  `, { 
    slug, 
    first, 
    after: after || null 
  }, { 
    next: { 
      revalidate: options?.next?.revalidate ?? CACHE_TIMES.category 
    } 
  });

  return {
    articles: data.posts.edges.map(edge => transformPostData(edge.node)),
    pageInfo: data.posts.pageInfo
  };
}

export async function getArticlesInCategory(slug: string, options?: FetchOptions): Promise<Article[]> {
  const data = await fetchAPI<PostsByCategorySlugResponse>(`
    query PostsByCategory($slug: String!) {
      posts(where: { categoryName: $slug }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
        }
      }
    }
  `, { slug }, { 
    next: { 
      revalidate: options?.next?.revalidate ?? CACHE_TIMES.category 
    } 
  });

  return data.posts.nodes.map(transformPostData);
} 