import Image from 'next/image';

interface SafeWordPressImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function SafeWordPressImage({ 
  src, 
  alt, 
  width = 1200, 
  height = 675, 
  className = "",
  priority = false 
}: SafeWordPressImageProps) {
  // Vérifier si l'URL est relative ou absolue
  const imageUrl = src.startsWith('http') ? src : `https://worldofgeek.fr${src}`;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={`w-full h-auto object-contain mx-auto ${className}`.trim()}
      sizes="(min-width: 1024px) 956px, (min-width: 768px) 708px, calc(100vw - 32px)"
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
    />
  );
}

export default SafeWordPressImage; 