'use client';

import { forwardRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: 'div' | 'span' | 'p' | 'article' | 'section';
};

const SafeHtml = forwardRef<HTMLDivElement, SafeHtmlProps>(
  ({ html, className, as = 'div' }, ref) => {
    const Tag = as;

    // Nettoyer le HTML avec DOMPurify
    const cleanHtml = DOMPurify.sanitize(html || '', {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        'p', 'b', 'i', 'em', 'strong', 'a', 'br', 'div', 'iframe', 'span',
        'img', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'id', 'style',
        'src', 'alt', 'width', 'height', 'loading', 'decoding', 'title',
        'data-youtube-component', 'data-video-id', 'data-title', 'data-hydrated',
        'data-aawp-product-asin', 'data-aawp-product-id', 'data-aawp-tracking-id', 'data-aawp-product-title'
      ]
    });

    // Toujours retourner le même contenu pour éviter les erreurs d'hydratation
    return (
      <Tag 
        ref={ref}
        className={className}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
        suppressHydrationWarning={true}
      />
    );
  }
);

SafeHtml.displayName = 'SafeHtml';

export default SafeHtml; 