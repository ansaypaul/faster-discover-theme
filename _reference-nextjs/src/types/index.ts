export interface Game {
  id: string;
  title: string;
  slug: string;
  uri: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  };
  siteRating?: number;
  userRating?: number;
  platforms?: string[];
  plateforme?: string;
  ficheJeu?: {
    imageVerticale?: {
      node?: {
        sourceUrl: string;
      };
    };
  };
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  date: string;
  modified?: string;
  seo?: SEO;
  featuredImage?: {
    sourceUrl: string;
    altText?: string;
  };
  author?: {
    name: string;
    slug?: string;
    avatar?: {
      url?: string;
    };
  };
  categories?: Category[];
  readTime?: number;
  tags?: Tag[];
}

export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seo?: SEO;
  featuredImage?: {
    sourceUrl: string;
    altText: string;
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo?: SEO;
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
    slug?: string;
    avatar?: {
      url?: string;
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

export interface GameACF {
  plateformes: string[];
  genres: string[];
  note: number;
  nbAvis: number;
}

export interface GameCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage: {
    sourceUrl: string;
    altText: string;
  };
  jeuxACF: {
    plateformes: string[];
    genres: string[];
    note: number;
    nbAvis: number;
  };
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface SortOption extends FilterOption {
  order: 'asc' | 'desc';
}

export interface SEO {
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
} 