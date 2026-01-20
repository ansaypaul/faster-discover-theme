'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Oups ! Une erreur s&apos;est produite</h1>
        <p className="text-gray-400 mb-8">
          Nous n&apos;avons pas pu charger cette page. Veuillez réessayer.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gaming-accent text-gaming-dark font-medium py-2 px-4 rounded-lg hover:bg-gaming-accent/90 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="block w-full bg-gaming-dark-card text-white font-medium py-2 px-4 rounded-lg hover:bg-gaming-dark-lighter transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
} 