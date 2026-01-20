"use client";

interface CategoryBadgeProps {
  category: string;
  size?: 'small' | 'medium';
}

const CategoryBadge = ({ category, size = 'medium' }: CategoryBadgeProps) => {
  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tests':
      case 'test':
        return 'bg-green-600';
      case 'actualités':
      case 'actualites':
      case 'news':
      case 'actualite':
        return 'bg-blue-600';
      case 'dossiers':
      case 'dossier':
        return 'bg-purple-600';
      case 'videos':
      case 'vidéos':
      case 'video':
        return 'bg-red-600';
      case 'guides':
      case 'guide':
        return 'bg-orange-600';
      default:
        return 'bg-gaming-accent';
    }
  };

  const sizeClasses = size === 'small' 
    ? 'px-1.5 py-0.5 text-xs' 
    : 'px-2 sm:px-3 py-1 text-xs sm:text-sm';

  return (
    <span className={`${getBadgeColor(category)} text-white ${sizeClasses} rounded-full font-bold`}>
      {category}
    </span>
  );
};

export default CategoryBadge; 