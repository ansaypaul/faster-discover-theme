<?php
/**
 * Top Rankings - Top 10 des jeux de la semaine
 * Identique à TopRankings.tsx
 * Grid 4 colonnes avec badge numéroté
 */

$title = get_query_var('top_rankings_title', 'Top 10 des jeux de la semaine');

// Récupérer les jeux de la catégorie "jeux-video"
$jeux_cat = get_category_by_slug('jeux-video');
$games = array();

if ($jeux_cat) {
    $games = get_posts(array(
        'category' => $jeux_cat->term_id,
        'posts_per_page' => 10,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

// Fallback: posts récents
if (empty($games)) {
    $games = get_posts(array(
        'posts_per_page' => 10,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

if (empty($games)) {
    return;
}
?>

<section class="mb-6 sm:mb-8">
    <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-gaming-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
        <h2 class="text-xl font-bold text-white"><?php echo esc_html($title); ?></h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <?php foreach ($games as $index => $game) : 
            setup_postdata($game);
        ?>
            <a
                href="<?php echo get_permalink($game); ?>"
                class="bg-gaming-dark-card rounded-lg overflow-hidden"
            >
                <div class="relative aspect-video">
                    <?php if (has_post_thumbnail($game)) : 
                        echo get_the_post_thumbnail($game, 'faster-news', array(
                            'class' => 'object-cover w-full h-full',
                            'loading' => 'lazy'
                        ));
                    endif; ?>
                    <div class="absolute top-2 left-2 bg-gaming-dark/80 text-white px-2 py-1 rounded text-sm font-medium">
                        #<?php echo ($index + 1); ?>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-white mb-2 line-clamp-1">
                        <?php echo get_the_title($game); ?>
                    </h3>
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-gaming-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                            <span class="text-gray-300">-/100</span>
                        </div>
                        <?php 
                        $categories = get_the_category($game->ID);
                        if (!empty($categories)) :
                        ?>
                            <span class="text-gray-400"><?php echo esc_html($categories[0]->name); ?></span>
                        <?php endif; ?>
                    </div>
                </div>
            </a>
        <?php endforeach; wp_reset_postdata(); ?>
    </div>
</section>
