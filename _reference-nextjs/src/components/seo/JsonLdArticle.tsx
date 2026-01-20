import { FC } from 'react';

type ArticleType = 'Article' | 'NewsArticle';

interface JsonLdArticleProps {
  type?: ArticleType;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
}

const JsonLdArticle: FC<JsonLdArticleProps> = ({
  type = 'NewsArticle',
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName = 'World of Geek',
  publisherLogo = 'https://worldofgeek.fr/logo-og.jpg'
}) => {
  const articleData = {
    '@context': 'https://schema.org',
    '@type': type,
    headline,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorName ? {
      '@type': 'Person',
      name: authorName
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : undefined
    }
  };

  // Supprimer les propriétés undefined pour avoir un JSON-LD valide
  const cleanArticleData = JSON.parse(JSON.stringify(articleData));
  
  // Log pour debug
  console.log('📊 JSON-LD Article Data:', JSON.stringify(cleanArticleData, null, 2));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanArticleData) }}
    />
  );
};

export default JsonLdArticle; 