'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { GameCard as GameCardType } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';
import SafeHtml from '@/components/common/SafeHtml';

interface GameCardProps {
  game: GameCardType;
}

export default function GameCard({ game }: GameCardProps) {

  return (
    <Link 
      href={`/jeux/${game.slug}`}
      className="block bg-gaming-dark-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-video">
        <Image
          src={game.featuredImage.sourceUrl}
          alt={game.featuredImage.altText || game.title}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 288px, (min-width: 768px) 456px, calc(100vw - 32px)"
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {game.title}
        </h2>
        
        <div className="flex items-center gap-2 mb-3">
          {game.author && (
            <div className="flex items-center gap-2">
              {game.author.avatar?.url && (
                <Image
                  src={game.author.avatar.url}
                  alt={game.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-sm text-gray-400">{game.author.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {game.jeuxACF.genres.map((genre) => (
            <span 
              key={genre}
              className="px-2 py-1 text-xs font-medium bg-gaming-accent/10 text-gaming-accent rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {game.jeuxACF.plateformes.map((plateforme) => (
            <span 
              key={plateforme}
              className="px-2 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full"
            >
              {plateforme}
            </span>
          ))}
        </div>
        
        <SafeHtml
          html={game.excerpt}
          as="div"
          className="text-sm text-gray-400 mb-4 line-clamp-2"
        />
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gaming-accent">
            <StarIcon className="w-5 h-5" />
            <span className="font-medium">{game.jeuxACF.note.toFixed(1)}</span>
            <span className="text-gray-500">({game.jeuxACF.nbAvis})</span>
          </div>
          
          <time dateTime={game.date} className="text-gray-400">
            {new Date(game.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </Link>
  );
} 