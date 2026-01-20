<?php
/**
 * Platform Section - Identique à PlatformSection.tsx
 * Section avec scroll horizontal sur mobile, grid sur desktop
 * 
 * Variables: $title, $platform, $category_slug, $category_link, $posts_count
 */

$title = get_query_var('section_title', '');
$category_slug = get_query_var('category_slug', '');
$category_link = get_query_var('category_link', '');
$posts = get_query_var('section_posts', array());
$posts_count = get_query_var('posts_count', 8);

if (empty($title)) {
    return;
}

// Si les posts ne sont pas fournis, les récupérer (rétrocompatibilité)
if (empty($posts) && !empty($category_slug)) {
    $category = get_category_by_slug($category_slug);
    if (!$category) {
        return;
    }
    
    $posts = get_posts(array(
        'category' => $category->term_id,
        'posts_per_page' => $posts_count,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

if (empty($posts)) {
    return;
}
?>

<section class="mb-6 sm:mb-8">
    <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-white border-l-4 border-gaming-accent pl-3 sm:pl-4">
            <?php echo esc_html($title); ?>
        </h2>
        <?php if ($category_link) : ?>
            <a 
                href="<?php echo esc_url($category_link); ?>"
                class="flex items-center text-gaming-accent hover:text-gaming-accent/80 transition-colors text-sm"
            >
                Voir plus
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        <?php endif; ?>
    </div>
    
    <div class="overflow-x-auto">
        <div class="flex gap-3 sm:gap-4 pb-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <?php foreach ($posts as $article) : 
                global $post;
                $post = $article;
                setup_postdata($post);
                ?>
                <div class="flex-shrink-0 w-64 sm:w-auto">
                    <?php 
                    set_query_var('layout', 'news');
                    get_template_part('template-parts/post-card');
                    ?>
                </div>
                <?php
                wp_reset_postdata();
            endforeach; ?>
        </div>
    </div>
</section>
