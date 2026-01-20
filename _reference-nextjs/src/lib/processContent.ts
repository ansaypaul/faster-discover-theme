import { extractYouTubeVideoId } from '@/utils/youtube';
import { parseAmazonProducts, type AmazonProductData } from './parseAmazonProducts';

/**
 * Traite le contenu HTML côté serveur pour optimiser le rendu client
 * - Transforme les iframes YouTube en marqueurs pour LazyYouTube
 * - Parse les produits Amazon AAWP
 * - S'exécute UNE SEULE FOIS côté serveur (pas à chaque render client)
 */
export function processContentServer(content: string): {
  html: string;
  products: AmazonProductData[];
} {
  if (!content) return { html: '', products: [] };

  // Vérifier si le contenu a déjà été traité
  if (content.includes('data-youtube-component')) {
    return content;
  }

  // Fonction pour transformer une iframe YouTube en composant LazyYouTube
  const processYouTubeIframe = (match: string) => {
    // Extraire l'iframe du match (qui peut inclure des divs parents)
    const iframeMatch = match.match(/<iframe[^>]*>[^<]*<\/iframe>/);
    if (!iframeMatch) return match;
    
    const iframe = iframeMatch[0];

    // Vérifier si c'est une iframe YouTube
    if (!iframe.includes('youtube.com') && !iframe.includes('youtu.be')) {
      return match;
    }

    // Extraire les attributs src et title
    const srcMatch = iframe.match(/src="([^"]+)"/);
    const titleMatch = iframe.match(/title="([^"]+)"/);
    
    const src = srcMatch ? srcMatch[1] : '';
    const title = titleMatch ? titleMatch[1] : 'YouTube video';

    // Extraire le videoId
    const videoId = extractYouTubeVideoId(src);
    
    if (!videoId) return match;

    // Retourner le balisage pour le composant LazyYouTube
    return `<div data-youtube-component data-video-id="${videoId}" data-title="${title}"></div>`;
  };

  // Remplacer les iframes YouTube (avec leurs divs conteneurs potentiels)
  let processedContent = content.replace(
    /<div[^>]*>(?:\s*<div[^>]*>)*\s*<iframe[^>]*>[^<]*<\/iframe>\s*(?:<\/div>)*\s*<\/div>|<iframe[^>]*>[^<]*<\/iframe>/g,
    processYouTubeIframe
  );

  // Chercher les liens YouTube directs (balises <a>)
  const youtubeLinks = /(?:<p>)?<a[^>]*href="(https?:\/\/(www\.)?(youtube\.com|youtu\.be)[^"]+)"[^>]*>.*?<\/a>(?:<\/p>)?/g;
  processedContent = processedContent.replace(youtubeLinks, (match, url) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return match;
    return `<div data-youtube-component data-video-id="${videoId}"></div>`;
  });

  // Chercher les liens YouTube avec @ (format WordPress spécial)
  const youtubeUrls = /@(https?:\/\/(www\.)?(youtube\.com|youtu\.be)[^\s<>]+)/g;
  processedContent = processedContent.replace(youtubeUrls, (match, url) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return match;
    return `<div data-youtube-component data-video-id="${videoId}"></div>`;
  });

  // Chercher les liens YouTube simples (URLs complètes sur leurs propres lignes)
  const simpleYoutubeUrls = /(^|\n|<\/?\w+>|\s)(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s<>\n]+)/g;
  processedContent = processedContent.replace(simpleYoutubeUrls, (match, prefix, url) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return match;
    return `${prefix}<div data-youtube-component data-video-id="${videoId}"></div>`;
  });

  // Parser les produits Amazon
  const { html: finalHtml, products } = parseAmazonProducts(processedContent);

  return {
    html: finalHtml,
    products
  };
}
