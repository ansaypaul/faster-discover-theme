import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AuthorHeader from '@/components/author/AuthorHeader';
import AuthorArticles from '@/components/author/AuthorArticles';
import Sidebar from '@/components/layout/Sidebar';
import { getAuthorSlugs, getAuthorAndArticles } from '@/lib/api/author';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await getAuthorAndArticles(slug);
    
    if (!data) {
      return {
        title: 'Auteur non trouvé - World of Geek',
        description: 'Page auteur introuvable',
      };
    }

    return {
      title: `${data.author.name} - World of Geek`,
      description: data.author.shortDescription || `Articles de ${data.author.name} sur World of Geek`,
      openGraph: {
        title: `${data.author.name} - World of Geek`,
        description: data.author.shortDescription || `Articles de ${data.author.name} sur World of Geek`,
        images: data.author.picture ? [{ url: data.author.picture }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Auteur - World of Geek',
      description: 'Page auteur',
    };
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAuthorSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const currentPage = Number(searchParamsResolved.page) || 1;

  try {
    const data = await getAuthorAndArticles(slug);
    
    if (!data) {
      notFound();
    }

    const totalPages = Math.ceil(data.totalArticles / 20);

    return (
      <div className="min-h-screen bg-gaming-dark">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: 'Auteurs', href: '/auteurs' },
              { label: data.author.name }
            ]} 
          />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <main className="flex-1">
              <article className="mb-8">
                <AuthorHeader author={data.author} />
                {data.author.bio && (
                  <div className="prose dark:prose-invert max-w-none mt-8">
                    <div dangerouslySetInnerHTML={{ __html: data.author.bio }} />
                  </div>
                )}
              </article>
              
              <AuthorArticles
                articles={data.articles}
                authorName={data.author.name}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </main>
            
            <Sidebar latestPosts={data.latestPosts} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering author page:', error);
    notFound();
  }
}
