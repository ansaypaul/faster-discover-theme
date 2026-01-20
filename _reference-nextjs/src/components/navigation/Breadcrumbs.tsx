import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="hidden flex items-center space-x-2 text-sm">
      <Link 
        href="/"
        className="text-gray-400 hover:text-gaming-accent transition-colors"
      >
        Accueil
      </Link>

      {items.map((item, index) => (
        <div key={item.label} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.href && index !== items.length - 1 ? (
            <Link 
              href={item.href}
              className="text-gray-400 hover:text-gaming-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
} 