<?php
/**
 * Editorial Picks - "Le top de la rédac"
 * Identique à EditorialPicks.tsx
 * Cards avec numéros #1, #2, #3
 */

$title = get_query_var('editorial_title', 'Le top de la rédac');
$articles = get_query_var('editorial_articles', array());

// Si aucun article n'est fourni, récupérer les 6 derniers
if (empty($articles)) {
    $articles = get_posts(array(
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_type' => 'post',
        'post_status' => 'publish',
    ));
}

if (empty($articles)) {
    return;
}
?>

<section class="mb-6 sm:mb-8">
    <div class="flex items-center mb-4 sm:mb-6">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gaming-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
        <h2 class="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
            <?php echo esc_html($title); ?>
        </h2>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <?php foreach ($articles as $index => $article) : 
            setup_postdata($article);
            $categories = get_the_category($article->ID);
        ?>
            <a 
                href="<?php echo get_permalink($article); ?>"
                class="group block bg-gaming-dark-card rounded-lg overflow-hidden"
            >
                <div class="relative h-40 sm:h-48 overflow-hidden">
                    <?php if (has_post_thumbnail($article)) : 
                        echo get_the_post_thumbnail($article, 'faster-medium', array(
                            'class' => 'object-cover w-full h-full',
                            'loading' => 'lazy'
                        ));
                    endif; ?>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div class="absolute top-2 left-2">
                        <span class="bg-gaming-accent text-gaming-dark px-2 py-1 rounded text-xs font-bold">
                            #<?php echo ($index + 1); ?>
                        </span>
                    </div>
                    <?php if (!empty($categories)) : ?>
                        <div class="absolute top-2 right-2">
                            <span class="bg-gaming-primary/80 text-white px-2 py-1 rounded text-xs font-medium">
                                <?php echo esc_html($categories[0]->name); ?>
                            </span>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="p-3 sm:p-4">
                    <h3 class="text-white text-sm sm:text-base font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                        <?php echo get_the_title($article); ?>
                    </h3>
                    <div class="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
                        <?php echo wp_trim_words(get_the_excerpt($article), 15, '...'); ?>
                    </div>
                    
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span><?php echo get_the_author_meta('display_name', $article->post_author); ?></span>
                        <span><?php echo ceil(str_word_count(strip_tags(get_post_field('post_content', $article))) / 200); ?> min</span>
                    </div>
                </div>
            </a>
        <?php endforeach; wp_reset_postdata(); ?>
    </div>
</section>
