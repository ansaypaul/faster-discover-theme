<?php
/**
 * Search Results Template
 */
get_header();
?>

<div class="container mx-auto px-4 py-8">
    <div class="mx-auto">
        
        <!-- Search Header -->
        <header class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                <?php
                printf(
                    esc_html__('Résultats de recherche pour : %s', 'faster'),
                    '<span class="text-gaming-accent">' . get_search_query() . '</span>'
                );
                ?>
            </h1>
            <div class="max-w-xl">
                <?php get_search_form(); ?>
            </div>
        </header>
        
        <?php if (have_posts()) : ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <?php while (have_posts()) : the_post(); 
                    set_query_var('layout', 'news');
                    get_template_part('template-parts/post-card');
                endwhile; ?>
            </div>
            
            <?php
            // Pagination WordPress stylisée
            $big = 999999999;
            $pagination = paginate_links(array(
                'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
                'format' => '?paged=%#%',
                'current' => max(1, get_query_var('paged')),
                'total' => $GLOBALS['wp_query']->max_num_pages,
                'type' => 'array',
                'prev_text' => '← Précédent',
                'next_text' => 'Suivant →',
                'mid_size' => 1,
                'end_size' => 1,
            ));

            if ($pagination) : ?>
                <nav class="flex flex-wrap justify-center items-center gap-2 mt-8" aria-label="Pagination">
                    <?php foreach ($pagination as $page) : 
                        $page = str_replace('current', 'bg-gaming-accent text-gaming-dark px-4 py-2 rounded-lg font-medium', $page);
                        $page = str_replace('page-numbers', 'px-4 py-2 rounded-lg text-gray-300', $page);
                        $page = str_replace('dots', 'px-2 py-2 text-gray-500', $page);
                        echo $page; 
                    endforeach; ?>
                </nav>
            <?php endif; ?>
            
        <?php else : ?>
            <div class="text-center py-12 bg-gaming-dark-card rounded-lg">
                <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-gray-400 text-lg mb-4"><?php _e('Aucun résultat trouvé.', 'faster'); ?></p>
                <p class="text-gray-500"><?php _e('Essayez avec d\'autres mots-clés.', 'faster'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
