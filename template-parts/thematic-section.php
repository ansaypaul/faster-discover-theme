<?php
/**
 * Thematic Section - Section avec titre + grid 4 colonnes
 * Identique à ThematicSection.tsx du projet Next.js
 * 
 * Variables attendues : $section_title, $category_link, $section_posts
 */

$title = get_query_var('section_title', '');
$category_link = get_query_var('category_link', '');
$articles = get_query_var('section_posts', array());

if (empty($title)) {
    return;
}

if (empty($articles)) : ?>
    <section class="mb-8">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white border-l-4 border-gaming-accent pl-4">
                <?php echo esc_html($title); ?>
            </h2>
        </div>
        <div class="bg-gaming-dark-card rounded-lg p-6 text-center text-gray-400">
            <?php _e('Aucun article disponible pour le moment', 'faster'); ?>
        </div>
    </section>
<?php return; endif; ?>

<section class="mb-8">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white border-l-4 border-gaming-accent pl-4">
            <?php echo esc_html($title); ?>
        </h2>
        <?php if (!empty($category_link)) : ?>
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
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <?php foreach ($articles as $article) : 
            global $post;
            $post = $article;
            setup_postdata($post);
            set_query_var('layout', 'news');
            get_template_part('template-parts/post-card');
            wp_reset_postdata();
        endforeach; ?>
    </div>
</section>
