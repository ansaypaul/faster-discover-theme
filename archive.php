<?php
/**
 * Archive Page (Category, Tag, Author, Date)
 * Identique à CategoryPage.tsx du Next.js
 * Layout: Contenu principal (max-width 956px) + Sidebar (380px)
 */

get_header();

// Récupérer les infos de l'archive
$archive_title = '';
$archive_description = '';

if (is_category()) {
    $category = get_queried_object();
    $archive_title = $category->name;
    $archive_description = $category->description;
} elseif (is_tag()) {
    $tag = get_queried_object();
    $archive_title = 'Tag: ' . $tag->name;
} elseif (is_author()) {
    $author = get_queried_object();
    $archive_title = 'Auteur: ' . $author->display_name;
} elseif (is_date()) {
    if (is_year()) {
        $archive_title = 'Année: ' . get_the_date('Y');
    } elseif (is_month()) {
        $archive_title = 'Mois: ' . get_the_date('F Y');
    } elseif (is_day()) {
        $archive_title = 'Jour: ' . get_the_date('j F Y');
    }
}

// Articles récents pour la sidebar
$latest_posts = get_posts(array(
    'posts_per_page' => 6,
    'orderby' => 'date',
    'order' => 'DESC',
));
?>

<div class="min-h-screen bg-gaming-dark">
    <div class="container mx-auto px-4 py-4">
        
        <!-- Breadcrumbs -->
        <?php if (is_category()) : 
            set_query_var('breadcrumb_category', $category);
            set_query_var('breadcrumb_title', '');
            get_template_part('template-parts/breadcrumbs');
        endif; ?>
        
        <div class="flex flex-col lg:flex-row gap-8 mt-4">
            <!-- Main Content -->
            <main class="flex-1 mx-auto">
                <!-- Titre de la catégorie/archive -->
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-8 border-l-4 border-gaming-accent pl-4">
                    <?php echo esc_html($archive_title); ?>
                </h1>

                <?php if ($archive_description) : ?>
                    <div class="text-gray-400 mb-8">
                        <?php echo wpautop($archive_description); ?>
                    </div>
                <?php endif; ?>

                <!-- Articles Grid -->
                <?php if (have_posts()) : ?>
                    <section class="mb-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <?php 
                            $index = 0;
                            while (have_posts()) : the_post(); 
                                $is_priority = $index < 2; // Les 2 premiers articles en priorité
                            ?>
                                <a 
                                    href="<?php the_permalink(); ?>"
                                    class="group"
                                >
                                    <div class="relative aspect-video w-full overflow-hidden rounded-lg">
                                        <?php if (has_post_thumbnail()) : 
                                            the_post_thumbnail('faster-medium', array(
                                                'class' => 'object-cover w-full h-full',
                                                'loading' => $is_priority ? 'eager' : 'lazy',
                                                'fetchpriority' => $is_priority ? 'high' : 'auto'
                                            ));
                                        else : ?>
                                            <div class="w-full h-full bg-gaming-dark-card"></div>
                                        <?php endif; ?>
                                    </div>
                                    <div class="mt-4">
                                        <h3 class="text-white group-hover:text-gaming-accent transition-colors font-semibold line-clamp-2">
                                            <?php the_title(); ?>
                                        </h3>
                                        <p class="text-sm text-gray-400 mt-1">
                                            <?php echo get_the_date('j F Y'); ?>
                                        </p>
                                    </div>
                                </a>
                            <?php 
                            $index++;
                            endwhile; 
                            ?>
                        </div>

                        <!-- Pagination WordPress -->
                        <?php
                        $big = 999999999;
                        $pagination = paginate_links(array(
                            'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
                            'format' => '?paged=%#%',
                            'current' => max(1, get_query_var('paged')),
                            'total' => $GLOBALS['wp_query']->max_num_pages,
                            'type' => 'array',
                            'prev_text' => '← Précédent',
                            'next_text' => 'Suivant →',
                            'mid_size' => 1,      // 1 page de chaque côté
                            'end_size' => 1,      // 1 page au début et à la fin
                        ));

                        if ($pagination) : ?>
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
                        <?php endif; ?>
                    </section>

                <?php else : ?>
                    <div class="text-center py-12">
                        <p class="text-gray-400">Aucun article disponible dans cette catégorie.</p>
                    </div>
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

<?php get_footer(); ?>
