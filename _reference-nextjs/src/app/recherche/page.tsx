"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/article/PostCard";
import { useSearchPosts } from "@/lib/hooks/useSearchPosts";
import { useState, useTransition } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [, startTransition] = useTransition();
  
  const { articles, loading, error } = useSearchPosts(query);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("q", value);
      router.push(`/recherche${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
            Recherche
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un article..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full bg-gaming-dark-lighter border-gaming-dark-card text-white placeholder-gray-400"
            />
          </div>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Une erreur est survenue lors de la recherche.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Recherche en cours...</p>
          </div>
        )}

        {!loading && !error && query && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              {articles.length > 0 
                ? `${articles.length} résultat${articles.length > 1 ? 's' : ''} pour "${query}"`
                : `Aucun résultat pour "${query}"`}
            </h2>
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {articles.map((article) => (
                  <PostCard key={article.id} post={article} />
                ))}
              </div>
            ) : (
              <div className="bg-gaming-dark-card rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-2">
                  Aucun article ne correspond à votre recherche.
                </p>
                <p className="text-gray-500 text-sm">
                  Essayez avec d&rsquo;autres mots-clés ou consultez nos derniers articles.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 