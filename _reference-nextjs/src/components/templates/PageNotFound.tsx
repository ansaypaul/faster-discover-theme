import Link from 'next/link';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Page non trouvée
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link 
          href="/"
          className="inline-block bg-gaming-accent hover:bg-gaming-accent/80 text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
} 