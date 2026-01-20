"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { title: "News", href: "/news" },
  { title: "Esport", href: "/esport" },
  { title: "Jeux Vidéo", href: "/jeux-video" },
  { title: "Films / Séries", href: "/films-series" },
  { title: "Mangas", href: "/mangas" },
  { title: "High-Tech", href: "/high-tech" },
  { title: "Événements", href: "/evenements" },
  { title: "Bons plans", href: "/bons-plans" },
];

export default function CategoryMenu() {
  const pathname = usePathname() || '';

  return (
    <nav className="bg-gaming-dark-lighter">
      <div className="container mx-auto px-4">
        <ul className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2 -mx-4 px-4 sm:px-0 sm:mx-0">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-gaming-accent text-gaming-dark' 
                      : 'text-gray-300 hover:text-white hover:bg-gaming-dark-card'
                    }
                  `}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
} 