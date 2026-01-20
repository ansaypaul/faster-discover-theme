'use client';

import { memo, useEffect, useRef } from 'react';
import AmazonProduct from '@/components/AmazonProduct';
import LazyYouTube from '@/components/common/LazyYouTube';
import { createRoot } from 'react-dom/client';
import type { AmazonProductData } from '@/lib/parseAmazonProducts';

interface ArticleContentWithProductsProps {
  html: string;
  products: AmazonProductData[];
}

/**
 * Composant client qui hydrate le contenu avec les produits Amazon et YouTube
 */
const ArticleContentWithProducts = memo(function ArticleContentWithProducts({ html, products }: ArticleContentWithProductsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Hydrater les composants YouTube
    const youtubeElements = contentRef.current.querySelectorAll('[data-youtube-component]:not([data-hydrated])');
    
    youtubeElements.forEach((element) => {
      const videoId = element.getAttribute('data-video-id');
      const title = element.getAttribute('data-title');

      if (!videoId) return;

      try {
        const container = document.createElement('div');
        container.className = 'my-8';
        
        const reactRoot = createRoot(container);
        reactRoot.render(<LazyYouTube videoId={videoId} title={title || undefined} />);
        
        element.setAttribute('data-hydrated', 'true');
        element.parentNode?.replaceChild(container, element);
      } catch (error) {
        console.error('Error rendering LazyYouTube:', error);
      }
    });

    // Hydrater les produits Amazon
    const amazonElements = contentRef.current.querySelectorAll('[data-amazon-product-id]:not([data-hydrated])');
    
    amazonElements.forEach((element) => {
      const productId = element.getAttribute('data-amazon-product-id');
      if (!productId) return;

      const productIndex = parseInt(productId, 10);
      const productData = products[productIndex];
      
      if (!productData) return;

      try {
        const container = document.createElement('div');
        const reactRoot = createRoot(container);
        reactRoot.render(<AmazonProduct {...productData} />);
        
        element.setAttribute('data-hydrated', 'true');
        element.parentNode?.replaceChild(container, element);
        
        console.log('✅ Amazon product hydrated:', productData.title);
      } catch (error) {
        console.error('Error rendering AmazonProduct:', error);
      }
    });
  }, [html, products]);

  return (
    <div className="article-content">
      <div ref={contentRef} className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});

export default ArticleContentWithProducts;
