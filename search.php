<?php
/**
 * Search Results Template
 */
get_header();
?>

<div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
        
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
            // Pagination
            the_posts_pagination(array(
                'mid_size' => 1,      // 1 page de chaque côté
                'end_size' => 1,      // 1 page au début et à la fin
                'prev_text' => __('← Précédent', 'faster'),
                'next_text' => __('Suivant →', 'faster'),
                'class' => 'flex justify-center space-x-2 mt-12',
            ));
            ?>
            
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
