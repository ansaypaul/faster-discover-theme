import { gql } from '@apollo/client';

export const GET_AUTHOR_SLUGS = gql`
  query GetAuthorSlugs {
    users {
      nodes {
        slug
      }
    }
  }
`;

export const GET_AUTHOR_AND_ARTICLES = gql`
  query GetAuthorAndArticles($slug: String!, $offset: Int, $size: Int) {
    user(slug: $slug) {
      name
      slug
      description
      avatar {
        url
      }
      posts(first: $size, offset: $offset) {
        nodes {
          id
          title
          uri
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
              srcSet
              sizes
            }
          }
        }
        pageInfo {
          total
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
            mediaDetails {
              width
              height
            }
            srcSet
            sizes
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