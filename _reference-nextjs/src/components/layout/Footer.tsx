"use client";

import Link from 'next/link';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { useBuildInfo } from '@/components/common/BuildInfo';
import LogoWrapper from '@/components/layout/LogoWrapper';

const Footer = () => {
  const buildInfo = useBuildInfo();
  const isDev = process.env.NODE_ENV === 'development';

  const getRenderMessage = () => {
    if (isDev) return "Mode développement - Rechargement automatique activé";
    if (!buildInfo) return "";

    const date = new Date(buildInfo.timestamp).toLocaleString('fr-FR');
    if (buildInfo.renderType === 'isr-cache') {
      return `Page servie depuis le cache ISR (générée le ${date})`;
    } else {
      return `Page générée à la volée le ${date}`;
    }
  };

  return (
    <footer className="bg-gaming-dark-card border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {/* Logo et description */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <LogoWrapper isMain={false} />
              </div>
              <p className="text-sm text-gray-300">
                World of Geeks est un site d&apos;actualités et de culture geek qui s&apos;intéresse à l&apos;univers du gaming.
              </p>
            </div>

          {/* Navigation */}
          <div>
            <span className="block text-white font-semibold mb-4">Navigation</span>
            <ul className="space-y-2">
              <li><Link href="/actualites" className="text-gray-400 hover:text-gaming-accent transition-colors">Actualités</Link></li>
              <li><Link href="/tests" className="text-gray-400 hover:text-gaming-accent transition-colors">Tests</Link></li>
              <li><Link href="/dossiers" className="text-gray-400 hover:text-gaming-accent transition-colors">Dossiers</Link></li>
              <li><Link href="/videos" className="text-gray-400 hover:text-gaming-accent transition-colors">Vidéos</Link></li>
              <li><Link href="/jeux" className="text-gray-400 hover:text-gaming-accent transition-colors">Jeux</Link></li>
              <li><Link href="/guides" className="text-gray-400 hover:text-gaming-accent transition-colors">Guides d&apos;achat</Link></li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <span className="block text-white font-semibold mb-4">Pages</span>
            <ul className="space-y-2">
              <li><Link href="/mentions-legales" className="text-gray-400 hover:text-gaming-accent transition-colors">Mentions légales</Link></li>
              <li><Link href="/politique-de-confidentialite" className="text-gray-400 hover:text-gaming-accent transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gaming-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <span className="block text-white font-semibold mb-4">Suivez-nous</span>
            <div className="flex space-x-4">
              <a href="https://facebook.com/worldofgeeks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gaming-accent transition-colors" aria-label="Suivez-nous sur Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/worldofgeeks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gaming-accent transition-colors" aria-label="Suivez-nous sur Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@worldofgeeks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gaming-accent transition-colors" aria-label="Suivez-nous sur YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/worldofgeeks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gaming-accent transition-colors" aria-label="Suivez-nous sur Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-300">
            Tous droits réservés. Propulsé par l&apos;amour du gaming.
            {/* BuildInfo visible en dev (jaune) et prod (discret) */}
            {buildInfo && (
              <span className={`block mt-2 text-xs ${
                isDev 
                  ? (buildInfo.renderType === 'isr-cache' ? 'text-green-500' : 'text-yellow-500') 
                  : 'text-gray-500'
              } opacity-75`}>
                {getRenderMessage()}
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 