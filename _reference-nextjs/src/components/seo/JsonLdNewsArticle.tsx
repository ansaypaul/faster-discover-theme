import { FC } from 'react';

interface JsonLdNewsArticleProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorSlug?: string;
  articleUrl: string;
  publisherName?: string;
  publisherLogo?: string;
}

/**
 * Nettoie une chaîne de caractères en supprimant les balises HTML
 * Version compatible SSR (ne dépend pas de document)
 */
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/&nbsp;/g, ' ') // Remplace les &nbsp; par des espaces
    .replace(/\s+/g, ' ') // Normalise les espaces multiples
    .trim(); // Supprime les espaces au début et à la fin
};

/**
 * S'assure qu'une date est au format ISO 8601 avec fuseau horaire
 */
const ensureTimezone = (dateString: string): string => {
  // Si la date contient déjà un fuseau horaire (Z, +XX:XX, ou -XX:XX), on la retourne telle quelle
  if (/Z|[+-]\d{2}:?\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Sinon on ajoute +00:00 par défaut
  return `${dateString.replace(/\s/, 'T')}+00:00`;
};

/**
 * Génère l'URL de l'auteur
 */
const getAuthorUrl = (authorSlug?: string): string => {
  const baseUrl = 'https://worldofgeek.fr/author';
  return authorSlug ? `${baseUrl}/${authorSlug}` : baseUrl;
};

/**
 * Composant qui génère un rich snippet JSON-LD pour un article de news
 * Conforme à la spécification schema.org et aux recommandations Google
 * @see https://developers.google.com/search/docs/appearance/structured-data/news-article
 */
const JsonLdNewsArticle: FC<JsonLdNewsArticleProps> = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  authorSlug,
  articleUrl,
  publisherName = 'World of Geek',
  publisherLogo = 'https://worldofgeek.fr/wp-content/uploads/2025/05/worldofgeek-fr.png'
}) => {
  // Nettoyer la description des balises HTML
  const cleanDescription = stripHtml(description);

  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title.substring(0, 110), // Google limite à 110 caractères
    description: cleanDescription,
    image: image ? [image] : undefined, // L'image doit être un tableau pour Google
    datePublished: ensureTimezone(datePublished),
    dateModified: ensureTimezone(dateModified || datePublished),
    author: authorName ? {
      '@type': 'Person',
      name: authorName,
      url: getAuthorUrl(authorSlug)
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
      '@id': articleUrl
    }
  };

  // Supprimer les propriétés undefined pour avoir un JSON-LD valide
  const cleanArticleData = JSON.parse(JSON.stringify(articleData));

  // Log pour debug et validation
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 JSON-LD News Article Data:', JSON.stringify(cleanArticleData, null, 2));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanArticleData) }}
    />
  );
};

export default JsonLdNewsArticle; 