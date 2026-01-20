<?php
/**
 * Hero Grid - Section "À la une"
 * Identique à HeroGrid.tsx du projet Next.js
 * 1 grand article hero + 4 petits articles side
 */

$hero_posts = get_query_var('hero_posts', array());

// Si aucun post n'est fourni, récupérer les 6 derniers articles
if (empty($hero_posts)) {
    $hero_posts = get_posts(array(
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_type' => 'post',
        'post_status' => 'publish',
    ));
}

if (empty($hero_posts)) : ?>
    <section class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
            <?php _e('À la une', 'faster'); ?>
        </h2>
        <p class="text-sm italic text-zinc-400"><?php _e('Aucun article disponible pour le moment.', 'faster'); ?></p>
    </section>
<?php return; endif;

$main_post = $hero_posts[0];
$side_posts = array_slice($hero_posts, 1, 4);
?>

<section class="mb-6 sm:mb-8">
    <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        <?php _e('À la une', 'faster'); ?>
    </h2>
    
    <div class="space-y-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
        <!-- Main featured post (Hero) -->
        <div class="lg:col-span-3">
            <?php 
            global $post;
            $post = $main_post;
            setup_postdata($post);
            set_query_var('layout', 'hero');
            set_query_var('priority', true);
            get_template_part('template-parts/post-card');
            wp_reset_postdata();
            ?>
        </div>

        <!-- Side posts grid -->
        <div class="space-y-3 sm:space-y-4 lg:col-span-2">
            <?php foreach ($side_posts as $side_post) : 
                $post = $side_post;
                setup_postdata($post);
                set_query_var('layout', 'side');
                get_template_part('template-parts/post-card');
                wp_reset_postdata();
            endforeach; ?>
        </div>
    </div>
</section>
