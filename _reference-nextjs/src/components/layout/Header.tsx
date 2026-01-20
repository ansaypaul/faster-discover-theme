"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import CategoryMenu from '@/components/category/CategoryMenu';
import LogoWrapper from '@/components/layout/LogoWrapper';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const navigationItems = [
    { name: 'News', path: '/news' },
    { name: 'Esport', path: '/esport' },
    { name: 'Jeux Vidéo', path: '/jeux-video' },
    { name: 'Films / Séries', path: '/films-series' },
    { name: 'Mangas', path: '/mangas' },
    { name: 'High-Tech', path: '/high-tech' },
    { name: 'Événements', path: '/evenements' },
    { name: 'Bons plans', path: '/bons-plans' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-gaming-dark border-b border-gaming-dark-lighter backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8 h-16">
          {/* Logo */}
          <LogoWrapper className="flex items-center space-x-2 sm:space-x-3" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-1 text-gray-300 hover:text-gaming-accent transition-colors duration-200 text-sm"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 lg:w-64 bg-gaming-dark-lighter border-gaming-dark-card text-white placeholder-gray-400"
              />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gaming-dark-lighter">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center space-x-2 text-gray-300 hover:text-gaming-accent transition-colors duration-200 p-3 rounded-lg hover:bg-gaming-dark-lighter"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 px-3">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-gaming-dark-lighter border-gaming-dark-card text-white placeholder-gray-400"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
      
      {/* Category Menu */}
      <CategoryMenu />
    </div>
  );
};

export default Header; 