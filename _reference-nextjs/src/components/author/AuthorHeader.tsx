'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Author } from '@/types/author';

interface AuthorHeaderProps {
  author: Author;
}

const AuthorHeader = memo(function AuthorHeader({ author }: AuthorHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Author Image */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-gaming-dark-card">
            {author.picture ? (
              <Image
                src={author.picture}
                alt={`Photo de ${author.name}`}
                fill
                className="object-cover rounded-full"
                sizes="(min-width: 768px) 160px, 128px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl text-gray-500 font-bold">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex-grow">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {author.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            {author.role && (
              <div className="font-medium text-gaming-accent">
                {author.role}
              </div>
            )}
            {author.social && (
              <div className="flex items-center gap-4">
                {author.social.twitter && (
                  <Link
                    href={`https://twitter.com/${author.social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gaming-accent transition-colors"
                  >
                    Twitter
                  </Link>
                )}
                {author.social.website && (
                  <Link
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gaming-accent transition-colors"
                  >
                    Site web
                  </Link>
                )}
              </div>
            )}
          </div>

          {author.shortDescription && (
            <p className="text-gray-300 text-base">
              {author.shortDescription}
            </p>
          )}
        </div>
      </div>
    </header>
  );
});

export default AuthorHeader; 