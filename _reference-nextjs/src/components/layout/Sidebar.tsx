'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

// Types
interface SidebarProps {
  latestPosts: Article[];
  popularPosts?: Article[];
}

interface PostListProps {
  title: string;
  posts: Article[];
  className?: string;
}

// Composants dynamiques
const NewsletterForm = dynamic(() => import('@/components/forms/NewsletterForm'), {
  ssr: false
});

const SocialLinks = dynamic(() => import('@/components/common/SocialLinks'), {
  ssr: false
});

// Composant PostList optimisé
const PostList = memo(function PostList({ title, posts, className }: PostListProps) {
  if (!posts?.length) return null;

  const [firstPost, ...otherPosts] = posts;

  return (
    <div className={`bg-gaming-dark-card rounded-lg p-4 ${className || ''}`}>
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      
      {/* Premier article - Grand format */}
      <article className="group mb-6">
        <Link
          href={`/${firstPost.slug}`}
          className="block bg-gaming-dark-lighter rounded-lg overflow-hidden"
        >
          <div className="relative aspect-video w-full">
            {firstPost.featuredImage ? (
              <Image
                src={firstPost.featuredImage.sourceUrl}
                alt={firstPost.featuredImage.altText || firstPost.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 380px, 100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gaming-dark" />
            )}
          </div>
          <div className="p-4">
            <h4 className="text-base text-white group-hover:text-gaming-accent transition-colors line-clamp-2 font-medium">
              {firstPost.title}
            </h4>
            <time dateTime={firstPost.date} className="text-xs text-gray-400 mt-2 block">
              {new Date(firstPost.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </Link>
      </article>

      {/* Articles suivants - Format compact */}
      <div className="space-y-3">
        {otherPosts.map((post) => (
          <article key={post.id} className="group">
            <Link
              href={`/${post.slug}`}
              className="flex gap-3 items-center bg-gaming-dark-lighter rounded-lg overflow-hidden p-2"
            >
              <div className="relative w-24 aspect-video flex-shrink-0">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText || post.title}
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gaming-dark rounded" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm text-white group-hover:text-gaming-accent transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <time dateTime={post.date} className="text-xs text-gray-400 mt-1 block">
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
});

// Composant Sidebar principal
const Sidebar = memo(function Sidebar({ latestPosts, popularPosts = [] }: SidebarProps) {
  return (
    <aside className="w-full lg:w-[380px] space-y-8">
      {/* Section Articles Populaires */}
      {popularPosts.length > 0 && (
        <PostList 
          title="Articles populaires" 
          posts={popularPosts.slice(0, 4)}
          className="shadow-lg"
        />
      )}
      
      {/* Section Derniers Articles */}
      <PostList 
        title="À lire aussi" 
        posts={latestPosts.slice(0, 6)}
        className="shadow-lg"
      />
      
      {/* Section Newsletter & Social - Sticky */}
      <div className="sticky top-8 space-y-8">
        <NewsletterForm />
        <SocialLinks />
      </div>
    </aside>
  );
});

export default Sidebar; 