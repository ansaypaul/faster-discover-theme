import { Author, AuthorArticle } from '@/types/author';
import { Article } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

interface PostNode {
  id: string;
  title: string;
  uri: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

interface LatestPostNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  author: {
    node: {
      name: string;
    };
  };
}

export async function getAuthorSlugs(): Promise<string[]> {
  const query = `
    query GetAuthorSlugs {
      users {
        nodes {
          slug
        }
      }
    }
  `;

  const response = await fetch(API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  console.log('Author slugs:', data?.users?.nodes);
  return data?.users?.nodes?.map((user: { slug: string }) => user.slug) || [];
}

export async function getAuthorAndArticles(
  slug: string
): Promise<{
  author: Author;
  articles: AuthorArticle[];
  totalArticles: number;
  latestPosts: Article[];
}> {
  console.log('Fetching author data for slug:', slug);
  console.log('API URL:', API_URL);

  const query = `
    query GetAuthorAndArticles($slug: ID!) {
      user(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        avatar {
          url
        }
        posts(first: 20) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            uri
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
      posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
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
            }
          }
        }
      }
    }
  `;

  const variables = { slug };
  console.log('GraphQL variables:', variables);

  const response = await fetch(API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  console.log('GraphQL response:', {
    data: result.data,
    errors: result.errors,
    user: result.data?.user,
  });
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  if (!result.data?.user) {
    console.error('Author not found:', { slug, result });
    throw new Error(`Author with slug "${slug}" not found`);
  }

  // Transformation des derniers articles pour correspondre au type Article
  const latestPosts = result.data.posts.nodes.map((post: LatestPostNode) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: {
      sourceUrl: post.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg',
      altText: post.featuredImage?.node?.altText || post.title
    },
    author: {
      name: post.author?.node?.name || 'Anonymous'
    }
  }));

  return {
    author: {
      id: result.data.user.id,
      name: result.data.user.name,
      slug: result.data.user.slug,
      picture: result.data.user.avatar?.url,
      role: 'Journaliste', // À personnaliser selon vos besoins
      shortDescription: result.data.user.description?.split('\n')[0] || `Articles de ${result.data.user.name}`,
      bio: result.data.user.description,
    },
    articles: result.data.user.posts.nodes.map((post: PostNode) => ({
      id: post.id,
      title: post.title,
      uri: post.uri,
      date: post.date,
      featuredImage: post.featuredImage,
    })),
    totalArticles: result.data.user.posts.nodes.length,
    latestPosts,
  };
} 