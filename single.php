<?php
/**
 * Single Post Template
 * Identique à ArticlePage.tsx du Next.js
 * Layout: Contenu principal (max-width 956px) + Sidebar (380px)
 */

get_header();

while (have_posts()) : the_post();
    
    // Variables article
    $article_id = get_the_ID();
    $article_title = get_the_title();
    $article_date = get_the_date('c');
    $article_date_formatted = get_the_date('j F Y');
    $categories = get_the_category();
    $author_name = get_the_author();
    $author_avatar = get_avatar_url(get_the_author_meta('ID'), array('size' => 48));
    $read_time = ceil(str_word_count(strip_tags(get_the_content())) / 200);
    
    // Articles récents pour la sidebar
    $latest_posts = get_posts(array(
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
        'post__not_in' => array($article_id),
    ));
    
    // Articles similaires (même catégorie)
    $related_articles = array();
    if (!empty($categories)) {
        $related_articles = get_posts(array(
            'posts_per_page' => 4,
            'category' => $categories[0]->term_id,
            'orderby' => 'date',
            'order' => 'DESC',
            'post__not_in' => array($article_id),
        ));
    }
?>

<div class="min-h-screen bg-gaming-dark">
    <div class="container mx-auto px-4 py-4">
        
        <!-- Breadcrumbs -->
        <?php 
        set_query_var('breadcrumb_category', !empty($categories) ? $categories[0] : null);
        set_query_var('breadcrumb_title', $article_title);
        get_template_part('template-parts/breadcrumbs'); 
        ?>
        
        <div class="flex flex-col lg:flex-row gap-8 mt-4">
            <!-- Main Content -->
            <main class="flex-1 mx-auto">
                <article class="mb-8">
                    
                    <!-- Article Header -->
                    <header class="mb-8">
                        <!-- Category -->
                        <?php if (!empty($categories)) : ?>
                            <a 
                                href="<?php echo esc_url(get_category_link($categories[0]->term_id)); ?>"
                                class="inline-block text-gaming-accent hover:text-gaming-accent/80 font-medium text-sm mb-4 transition-colors"
                            >
                                <?php echo esc_html($categories[0]->name); ?>
                            </a>
                        <?php endif; ?>

                        <!-- Title -->
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                            <?php echo esc_html($article_title); ?>
                        </h1>
                        
                        <!-- Meta Info -->
                        <div class="flex flex-wrap items-center gap-4 text-sm mb-6">
                            <div class="flex items-center gap-2">
                                <a 
                                    href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>"
                                    class="flex items-center gap-2 text-gray-300 hover:text-gaming-accent transition-colors"
                                >
                                    <img 
                                        src="<?php echo esc_url($author_avatar); ?>" 
                                        alt="<?php echo esc_attr($author_name); ?>"
                                        class="rounded-full"
                                        width="24"
                                        height="24"
                                    />
                                    <span class="font-medium"><?php echo esc_html($author_name); ?></span>
                                </a>
                            </div>
                            <time datetime="<?php echo esc_attr($article_date); ?>" class="text-gray-400">
                                <?php echo esc_html($article_date_formatted); ?>
                            </time>
                            <span class="text-gray-400">
                                <?php echo esc_html($read_time); ?> min de lecture
                            </span>
                        </div>

                        <!-- Featured Image -->
                        <div class="relative rounded-xl overflow-hidden bg-gaming-dark-card">
                            <?php if (has_post_thumbnail()) : 
                                echo get_the_post_thumbnail(null, 'faster-hero', array(
                                    'class' => 'object-contain w-full h-auto mx-auto',
                                    'loading' => 'eager',
                                    'fetchpriority' => 'high'
                                ));
                            else : ?>
                                <div class="absolute inset-0 flex items-center justify-center bg-gaming-dark-card">
                                    <span class="text-gray-500 text-sm">Image non disponible</span>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Image Caption / Légende -->
                        <?php 
                        $caption = get_the_post_thumbnail_caption();
                        if ($caption) : ?>
                            <p class="text-sm text-gray-400 text-center mt-2 italic">
                                <?php echo esc_html($caption); ?>
                            </p>
                        <?php endif; ?>
                    </header>

                    <!-- Article Content -->
                    <div class="article-content">
                        <?php the_content(); ?>
                    </div>
                </article>

                <!-- Related Articles -->
                <?php if (!empty($related_articles)) : ?>
                    <section class="border-t border-gaming-dark-card pt-8">
                        <div class="text-2xl font-bold text-white mb-6">
                            Articles similaires
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <?php foreach ($related_articles as $related) : 
                                setup_postdata($related);
                                $related_cats = get_the_category($related->ID);
                            ?>
                                <a 
                                    href="<?php echo get_permalink($related); ?>"
                                    class="group block"
                                >
                                    <article>
                                        <!-- Image -->
                                        <div class="relative aspect-video rounded-lg overflow-hidden bg-gaming-dark-card mb-4">
                                            <?php if (has_post_thumbnail($related)) : 
                                                echo get_the_post_thumbnail($related, 'faster-news', array(
                                                    'class' => 'object-cover w-full h-full',
                                                    'loading' => 'lazy'
                                                ));
                                            endif; ?>
                                        </div>

                                        <!-- Content -->
                                        <div>
                                            <?php if (!empty($related_cats)) : ?>
                                                <span class="text-gaming-accent text-sm font-medium mb-2 block">
                                                    <?php echo esc_html($related_cats[0]->name); ?>
                                                </span>
                                            <?php endif; ?>
                                            <div class="text-gray-300 group-hover:text-gaming-accent transition-colors line-clamp-2 text-base font-medium mb-2">
                                                <?php echo get_the_title($related); ?>
                                            </div>
                                            <time datetime="<?php echo get_the_date('c', $related); ?>" class="text-sm text-gray-400">
                                                <?php echo get_the_date('j F Y', $related); ?>
                                            </time>
                                        </div>
                                    </article>
                                </a>
                            <?php endforeach; wp_reset_postdata(); ?>
                        </div>
                    </section>
                <?php endif; ?>
            </main>
            
            <!-- Sidebar -->
            <?php 
            set_query_var('sidebar_posts', $latest_posts);
            get_template_part('template-parts/sidebar'); 
            ?>
        </div>
    </div>
</div>

<?php endwhile; get_footer(); ?>
