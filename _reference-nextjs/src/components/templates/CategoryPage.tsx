import { Article, Category } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import CategoryBlock from '@/components/category/CategoryBlock';

interface CategoryPageProps {
  category: Category;
  articles: Article[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
  };
  latestPosts: Article[];
}

export default function CategoryPage({ 
  category, 
  articles, 
  pageInfo,
  latestPosts 
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { label: category.name, href: `/${category.slug}` }
          ]} 
        />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          <main className="flex-1 max-w-[956px] mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 border-l-4 border-gaming-accent pl-4">
              {category.name}
            </h1>
            <CategoryBlock 
              initialArticles={articles}
              initialPageInfo={pageInfo}
              categorySlug={category.slug}
            />
          </main>
          
          <Sidebar latestPosts={latestPosts} />
        </div>
      </div>
    </div>
  );
} 