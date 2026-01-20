import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import SafeHtml from './SafeHtml';

interface ArticleProseProps {
  html: string;
  className?: string;
}

/**
 * Composant pour afficher du contenu d'article avec styles Tailwind Prose
 * Supporte le contenu WordPress (images, captions, etc.) et AAWP (Amazon)
 */
const ArticleProse = forwardRef<HTMLDivElement, ArticleProseProps>(
  ({ html, className }, ref) => {
    return (
      <SafeHtml
        ref={ref}
        html={html}
        className={cn(
          // Prose base
          "prose prose-invert max-w-none",
          
          // Headings
          "prose-headings:font-bold",
          "prose-headings:mt-8 prose-headings:mb-4",
          
          // H1 reste blanc
          "prose-h1:text-white",
          
          // H2-H5 en couleur accent (cyan/turquoise)
          "prose-h2:text-[rgb(6,214,160)]",
          "prose-h3:text-[rgb(6,214,160)]",
          "prose-h4:text-[rgb(6,214,160)]",
          "prose-h5:text-[rgb(6,214,160)]",
          
          // H6 reste blanc
          "prose-h6:text-white",
          
          // Text
          "prose-p:text-gray-300",
          "prose-strong:text-white",
          
          // Links
          "prose-a:text-blue-400",
          "hover:prose-a:text-blue-300",
          "prose-a:transition-colors",
          
          // Lists
          "prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4",
          "prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4",
          "prose-li:text-gray-300 prose-li:my-2",
          
          // Images
          "prose-img:rounded-lg prose-img:my-8",
          "prose-img:w-full prose-img:h-auto",
          "prose-img:object-contain prose-img:mx-auto",
          "prose-img:shadow-lg",
          
          // Blockquotes
          "prose-blockquote:border-l-4 prose-blockquote:border-blue-500",
          "prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-blockquote:my-8 prose-blockquote:text-gray-400",
          
          // Code
          "prose-code:text-blue-400 prose-code:bg-gray-800",
          "prose-code:rounded prose-code:px-1 prose-code:py-0.5",
          "prose-pre:bg-gray-800 prose-pre:p-4",
          "prose-pre:rounded-lg prose-pre:my-8",
          "prose-pre:overflow-x-auto",
          
          // Tables
          "prose-table:border-collapse prose-table:w-full",
          "prose-th:bg-gray-800 prose-th:text-white",
          "prose-th:p-3 prose-th:text-left",
          "prose-td:border-t prose-td:border-gray-700",
          "prose-td:p-3 prose-td:text-gray-300",
          
          // WordPress specific
          "[&_.wp-caption]:!w-full [&_.wp-caption]:!max-w-full",
          "[&_figure]:!w-full [&_figure]:!max-w-full [&_figure]:my-8",
          "[&_.wp-caption-text]:text-sm [&_.wp-caption-text]:text-gray-400",
          "[&_.wp-caption-text]:mt-2 [&_.wp-caption-text]:text-center",
          
          // Custom classes passées en prop
          className
        )}
      />
    );
  }
);

ArticleProse.displayName = 'ArticleProse';

export default ArticleProse;
