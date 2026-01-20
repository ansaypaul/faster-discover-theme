<?php
/**
 * 404 Template - Page Not Found
 * Identique à PageNotFound.tsx du projet Next.js
 */
get_header(); 
?>

<div class="container mx-auto px-4 py-16">
    <div class="max-w-2xl mx-auto text-center">
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-bold mb-4 text-gaming-accent">404</h1>
            <p class="text-2xl text-white mb-4"><?php _e('Page non trouvée', 'faster'); ?></p>
            <p class="text-gray-400 mb-8">
                <?php _e('Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.', 'faster'); ?>
            </p>
        </div>
        
        <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block bg-gaming-primary text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-medium">
            <?php _e('Retour à l\'accueil', 'faster'); ?>
        </a>
        
        <!-- Recherche -->
        <div class="mt-12">
            <p class="text-gray-400 mb-4"><?php _e('Ou essayez de rechercher :', 'faster'); ?></p>
            <?php get_search_form(); ?>
        </div>
        
        <!-- Articles récents -->
        <div class="mt-12 text-left">
            <h2 class="text-2xl font-bold text-white mb-6 text-center"><?php _e('Articles récents', 'faster'); ?></h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <?php
                $recent_posts = wp_get_recent_posts(array(
                    'numberposts' => 3,
                    'post_status' => 'publish'
                ));
                
                foreach ($recent_posts as $post) :
                ?>
                    <a href="<?php echo get_permalink($post['ID']); ?>" class="block p-4 bg-gaming-dark-card rounded-lg">
                        <h3 class="font-bold text-white mb-1"><?php echo esc_html($post['post_title']); ?></h3>
                        <span class="text-sm text-gray-500"><?php echo get_the_date('', $post['ID']); ?></span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>
