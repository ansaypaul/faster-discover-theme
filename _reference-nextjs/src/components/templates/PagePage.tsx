import { Article, Page } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface PagePageProps {
  page: Page;
  latestPosts: Article[];
}

export default function PagePage({ page, latestPosts }: PagePageProps) {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs 
          items={[
            { label: page.title, href: `/${page.slug}` }
          ]} 
        />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <main className="flex-1 max-w-[956px] mx-auto px-4">
            <article className="prose prose-invert max-w-none">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                {page.title}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </article>
          </main>
          
          <Sidebar latestPosts={latestPosts} />
        </div>
      </div>
    </div>
  );
} 