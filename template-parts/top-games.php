<?php
/**
 * Top Games - Les meilleurs jeux du moment
 * Identique à TopGames.tsx
 * Affiche les jeux avec scroll horizontal mobile et grid desktop
 */

$title = get_query_var('top_games_title', 'Les meilleurs jeux du moment');

// Récupérer les posts de la catégorie "jeux" ou utiliser des posts récents
$jeux_cat = get_category_by_slug('jeux-video');
$games = array();

if ($jeux_cat) {
    $games = get_posts(array(
        'category' => $jeux_cat->term_id,
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

// Fallback: utiliser des posts récents si pas de catégorie jeux
if (empty($games)) {
    $games = get_posts(array(
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

if (empty($games)) {
    return;
}
?>

<section class="mb-6 sm:mb-8">
    <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        <?php echo esc_html($title); ?>
    </h2>
    
    <div class="overflow-x-auto">
        <div class="flex space-x-3 sm:space-x-4 pb-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:space-x-0">
            <?php foreach ($games as $index => $game) : 
                setup_postdata($game);
            ?>
                <a 
                    href="<?php echo get_permalink($game); ?>"
                    class="group block bg-gaming-dark-card rounded-lg overflow-hidden flex-shrink-0 w-40 sm:w-auto"
                >
                    <div class="relative h-24 sm:h-32 md:h-40">
                        <?php if (has_post_thumbnail($game)) : 
                            echo get_the_post_thumbnail($game, 'faster-news', array(
                                'class' => 'object-cover w-full h-full',
                                'loading' => 'lazy'
                            ));
                        endif; ?>
                        <div class="absolute top-2 left-2 bg-gaming-accent text-gaming-dark px-2 py-1 rounded text-xs font-bold">
                            #<?php echo ($index + 1); ?>
                        </div>
                    </div>
                    
                    <div class="p-2 sm:p-3">
                        <h3 class="text-white text-xs sm:text-sm font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                            <?php echo get_the_title($game); ?>
                        </h3>
                        
                        <div class="flex items-center justify-between text-xs mb-2">
                            <div class="flex items-center space-x-1 text-yellow-400">
                                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span class="text-white">-</span>
                            </div>
                            <div class="flex items-center space-x-1 text-gaming-accent">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                <span class="text-white">-</span>
                            </div>
                        </div>
                        
                        <div class="text-xs text-gray-400">
                            <?php 
                            $categories = get_the_category($game->ID);
                            if (!empty($categories)) {
                                echo esc_html($categories[0]->name);
                            } else {
                                echo 'Multi-plateformes';
                            }
                            ?>
                        </div>
                    </div>
                </a>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>
    </div>
</section>
