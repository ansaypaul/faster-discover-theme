'use client';

import { Article } from '@/types';
import PostCard from '@/components/article/PostCard';

interface HeroGridProps {
  posts: Article[];
}

function HeroGrid({ posts }: HeroGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
          À la une
        </h2>
        <p className="text-sm italic text-zinc-400">Aucun article disponible pour le moment.</p>
      </section>
    );
  }

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5);

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        À la une
      </h2>
      
      <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {/* Main featured post */}
        {mainPost && (
          <div className="lg:col-span-2">
            <PostCard 
              post={{
                ...mainPost,
                excerpt: mainPost.excerpt || ''
              }} 
              layout="hero" 
              priority 
            />
          </div>
        )}

        {/* Side posts grid */}
        <div className="space-y-3 sm:space-y-4">
          {sidePosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                ...post,
                excerpt: post.excerpt || ''
              }} 
              layout="side" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroGrid; 