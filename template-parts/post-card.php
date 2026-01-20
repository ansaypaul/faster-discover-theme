<?php
/**
 * Post Card Component - 3 layouts (hero, side, news)
 * Identique à PostCard.tsx du projet Next.js
 */

$layout = get_query_var('layout', 'news');
$priority = get_query_var('priority', false);

// LAYOUT HERO (grand article avec overlay)
if ($layout === 'hero') : ?>
    <a 
        href="<?php the_permalink(); ?>"
        class="group block relative overflow-hidden rounded-xl bg-gaming-dark-card min-h-[400px]"
    >
        <div class="relative h-[400px] overflow-hidden">
            <?php if (has_post_thumbnail()) : 
                the_post_thumbnail('faster-hero', array(
                    'class' => 'object-cover w-full h-full',
                    'loading' => $priority ? 'eager' : 'lazy',
                    'fetchpriority' => $priority ? 'high' : 'auto',
                ));
            endif; ?>
            
            <!-- Category Badge -->
            <?php 
            $categories = get_the_category();
            if (!empty($categories)) : 
                $category = $categories[0];
            ?>
                <div class="absolute top-4 right-4 z-10">
                    <span class="font-medium px-3 py-1 rounded-md text-xs sm:text-sm text-white" style="background-color: rgba(59, 130, 246, 0.8);">
                        <?php echo esc_html($category->name); ?>
                    </span>
                </div>
            <?php endif; ?>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2">
                <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-gaming-accent transition-colors line-clamp-2">
                    <?php the_title(); ?>
                </h3>
                <div class="text-gray-300 text-sm line-clamp-2 block sm:block mb-2">
                    <?php echo wp_trim_words(get_the_excerpt(), 15, '...'); ?>
                </div>
                <div class="flex items-center text-xs text-gray-400">
                    <span><?php the_author(); ?></span>
                    <span class="mx-2">•</span>
                    <time datetime="<?php echo get_the_date('c'); ?>">
                        <?php echo get_the_date('j F Y'); ?>
                    </time>
                </div>
            </div>
        </div>
    </a>

<?php 
// LAYOUT SIDE (petit article horizontal)
elseif ($layout === 'side') : ?>
    <a 
        href="<?php the_permalink(); ?>"
        class="group block bg-gaming-dark-card rounded-lg overflow-hidden min-h-[90px]"
    >
        <div class="flex">
            <div class="w-[160px] h-[90px] flex-shrink-0 relative overflow-hidden">
                <?php if (has_post_thumbnail()) : 
                    the_post_thumbnail('faster-side', array(
                        'class' => 'object-cover w-full h-full',
                        'loading' => 'lazy',
                    ));
                endif; ?>
                
                <!-- Category Badge -->
                <?php 
                $categories = get_the_category();
                if (!empty($categories)) : 
                    $category = $categories[0];
                ?>
                    <div class="absolute top-1 right-1">
                        <span class="font-medium px-2 py-0.5 rounded text-[10px] text-white" style="background-color: rgba(59, 130, 246, 0.8);">
                            <?php echo esc_html($category->name); ?>
                        </span>
                    </div>
                <?php endif; ?>
            </div>
            <div class="p-2 sm:p-3 flex-1 min-w-0">
                <h4 class="text-white text-xs sm:text-sm font-semibold line-clamp-2 group-hover:text-gaming-accent transition-colors">
                    <?php the_title(); ?>
                </h4>
                <time datetime="<?php echo get_the_date('c'); ?>" class="mt-1 text-xs text-gray-400 block">
                    <?php echo get_the_date('j F Y'); ?>
                </time>
            </div>
        </div>
    </a>

<?php 
// LAYOUT NEWS (card classique)
else : ?>
    <a 
        href="<?php the_permalink(); ?>"
        class="group block bg-gaming-dark-card rounded-lg overflow-hidden min-h-[216px]"
    >
        <div class="relative aspect-video overflow-hidden">
            <?php if (has_post_thumbnail()) : 
                the_post_thumbnail('faster-news', array(
                    'class' => 'object-cover w-full h-full rounded-t-lg',
                    'loading' => 'lazy',
                ));
            endif; ?>
            
            <!-- Category Badge -->
            <?php 
            $categories = get_the_category();
            if (!empty($categories)) : 
                $category = $categories[0];
            ?>
                <div class="absolute top-3 right-3 z-10">
                    <span class="font-medium px-3 py-1 rounded-md text-xs text-white" style="background-color: rgba(59, 130, 246, 0.8);">
                        <?php echo esc_html($category->name); ?>
                    </span>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="p-4">
            <h3 class="text-lg font-semibold text-white group-hover:text-gaming-accent transition-colors line-clamp-2">
                <?php the_title(); ?>
            </h3>
            <div class="text-gray-400 text-sm mt-2 line-clamp-2">
                <?php echo wp_trim_words(get_the_excerpt(), 15, '...'); ?>
            </div>
            <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span><?php the_author(); ?></span>
                <time datetime="<?php echo get_the_date('c'); ?>">
                    <?php echo get_the_date('j F Y'); ?>
                </time>
            </div>
        </div>
    </a>
<?php endif; ?>
