<?php
/**
 * Template for Pages
 * Identique à PagePage.tsx du Next.js
 */

get_header();

while (have_posts()) : the_post();
    
    // Articles récents pour la sidebar
    $latest_posts = get_posts(array(
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
?>

<div class="container mx-auto px-4 py-8">
        
        <!-- Breadcrumbs -->
        <?php 
        get_template_part('template-parts/breadcrumbs', null, array(
            'items' => array(
                array('label' => get_the_title(), 'url' => '')
            )
        )); 
        ?>

        <div class="flex flex-col lg:flex-row gap-8 mt-8">
            <!-- Main Content -->
            <main class="flex-1 mx-auto">
                <article>
                    <!-- Title -->
                    <h1 class="text-3xl sm:text-4xl font-bold text-white mb-8">
                        <?php the_title(); ?>
                    </h1>
                    
                    <!-- Featured Image -->
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="relative rounded-xl overflow-hidden bg-gaming-dark-card mb-8">
                            <?php the_post_thumbnail('faster-hero', array(
                                'class' => 'object-contain w-full h-auto mx-auto',
                                'loading' => 'eager'
                            )); ?>
                        </div>
                        
                        <!-- Image Caption -->
                        <?php 
                        $caption = get_the_post_thumbnail_caption();
                        if ($caption) : ?>
                            <p class="text-sm text-gray-400 text-center mb-8 italic">
                                <?php echo esc_html($caption); ?>
                            </p>
                        <?php endif; ?>
                    <?php endif; ?>
                    
                    <!-- Content -->
                    <div class="article-content">
                        <?php the_content(); ?>
                    </div>
                    
                    <!-- Child Pages -->
                    <?php
                    $child_pages = get_pages(array(
                        'child_of' => get_the_ID(),
                        'sort_column' => 'menu_order',
                    ));
                    
                    if ($child_pages) :
                    ?>
                        <div class="mt-12 pt-8 border-t border-gaming-dark-card">
                            <h2 class="text-2xl font-bold text-white mb-6">Pages liées</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <?php foreach ($child_pages as $child) : ?>
                                    <a href="<?php echo get_permalink($child->ID); ?>" 
                                       class="block p-4 bg-gaming-dark-card border border-gaming-dark-lighter rounded-lg hover:border-gaming-accent hover:shadow-lg transition">
                                        <h3 class="font-bold text-lg mb-2 text-white">
                                            <?php echo esc_html($child->post_title); ?>
                                        </h3>
                                        <?php if ($child->post_excerpt) : ?>
                                            <p class="text-gray-400 text-sm">
                                                <?php echo esc_html($child->post_excerpt); ?>
                                            </p>
                                        <?php endif; ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </article>
            </main>

            <!-- Sidebar -->
            <?php 
            set_query_var('sidebar_posts', $latest_posts);
            get_template_part('template-parts/sidebar'); 
            ?>
        </div>
    </div>

<?php 
endwhile;
get_footer(); 
?>
