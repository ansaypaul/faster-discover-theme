import { getBestJeux } from '@/lib/wordpress';
import { GameCard as GameCardType, FilterOption, SortOption } from '@/types';
import GameCard from '@/components/game/GameCard';
import ClientFiltersBar from '@/components/forms/ClientFiltersBar';
import ClientPagination from '@/components/navigation/ClientPagination';

// Revalidate games listing every 24 hours (86400 seconds)
export const revalidate = 86400;

// Options de filtrage statiques pour l'UI
const platforms: FilterOption[] = [
  { id: 'ps5', label: 'PlayStation 5', value: 'ps5' },
  { id: 'ps4', label: 'PlayStation 4', value: 'ps4' },
  { id: 'xbox-series', label: 'Xbox Series X|S', value: 'xbox-series' },
  { id: 'xbox-one', label: 'Xbox One', value: 'xbox-one' },
  { id: 'switch', label: 'Nintendo Switch', value: 'switch' },
  { id: 'pc', label: 'PC', value: 'pc' },
];

const genres: FilterOption[] = [
  { id: 'action', label: 'Action', value: 'action' },
  { id: 'aventure', label: 'Aventure', value: 'aventure' },
  { id: 'rpg', label: 'RPG', value: 'rpg' },
  { id: 'fps', label: 'FPS', value: 'fps' },
  { id: 'strategie', label: 'Stratégie', value: 'strategie' },
  { id: 'sport', label: 'Sport', value: 'sport' },
];

const sortOptions: SortOption[] = [
  { id: 'date-desc', label: 'Plus récents', value: 'date', order: 'desc' },
  { id: 'date-asc', label: 'Plus anciens', value: 'date', order: 'asc' },
  { id: 'note-desc', label: 'Meilleures notes', value: 'note', order: 'desc' },
  { id: 'note-asc', label: 'Notes croissantes', value: 'note', order: 'asc' },
];

async function getGames() {
  const games = await getBestJeux(12, { next: { revalidate: 3600 } }); // Cache for 1 hour
  return games.map((game): GameCardType => ({
    id: game.id,
    title: game.title,
    slug: game.slug,
    excerpt: game.ficheJeu?.synopsis || '',
    date: game.date || '',
    featuredImage: {
      sourceUrl: game.featuredImage?.node?.sourceUrl || '/images/game-placeholder.jpg',
      altText: game.featuredImage?.node?.altText || game.title
    },
    jeuxACF: {
      plateformes: game.plateformes?.nodes?.map(p => p.name) || [],
      genres: ['Action', 'Aventure'], // Valeurs en dur pour l'instant
      note: 4.5, // Valeur en dur pour l'instant
      nbAvis: 42 // Valeur en dur pour l'instant
    }
  }));
}

export default async function JeuxPage() {
  const games = await getGames();

  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Tous les jeux vidéo
        </h1>

        <ClientFiltersBar
          platforms={platforms}
          genres={genres}
          sortOptions={sortOptions}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game: GameCardType) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <ClientPagination totalPages={5} />
      </div>
    </div>
  );
} 