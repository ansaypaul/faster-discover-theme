import { Metadata } from 'next';
import { SEO } from '@/types';

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'article' | 'website';
  locale?: string;
  siteName?: string;
  publishedTime?: string;
  rankMathSeo?: SEO;
}

const DEFAULT_CONFIG = {
  type: 'article' as const,
  locale: 'fr_FR',
  siteName: 'World of Geek'
};

// Fonction pour générer l'URL canonique absolue
const getCanonicalUrl = (path: string) =>
  path.startsWith('http') ? path : `https://worldofgeek.fr${path.startsWith('/') ? path : '/' + path}`;

export function generateSeoMetadata({
  title,
  description,
  image,
  canonical,
  type = DEFAULT_CONFIG.type,
  locale = DEFAULT_CONFIG.locale,
  siteName = DEFAULT_CONFIG.siteName,
  publishedTime,
}: SeoProps): Metadata {
  // Base metadata
  const metadata: Metadata = {
    title,
    description,
    alternates: canonical ? {
      canonical: getCanonicalUrl(canonical),
    } : undefined,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  };

  // OpenGraph metadata
  metadata.openGraph = {
    title,
    description,
    type,
    locale,
    siteName,
    ...(publishedTime && type === 'article' ? { publishedTime } : {}),
    ...(image ? {
      images: [{
        url: image,
        alt: title,
      }],
    } : {}),
  };

  // Twitter metadata
  metadata.twitter = {
    card: 'summary_large_image',
    title,
    description,
    ...(image ? {
      images: [image],
    } : {}),
  };

  return metadata;
} 