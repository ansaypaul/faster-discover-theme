'use client';

import Image from 'next/image';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface AmazonProductProps {
  asin: string;
  title: string;
  image: string;
  price?: string;
  oldPrice?: string;
  link: string;
  description?: string;
  isPrime?: boolean;
}

/**
 * Composant serveur pour afficher un produit Amazon avec design moderne
 * Remplace les box AAWP avec un design personnalisé en Tailwind
 */
export default function AmazonProduct({
  asin,
  title,
  image,
  price,
  oldPrice,
  link,
  description,
  isPrime = false
}: AmazonProductProps) {
  return (
    <div 
      className="my-6 bg-gaming-dark-card border border-gaming-border rounded-lg overflow-hidden"
      data-amazon-product={asin}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative flex-shrink-0 w-full sm:w-48 bg-white p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gaming-border">
          <div className="flex items-center justify-center h-40">
            <Image
              src={image}
              alt={title}
              width={160}
              height={160}
              className="object-contain max-w-full max-h-full"
              loading="lazy"
              sizes="(max-width: 640px) 160px, 160px"
            />
          </div>
          {isPrime && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
              Prime
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          {/* Title */}
          <div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="text-lg font-bold text-white hover:text-gaming-accent transition-colors line-clamp-2 mb-3 block"
            >
              {title}
            </a>

            {/* Description */}
            {description && (
              <div 
                className="text-sm text-gray-400 mb-3 line-clamp-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

          {/* Footer with Price & Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gaming-border mt-auto">
            {/* Pricing */}
            <div className="flex flex-col gap-1">
              {price && (
                <span className="text-2xl sm:text-3xl font-bold text-gaming-accent">
                  {price}
                </span>
              )}
              {oldPrice && !oldPrice.startsWith('-') && (
                <span className="text-xs text-gray-500 line-through">
                  {oldPrice}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-2 bg-gaming-accent text-gaming-dark font-bold px-5 py-2.5 rounded-lg whitespace-nowrap shadow-lg no-underline"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Voir sur Amazon</span>
              <span className="sm:hidden">Amazon</span>
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
