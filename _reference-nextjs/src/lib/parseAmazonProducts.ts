import * as cheerio from 'cheerio';

export interface AmazonProductData {
  asin: string;
  title: string;
  image: string;
  price?: string;
  oldPrice?: string;
  link: string;
  description?: string;
  isPrime: boolean;
}

/**
 * Parse le HTML WordPress et extrait les données des produits Amazon AAWP
 * Cette fonction s'exécute côté serveur uniquement
 */
export function parseAmazonProducts(html: string): {
  html: string;
  products: AmazonProductData[];
} {
  // Vérification rapide : si pas de produits AAWP, retourner directement
  if (!html.includes('aawp-product')) {
    return { html, products: [] };
  }

  const $ = cheerio.load(html);
  const products: AmazonProductData[] = [];
  
  // Trouver tous les produits AAWP
  $('.aawp-product').each((index, element) => {
    try {
      const $element = $(element);
      
      const asin = $element.attr('data-aawp-product-asin') || `product-${index}`;
      const title = $element.find('.aawp-product__title').text().trim();
      const image = $element.find('.aawp-product__image').attr('src') || '';
      const price = $element.find('.aawp-product__price--current').text().trim();
      const oldPrice = $element.find('.aawp-product__price--saved').text().trim();
      const link = $element.find('.aawp-button--buy').attr('href') || '';
      const description = $element.find('.aawp-product__description').html() || undefined;
      const isPrime = $element.find('.aawp-check-prime').length > 0;
      
      if (!title || !image || !link) return;

      const productData: AmazonProductData = {
        asin,
        title,
        image,
        price: price || undefined,
        oldPrice: oldPrice || undefined,
        link,
        description,
        isPrime
      };

      products.push(productData);
      
      // Remplacer par un marqueur simple avec l'index
      $element.replaceWith(`<div data-amazon-product-id="${products.length - 1}"></div>`);

      console.log('✅ Amazon product parsed (SSR):', title);
      
    } catch (error) {
      console.error('Error parsing AAWP product:', error);
    }
  });

  return {
    html: $.html(),
    products
  };
}
