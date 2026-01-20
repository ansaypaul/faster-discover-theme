export interface Author {
  id: string;
  name: string;
  slug: string;
  picture?: string;
  role?: string;
  shortDescription?: string;
  bio?: string;
  social?: {
    twitter?: string;
    website?: string;
  };
}

export interface AuthorArticle {
  id: string;
  title: string;
  uri: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  categories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export interface AuthorWithArticles extends Author {
  articles: AuthorArticle[];
} 