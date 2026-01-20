import { useEffect, useState } from 'react';
import { Article } from '@/types';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.worldofgeek.fr/graphql';

interface SearchPostsResponse {
  posts: {
    nodes: Array<{
      id: string;
      title: string;
      excerpt: string;
      content: string;
      uri: string;
      featuredImage: {
        node: {
          sourceUrl: string;
        };
      } | null;
      categories: {
        nodes: Array<{
          id: string;
          name: string;
        }>;
      };
      author: {
        node: {
          name: string;
        };
      };
      date: string;
    }>;
  };
}

// Fonction pour nettoyer le HTML des extraits
function cleanExcerpt(html: string): string {
  // Supprime les balises HTML
  const withoutTags = html.replace(/<[^>]+>/g, '');
  // Convertit les entités HTML courantes
  return withoutTags
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8230;/g, '...')
    .trim();
}

export function useSearchPosts(query: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function searchPosts() {
      if (!query.trim()) {
        setArticles([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query SearchPosts($search: String!) {
                posts(where: { search: $search }) {
                  nodes {
                    id
                    title
                    excerpt
                    content
                    uri
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                    categories {
                      nodes {
                        id
                        name
                      }
                    }
                    author {
                      node {
                        name
                      }
                    }
                    date
                  }
                }
              }
            `,
            variables: {
              search: query,
            },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const results = (data.data as SearchPostsResponse).posts.nodes.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: cleanExcerpt(post.excerpt),
          content: post.content,
          slug: post.uri.replace(/^\/|\/$/g, ''),
          featuredImage: {
            sourceUrl: post.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg',
            altText: post.title
          },
          date: post.date,
          author: {
            name: post.author.node.name
          },
          categories: post.categories.nodes.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.name.toLowerCase().replace(/\s+/g, '-')
          }))
        }));

        setArticles(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setLoading(false);
      }
    }

    searchPosts();
  }, [query]);

  return { articles, loading, error };
} 