'use client';

import { memo, useEffect, useRef } from 'react';
import LazyYouTube from '@/components/common/LazyYouTube';
import { createRoot } from 'react-dom/client';
import ArticleProse from '@/components/common/ArticleProse';

interface ArticleContentProps {
  content: string; // Contenu déjà traité côté serveur
}

const ArticleContent = memo(function ArticleContent({ content }: ArticleContentProps) {
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
  }, [content]);

  return (
    <div className="article-content">
      <ArticleProse
        ref={contentRef}
        html={content}
      />
    </div>
  );
});

export default ArticleContent; 