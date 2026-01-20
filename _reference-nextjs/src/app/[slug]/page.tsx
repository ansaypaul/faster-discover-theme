export const dynamic = "force-static";

import { Metadata } from "next";
import { cache } from "react";
import {
  getArticleBySlug,
  getCategoryBySlug,
  getPageBySlug,
} from "@/lib/api";
import { getLatestPosts } from "@/lib/wordpress";
import { trackPageGeneration } from "@/lib/isr-tracker";
import { generateSeoMetadata } from "@/lib/metadata";
import { getBuildInfo } from "@/lib/buildInfo";
import ArticlePage from "@/components/templates/ArticlePage";
import CategoryPage from "@/components/templates/CategoryPage";
import PagePage from "@/components/templates/PagePage";
import PageNotFound from "@/components/templates/PageNotFound";
import BuildInfoUpdater from "@/components/common/BuildInfoUpdater";

// Cache pour éviter de refaire les mêmes requêtes entre generateMetadata et le render
const getCachedArticle = cache(async (slug: string) => getArticleBySlug(slug));
const getCachedCategory = cache(async (slug: string) => getCategoryBySlug(slug));
const getCachedPage = cache(async (slug: string) => getPageBySlug(slug));

export const dynamicParams = true;
export const revalidate = 3600; // 1 heure - pour les catégories (les articles gardent 24h via leur fetch individuel)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  console.log("📝 Generating metadata for slug:", slug);

  try {
    // Optimisation : Essayer article en premier (cas le plus fréquent)
    const article = await getCachedArticle(slug);
    if (article) {
      console.log("📄 Found article for metadata:", article.title);
      return generateSeoMetadata({
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.excerpt || '',
        type: 'article',
        publishedTime: article.date,
        image: article.seo?.openGraph?.image?.secureUrl || article.featuredImage?.sourceUrl,
        canonical: article.seo?.canonicalUrl || `/${slug}`
      });
    }

    // Sinon, chercher catégorie
    const category = await getCachedCategory(slug);
    if (category) {
      console.log("📁 Found category for metadata:", category.name);
      return generateSeoMetadata({
        title: category.seo?.title || `${category.name} | World of Geek`,
        description: category.seo?.description || category.description || `Découvrez tous nos articles dans la catégorie ${category.name}`,
        type: 'website',
        image: category.seo?.openGraph?.image?.secureUrl,
        canonical: category.seo?.canonicalUrl || `/${slug}`
      });
    }

    // Sinon, chercher page
    const page = await getCachedPage(slug);
    if (page) {
      console.log("📄 Found page for metadata:", page.title);
      return generateSeoMetadata({
        title: page.seo?.title || `${page.title} | World of Geek`,
        description: page.seo?.description || `${page.title} - World of Geeks`,
        type: 'website',
        image: page.seo?.openGraph?.image?.secureUrl,
        canonical: page.seo?.canonicalUrl || `/${slug}`
      });
    }

    console.log("⚠️ No content found for metadata generation");
    return generateSeoMetadata({
      title: "Page non trouvée",
      description: "La page que vous recherchez n'existe pas",
      type: 'website'
    });
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return generateSeoMetadata({
      title: "Erreur",
      description: "Une erreur est survenue",
      type: 'website'
    });
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const buildInfo = getBuildInfo();
  
  console.log("🎯 Rendering page for slug:", slug);
  console.log("🕒 Using build timestamp:", buildInfo.timestamp);

  try {
    // 1. Essayer d'abord de trouver un article (utilise le cache de generateMetadata)
    const article = await getCachedArticle(slug);
    if (article) {
      console.log("✅ Rendering article:", article.title);
      // 🔥 Tracker que cet article est généré et mis en cache ISR
      trackPageGeneration(`/${slug}`, 86400, false);
      
      // On ne charge plus les articles reliés côté serveur pour améliorer les performances
      const latestPosts = await getLatestPosts(6);
      console.log("🚀 Article rendered without blocking on related articles");
      return (
        <>
          <BuildInfoUpdater timestamp={buildInfo.timestamp} renderType={buildInfo.renderType} />
          <ArticlePage article={article} latestPosts={latestPosts} />
        </>
      );
    }

    // 2. Si ce n'est pas un article, essayer de trouver une catégorie (utilise le cache)
    const category = await getCachedCategory(slug);
    if (category) {
      console.log("✅ Rendering category:", category.name);
      // 🔥 Tracker que cette catégorie est générée et mise en cache ISR
      trackPageGeneration(`/${slug}`, 3600, false);
      
      const { getArticlesInCategoryPaginated } = await import('@/lib/wordpress');
      const [paginatedData, latestPosts] = await Promise.all([
        getArticlesInCategoryPaginated(slug, 12),
        getLatestPosts(6)
      ]);
      console.log("📚 Articles in category:", paginatedData.articles.length);
      console.log("📄 Has next page:", paginatedData.pageInfo.hasNextPage);
      return (
        <>
          <BuildInfoUpdater timestamp={buildInfo.timestamp} renderType={buildInfo.renderType} />
          <CategoryPage 
            category={category} 
            articles={paginatedData.articles} 
            pageInfo={paginatedData.pageInfo}
            latestPosts={latestPosts} 
          />
        </>
      );
    }

    // 3. Si ce n'est pas une catégorie, essayer de trouver une page (utilise le cache)
    const page = await getCachedPage(slug);
    if (page) {
      console.log("✅ Rendering page:", page.title);
      const latestPosts = await getLatestPosts(6);
      return (
        <>
          <BuildInfoUpdater timestamp={buildInfo.timestamp} renderType={buildInfo.renderType} />
          <PagePage page={page} latestPosts={latestPosts} />
        </>
      );
    }

    // 4. Si rien n'est trouvé, retourner la page 404
    console.log("⚠️ No content found, returning 404");
    return (
      <>
        <BuildInfoUpdater timestamp={buildInfo.timestamp} renderType={buildInfo.renderType} />
        <PageNotFound />
      </>
    );
  } catch (error) {
    console.error("❌ Error rendering page:", error);
    return (
      <>
        <BuildInfoUpdater timestamp={buildInfo.timestamp} renderType={buildInfo.renderType} />
        <PageNotFound />
      </>
    );
  }
}