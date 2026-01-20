'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // Simuler l'envoi (à remplacer par votre API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gaming-dark-card rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-3">
        Rejoignez la communauté
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Recevez nos dernières actualités et exclusivités directement dans votre boîte mail.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="w-full px-4 py-2 bg-gaming-dark border border-gaming-dark-lighter rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gaming-accent"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full font-medium px-4 py-2 rounded-lg transition-colors text-sm
            ${status === 'loading' 
              ? 'bg-gaming-accent/50 cursor-not-allowed' 
              : 'bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark'
            }`}
        >
          {status === 'loading' ? 'Inscription...' : 'S\'abonner'}
        </button>
        {status === 'success' && (
          <p className="text-green-500 text-sm text-center">
            Merci pour votre inscription !
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </form>
    </div>
  );
} 