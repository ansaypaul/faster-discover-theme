"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star } from 'lucide-react';
import { Game } from '@/types';

const DEFAULT_IMAGE = "/images/placeholder.svg";

interface TopRankingsProps {
  games: Game[];
  title?: string;
}

const TopRankings = ({ games, title = "Top 10 des jeux de la semaine" }: TopRankingsProps) => {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-gaming-accent" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, index) => {
          const imageSrc = game.ficheJeu?.imageVerticale?.node?.sourceUrl || game.featuredImage?.node?.sourceUrl || DEFAULT_IMAGE;
          const imageAlt = game.featuredImage?.node?.altText || game.title;

          return (
            <Link
              key={game.id}
              href={`/jeux/${game.slug}`}
              className="bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors"
            >
              <div className="relative aspect-video">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-gaming-dark/80 text-white px-2 py-1 rounded text-sm font-medium">
                  #{index + 1}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white mb-2 line-clamp-1">{game.title}</h3>
                <div className="flex items-center gap-4 text-sm">
                  {game.siteRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gaming-accent" />
                      <span className="text-gray-300">{game.siteRating}/100</span>
                    </div>
                  )}
                  {game.plateforme && (
                    <span className="text-gray-400">{game.plateforme}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TopRankings; 