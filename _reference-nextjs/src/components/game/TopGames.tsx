"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Users } from 'lucide-react';
import { Game } from '@/types';

interface TopGamesProps {
  games: Game[];
  title?: string;
}

const DEFAULT_GAME_IMAGE = "/images/game-placeholder.jpg";

const TopGames = ({ games, title = "Les meilleurs jeux du moment" }: TopGamesProps) => {
  if (!games?.length) {
    return null;
  }

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        {title}
      </h2>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-3 sm:space-x-4 pb-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:space-x-0">
          {games.map((game, index) => {
            const imageSrc = game.ficheJeu?.imageVerticale?.node?.sourceUrl || game.featuredImage?.node?.sourceUrl || DEFAULT_GAME_IMAGE;
            const imageAlt = game.featuredImage?.node?.altText || game.title;

            return (
              <Link 
                key={game.id}
                href={`/jeux/${game.slug}`}
                className="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors duration-300 flex-shrink-0 w-40 sm:w-auto"
              >
                <div className="relative h-24 sm:h-32 md:h-40">
                  <Image 
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gaming-accent text-gaming-dark px-2 py-1 rounded text-xs font-bold">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="p-2 sm:p-3">
                  <h3 className="text-white text-xs sm:text-sm font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                    {game.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-white">{game.siteRating || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gaming-accent">
                      <Users className="w-3 h-3" />
                      <span className="text-white">{game.userRating || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {game.plateforme || game.platforms?.[0] || 'Multi-plateformes'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopGames; 