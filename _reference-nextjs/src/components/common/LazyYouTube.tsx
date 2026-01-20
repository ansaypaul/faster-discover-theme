'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyYouTubeProps {
  videoId: string;
  title?: string;
}

export default function LazyYouTube({ videoId, title }: LazyYouTubeProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const currentRef = containerRef.current;
    if (!currentRef) return;

    console.log('LazyYouTube mounted, videoId:', videoId);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('Intersection detected:', entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Déclencher quand 10% de l'élément est visible
        rootMargin: '50px', // Précharger un peu avant
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [videoId, isMounted]);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  console.log('LazyYouTube render, isIntersecting:', isIntersecting);

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-lg shadow-lg bg-black"
      style={{ paddingTop: '56.25%' }} // Ratio 16:9
    >
      <div className="absolute inset-0 w-full h-full">
        {isMounted && isIntersecting ? (
          <iframe
            src={embedUrl}
            title={title || `YouTube video ${videoId}`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full rounded-lg"
          />
        ) : (
          <div 
            className="w-full h-full bg-center bg-cover rounded-lg"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
            role="img"
            aria-label={title || `YouTube video thumbnail ${videoId}`}
          />
        )}
      </div>
    </div>
  );
}