"use client";

import { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

const DEFAULT_IMAGE = "/images/placeholder.svg";

interface ImageProps extends Omit<NextImageProps, 'onError' | 'src'> {
  src?: string | null;
}

export function Image({ src, alt, ...props }: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <NextImage
      {...props}
      src={error ? DEFAULT_IMAGE : src || DEFAULT_IMAGE}
      alt={alt || 'Image'}
      onError={() => setError(true)}
    />
  );
}

export default Image; 