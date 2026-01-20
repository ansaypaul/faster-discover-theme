<?php
/**
 * Template Name: Author Page
 * Description: Page de l'auteur avec ses articles
 */

get_header();

// Get author data
$author_id = get_the_author_meta('ID');
$author_name = get_the_author_meta('display_name');
$author_description = get_the_author_meta('description');
$author_avatar = get_avatar_url($author_id, ['size' => 160]);
$author_role = get_the_author_meta('role'); // Custom field si nécessaire
$author_website = get_the_author_meta('user_url');

// Custom fields (Job + Socials)
$author_custom = faster_get_author_info($author_id);
$author_job = $author_custom['job_title'];
$author_socials = $author_custom['socials'];

// DEBUG - À retirer après
// echo '<pre>DEBUG: '; var_dump($author_socials); echo '</pre>';

// Pagination
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

// Query author posts
$author_posts = new WP_Query(array(
    'author' => $author_id,
    'posts_per_page' => get_option('posts_per_page', 10), // Respecte les réglages WordPress
    'paged' => $paged,
    'post_status' => 'publish',
));

$total_pages = $author_posts->max_num_pages;
?>

<div class="min-h-screen bg-gaming-dark">
    <div class="container mx-auto px-4 py-8">
        
        <!-- Breadcrumbs -->
        <?php 
        get_template_part('template-parts/breadcrumbs', null, array(
            'items' => array(
                array('label' => 'Auteurs', 'url' => home_url('/auteurs')),
                array('label' => $author_name, 'url' => '')
            )
        )); 
        ?>

        <div class="flex flex-col lg:flex-row gap-8 mt-8">
            <!-- Main Content -->
            <main class="flex-1">
                <article class="mb-8">
                    <!-- Author Header -->
                    <header class="mb-8">
                        <div class="flex flex-row items-start gap-4 sm:gap-6">
                            <!-- Author Image -->
                            <div class="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0">
                                <div class="w-full h-full rounded-full overflow-hidden bg-gaming-dark-card">
                                    <?php if ($author_avatar): ?>
                                        <img 
                                            src="<?php echo esc_url($author_avatar); ?>" 
                                            alt="Photo de <?php echo esc_attr($author_name); ?>"
                                            class="object-cover w-full h-full rounded-full"
                                            width="112"
                                            height="112"
                                        />
                                    <?php else: ?>
                                        <div class="w-full h-full flex items-center justify-center">
                                            <div class="text-2xl sm:text-3xl text-gray-500 font-bold">
                                                <?php echo strtoupper(substr($author_name, 0, 1)); ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <!-- Author Info -->
                            <div class="flex-grow min-w-0">
                                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    <?php echo esc_html($author_name); ?>
                                </h1>
                                
                                <div class="text-sm sm:text-base mb-3">
                                    <?php if ($author_job): ?>
                                        <div class="font-medium text-gaming-accent mb-2">
                                            <?php echo esc_html($author_job); ?>
                                        </div>
                                    <?php else: ?>
                                        <div class="font-medium text-gaming-accent mb-2">
                                            Journaliste
                                        </div>
                                    <?php endif; ?>
                                    
                                    <?php if ($author_website): ?>
                                        <div>
                                            <a 
                                                href="<?php echo esc_url($author_website); ?>"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-gray-400 hover:text-gaming-accent transition-colors text-sm"
                                            >
                                                Site web
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                
                                <!-- Social Networks -->
                                <?php 
                                $has_socials = false;
                                if (is_array($author_socials)) {
                                    foreach ($author_socials as $network => $url) {
                                        if (!empty($url)) {
                                            $has_socials = true;
                                            break;
                                        }
                                    }
                                }
                                
                                if ($has_socials): ?>
                                <div class="flex items-center gap-2 sm:gap-3 mb-3">
                                    <?php 
                                    // Couleurs officielles des réseaux sociaux
                                    $social_colors = array(
                                        'twitter' => '#1DA1F2',
                                        'instagram' => '#E1306C',
                                        'linkedin' => '#0A66C2',
                                        'youtube' => '#FF0000',
                                        'facebook' => '#1877F2',
                                        'twitch' => '#9146FF',
                                    );
                                    
                                    foreach ($author_socials as $network => $url): 
                                        if (!empty($url)):
                                            $network_name = str_replace('_', '', $network);
                                            $icon_path = faster_get_social_icon($network_name);
                                            $color = isset($social_colors[$network_name]) ? $social_colors[$network_name] : '#06D6A0';
                                            if ($icon_path):
                                    ?>
                                        <a 
                                            href="<?php echo esc_url($url); ?>" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                            style="background-color: <?php echo esc_attr($color); ?>;"
                                            aria-label="<?php echo esc_attr(ucfirst($network_name)); ?>"
                                        >
                                            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="white" viewBox="0 0 24 24">
                                                <?php echo $icon_path; ?>
                                            </svg>
                                        </a>
                                    <?php 
                                            endif;
                                        endif;
                                    endforeach; ?>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <!-- Bio en pleine largeur -->
                        <?php if ($author_description): ?>
                            <div class="mt-6 pt-6 border-t border-gaming-dark-lighter">
                                <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                                    <?php echo wp_kses_post($author_description); ?>
                                </p>
                            </div>
                        <?php endif; ?>
                    </header>

                    <!-- Extended Bio (if exists) -->
                    <?php 
                    $author_bio = get_the_author_meta('biographical_info', $author_id); // Custom field
                    if ($author_bio): 
                    ?>
                        <div class="article-content mt-8">
                            <?php echo wp_kses_post($author_bio); ?>
                        </div>
                    <?php endif; ?>
                </article>

                <!-- Author Articles -->
                <section class="border-t border-gaming-dark-card pt-8">
                    <h2 class="text-2xl font-bold text-white mb-6">
                        Articles de <?php echo esc_html($author_name); ?>
                    </h2>

                    <?php if ($author_posts->have_posts()): ?>
                        <!-- Articles Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <?php while ($author_posts->have_posts()): $author_posts->the_post(); ?>
                                <a href="<?php the_permalink(); ?>" class="group block">
                                    <article>
                                        <!-- Image -->
                                        <div class="relative aspect-[16/9] rounded-lg overflow-hidden bg-gaming-dark-card mb-4">
                                            <?php if (has_post_thumbnail()): ?>
                                                <?php the_post_thumbnail('faster-news', array(
                                                    'class' => 'object-cover w-full h-full',
                                                    'loading' => 'lazy'
                                                )); ?>
                                            <?php else: ?>
                                                <div class="w-full h-full flex items-center justify-center text-gray-500">
                                                    <span class="text-4xl">📝</span>
                                                </div>
                                            <?php endif; ?>
                                        </div>

                                        <!-- Content -->
                                        <div>
                                            <?php 
                                            $categories = get_the_category();
                                            if (!empty($categories)): 
                                            ?>
                                                <span class="text-gaming-accent text-sm font-medium mb-2 block">
                                                    <?php echo esc_html($categories[0]->name); ?>
                                                </span>
                                            <?php endif; ?>
                                            
                                            <h3 class="text-gray-300 group-hover:text-gaming-accent transition-colors line-clamp-2 text-base font-medium mb-2">
                                                <?php the_title(); ?>
                                            </h3>
                                            
                                            <time datetime="<?php echo get_the_date('c'); ?>" class="text-sm text-gray-400">
                                                <?php echo get_the_date('j F Y'); ?>
                                            </time>
                                        </div>
                                    </article>
                                </a>
                            <?php endwhile; ?>
                        </div>

                        <!-- Pagination -->
                        <?php if ($total_pages > 1): 
                            $big = 999999999;
                            $pagination = paginate_links(array(
                                'base' => str_replace($big, '%#%', esc_url(get_author_posts_url($author_id))),
                                'format' => 'page/%#%/',
                                'current' => max(1, $paged),
                                'total' => $total_pages,
                                'type' => 'array',
                                'prev_text' => '← Précédent',
                                'next_text' => 'Suivant →',
                                'mid_size' => 1,      // 1 page de chaque côté
                                'end_size' => 1,      // 1 page au début et à la fin
                            ));

                            if ($pagination) : ?>
                                <div class="mt-8">
                                    <nav class="flex flex-wrap justify-center items-center gap-2" aria-label="Pagination">
                                        <?php foreach ($pagination as $page) : ?>
                                            <?php 
                                            // Remplacer les classes par défaut par des classes Tailwind
                                            $page = str_replace('current', 'bg-gaming-accent text-gaming-dark px-4 py-2 rounded-lg font-medium', $page);
                                            $page = str_replace('page-numbers', 'px-4 py-2 rounded-lg text-gray-300', $page);
                                            $page = str_replace('dots', 'px-2 py-2 text-gray-500', $page);
                                            echo $page; 
                                            ?>
                                        <?php endforeach; ?>
                                    </nav>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>

                    <?php else: ?>
                        <div class="text-gray-400 text-center py-8">
                            Aucun article publié pour le moment.
                        </div>
                    <?php endif; ?>

                    <?php wp_reset_postdata(); ?>
                </section>
            </main>

            <!-- Sidebar -->
            <?php 
            // Articles récents pour la sidebar
            $latest_posts = get_posts(array(
                'posts_per_page' => 6,
                'orderby' => 'date',
                'order' => 'DESC',
            ));
            set_query_var('sidebar_posts', $latest_posts);
            get_template_part('template-parts/sidebar'); 
            ?>
        </div>
    </div>
</div>

<?php get_footer(); ?>
