<?php
/**
 * Faster Theme Functions
 * Thème ultra-performant avec Tailwind CSS
 */

// 1. THEME SETUP
function faster_setup() {
    // Support HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Title tag
    add_theme_support('title-tag');
    
    // Post thumbnails
    add_theme_support('post-thumbnails');
    
    // Custom logo
    add_theme_support('custom-logo');
    
    // Navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'faster'),
        'secondary' => __('Category Menu', 'faster'),
        'footer-navigation' => __('Footer - Navigation', 'faster'),
        'footer-pages' => __('Footer - Pages', 'faster'),
    ));
    
    // Image sizes optimisées (identique Next.js) - Toutes en 16:9
    add_image_size('faster-hero', 1200, 675, true);       // Hero layout - Images principales
    add_image_size('faster-medium', 768, 432, true);      // Medium layout - Archives, related
    add_image_size('faster-news', 384, 216, true);        // News layout - Grilles articles
    add_image_size('faster-side', 160, 90, true);         // Side layout - Miniatures
}
add_action('after_setup_theme', 'faster_setup');

// Menu Walker
require_once get_template_directory() . '/inc/menu-walker.php';

// Admin Settings Page
require_once get_template_directory() . '/inc/admin-settings.php';

// Brevo Newsletter Integration
require_once get_template_directory() . '/inc/brevo-newsletter.php';

// Author Custom Fields (Job + Social Networks)
require_once get_template_directory() . '/inc/author-fields.php';

// Category Colors (Couleurs des badges de catégories)
require_once get_template_directory() . '/inc/category-colors.php';

// Dossier Taxonomy (Regroupement thématique d'articles)
require_once get_template_directory() . '/inc/dossier.php';

// Inline Related Posts (Articles similaires automatiques)
require_once get_template_directory() . '/inc/inline-related-posts.php';

// 2. DÉSACTIVATION FEATURES WP INUTILES (Performance)

// Emojis
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');

// Embeds
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');

// DNS Prefetch inutiles
remove_action('wp_head', 'wp_resource_hints', 2);

// RSS feeds si non utilisés
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);

// WP version
remove_action('wp_head', 'wp_generator');

// Shortlink
remove_action('wp_head', 'wp_shortlink_wp_head');

// REST API links (si non nécessaire)
remove_action('wp_head', 'rest_output_link_wp_head');

// WLW Manifest
remove_action('wp_head', 'wlwmanifest_link');

// RSD Link
remove_action('wp_head', 'rsd_link');

// 3. ENQUEUE ASSETS (Optimisé avec defer)

function faster_enqueue_assets() {
    // CSS Tailwind compilé avec versioning
    wp_enqueue_style(
        'faster-main', 
        get_template_directory_uri() . '/assets/css/main.css',
        array(),
        filemtime(get_template_directory() . '/assets/css/main.css')
    );
    
    // JS avec defer et versioning
    wp_enqueue_script(
        'faster-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        filemtime(get_template_directory() . '/assets/js/main.js'),
        true // in footer
    );
    
    // Localize script pour Brevo Newsletter (uniquement sur homepage pour optimiser)
    if (is_front_page() && function_exists('faster_get_brevo_localize_data')) {
        wp_localize_script('faster-main', 'brevoNewsletter', faster_get_brevo_localize_data());
    }
}
add_action('wp_enqueue_scripts', 'faster_enqueue_assets');

// Ajouter attribut defer aux scripts
function faster_defer_scripts($tag, $handle) {
    if ('faster-main' === $handle) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'faster_defer_scripts', 10, 2);

// 4. HELPERS & UTILITIES

/**
 * Pagination personnalisée avec classes Tailwind
 */
function faster_pagination() {
    the_posts_pagination(array(
        'mid_size' => 2,
        'prev_text' => __('&larr; Précédent', 'faster'),
        'next_text' => __('Suivant &rarr;', 'faster'),
        'class' => 'flex justify-center space-x-2 mt-8',
    ));
}

/**
 * Menu de navigation avec classes Tailwind (gaming style)
 */
class Faster_Walker_Nav_Menu extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
        
        $output .= '<li class="' . esc_attr($class_names) . '">';
        
        $attributes = '';
        $attributes .= !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
        $attributes .= ' class="text-gray-300 hover:text-gaming-accent transition-colors duration-200 text-sm"';
        
        $item_output = $args->before;
        $item_output .= '<a' . $attributes . '>';
        $item_output .= $args->link_before . apply_filters('the_title', $item->title, $item->ID) . $args->link_after;
        $item_output .= '</a>';
        $item_output .= $args->after;
        
        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }
}

/**
 * Ajouter class prose-invert pour le contenu dark mode
 */
function faster_content_class($content) {
    // Ajouter des classes Tailwind au contenu
    return $content;
}

/**
 * Support de prose-invert pour Tailwind Typography
 */
add_action('wp_head', function() {
    ?>
    <style>
        .prose-invert {
            --tw-prose-body: rgb(209, 213, 219);
            --tw-prose-headings: rgb(255, 255, 255);
            --tw-prose-links: rgb(59, 130, 246);
            --tw-prose-bold: rgb(255, 255, 255);
            --tw-prose-code: rgb(255, 255, 255);
        }
    </style>
    <?php
});

/**
 * Récupère les articles les plus vus (via Koko Analytics)
 * 
 * @param int $limit Nombre d'articles à récupérer
 * @param int $days Période en jours (7 = dernière semaine, 30 = dernier mois)
 * @param array $exclude_ids IDs des articles à exclure
 * @return array Posts objects
 */
function faster_get_most_viewed_posts($limit = 6, $days = 7, $exclude_ids = array()) {
    global $wpdb;
    
    // Table Koko Analytics
    $table_name = $wpdb->prefix . 'koko_analytics_post_stats';
    
    // Vérifier si la table existe
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_name}'");
    if (!$table_exists) {
        // Fallback : derniers articles
        return get_posts(array(
            'posts_per_page' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'post',
            'post_status' => 'publish',
            'post__not_in' => $exclude_ids,
        ));
    }
    
    // Date limite
    $date_start = date('Y-m-d', strtotime("-{$days} days"));
    
    // Préparer la clause d'exclusion
    $exclude_clause = '';
    if (!empty($exclude_ids)) {
        $exclude_ids_str = implode(',', array_map('intval', $exclude_ids));
        $exclude_clause = " AND p.post_id NOT IN ({$exclude_ids_str})";
    }
    
    // Requête pour les posts les plus vus (uniquement les posts publiés)
    $post_ids = $wpdb->get_col($wpdb->prepare("
        SELECT ka.post_id
        FROM {$table_name} ka
        INNER JOIN {$wpdb->posts} posts ON ka.post_id = posts.ID
        WHERE ka.date >= %s
        AND posts.post_status = 'publish'
        AND posts.post_type = 'post'
        {$exclude_clause}
        GROUP BY ka.post_id
        ORDER BY SUM(ka.pageviews) DESC
        LIMIT %d
    ", $date_start, $limit));
    
    if (empty($post_ids)) {
        // Fallback si pas de stats
        return get_posts(array(
            'posts_per_page' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'post',
            'post_status' => 'publish',
            'post__not_in' => $exclude_ids,
        ));
    }
    
    // Récupérer les posts dans l'ordre des vues
    return get_posts(array(
        'post__in' => $post_ids,
        'orderby' => 'post__in',
        'posts_per_page' => $limit,
        'post_type' => 'post',
        'post_status' => 'publish',
    ));
}

/**
 * Ajouter une colonne "Vues" dans la liste des articles (Admin)
 */
function faster_add_views_column($columns) {
    // Ajouter la colonne avant "Date"
    $new_columns = array();
    foreach ($columns as $key => $value) {
        if ($key === 'date') {
            $new_columns['views'] = '👁️ Vues (7j)';
        }
        $new_columns[$key] = $value;
    }
    return $new_columns;
}
add_filter('manage_posts_columns', 'faster_add_views_column');

/**
 * Afficher le nombre de vues dans la colonne
 */
function faster_display_views_column($column_name, $post_id) {
    if ($column_name !== 'views') return;
    
    global $wpdb;
    
    // Table Koko Analytics
    $table_name = $wpdb->prefix . 'koko_analytics_post_stats';
    
    // Vérifier si la table existe
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_name}'");
    if (!$table_exists) {
        echo '<span style="color: #999;" title="Koko Analytics non installé">—</span>';
        return;
    }
    
    // Stats des 7 derniers jours
    $date_start = date('Y-m-d', strtotime('-7 days'));
    
    // Requête pour récupérer les vues
    $views = $wpdb->get_var($wpdb->prepare("
        SELECT SUM(pageviews)
        FROM {$table_name}
        WHERE post_id = %d
        AND date >= %s
    ", $post_id, $date_start));
    
    $views = $views ? intval($views) : 0;
    
    // Affichage avec formatage
    if ($views > 0) {
        $formatted = $views >= 1000 ? number_format($views / 1000, 1) . 'k' : number_format($views);
        echo '<strong style="color: #06d6a0;">' . esc_html($formatted) . '</strong>';
    } else {
        echo '<span style="color: #999;">0</span>';
    }
}
add_action('manage_posts_custom_column', 'faster_display_views_column', 10, 2);

/**
 * Rendre la colonne "Vues" triable
 */
function faster_views_column_sortable($columns) {
    $columns['views'] = 'views';
    return $columns;
}
add_filter('manage_edit-post_sortable_columns', 'faster_views_column_sortable');

/**
 * Gérer le tri par vues
 */
function faster_views_column_orderby($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }
    
    if ($query->get('orderby') !== 'views') {
        return;
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'koko_analytics_post_stats';
    $date_start = date('Y-m-d', strtotime('-7 days'));
    
    // Joindre avec la table Koko Analytics
    $query->set('meta_query', array());
    
    // Note: Pour un vrai tri, il faudrait une meta_key ou une jointure custom
    // Pour l'instant, on laisse WordPress gérer l'ordre par défaut
}
add_action('pre_get_posts', 'faster_views_column_orderby');

// ========================================================
// FONCTIONS ADDITIONNELLES (depuis ancien thème)
// ========================================================

/**
 * Colonne Vignette dans la liste des articles
 */
function faster_add_thumbnail_column($columns) {
    $new_columns = array();
    foreach ($columns as $key => $value) {
        if ($key === 'title') {
            $new_columns['thumbnail'] = '🖼️ Vignette';
        }
        $new_columns[$key] = $value;
    }
    return $new_columns;
}
add_filter('manage_posts_columns', 'faster_add_thumbnail_column');

function faster_display_thumbnail_column($column, $post_id) {
    if ($column === 'thumbnail') {
        if (has_post_thumbnail($post_id)) {
            echo get_the_post_thumbnail($post_id, array(50, 50));
        } else {
            echo '<span style="color: #999;">—</span>';
        }
    }
}
add_action('manage_posts_custom_column', 'faster_display_thumbnail_column', 10, 2);

/**
 * Colonne Auto (articles auto-générés)
 */
add_filter('manage_posts_columns', function($columns) {
    $columns['article_auto'] = '🤖 Auto';
    return $columns;
});

add_action('manage_posts_custom_column', function($column, $post_id) {
    if ($column === 'article_auto') {
        $auto = get_post_meta($post_id, '_article_auto', true);
        if ($auto == 1) {
            echo '✅ Oui';
        } else {
            echo '❌ Non';
        }
    }
}, 10, 2);

/**
 * Filtres de nettoyage du contenu
 */
// Supprime les tirets cadratins bizarres
function faster_filter_em_dash_content($content) {
    $content = str_replace(' –', '', $content);
    $content = str_replace('— ', '', $content);
    $content = str_replace(' —', '', $content);
    return $content;
}
add_filter('the_content', 'faster_filter_em_dash_content');

// Supprime les espaces insécables bizarres
add_filter('the_content', function ($content) {
    if (empty($content)) return $content;
    
    $content = str_replace(
        ["\xC2\xA0", "\xE2\x80\xAF", "\xE2\x80\x89", "\xE2\x80\xA8", "\xE2\x80\xA9", "&nbsp;"],
        ' ',
        $content
    );
    
    return $content;
}, 1);

// Supprime les numéros de citations [1], [2], etc.
add_filter('the_content', function ($content) {
    return preg_replace('/\[\d+\]/', '', $content);
});

/**
 * Meta Author dans le head (SEO)
 */
add_action('wp_head', function() {
    if (!is_single() || is_admin()) return;
    
    $author_id = (int) get_post_field('post_author', get_queried_object_id());
    $author_name = $author_id ? get_the_author_meta('display_name', $author_id) : '';
    
    if ($author_name) {
        echo "\n<meta name=\"author\" content=\"" . esc_attr($author_name) . "\">\n";
    }
}, 1);

/**
 * Optimisation des images
 */
// Retirer les tailles trop grandes
function faster_remove_large_image_sizes($sizes) {
    unset($sizes['2048x2048']);
    unset($sizes['1536x1536']);
    return $sizes;
}
add_filter('intermediate_image_sizes_advanced', 'faster_remove_large_image_sizes');

// Limiter la taille max d'upload à 1200px
add_filter('big_image_size_threshold', function() {
    return 1200;
});

/**
 * Amazon - Détection et disclaimer
 */
function faster_has_amazon_link($content = null) {
    if (is_null($content)) {
        global $post;
        if (!isset($post->post_content)) return false;
        $content = $post->post_content;
    }

    $patterns = [
        '/\[amazon/i',
        '/https?:\/\/(www\.)?amazon\.[a-z]{2,3}\/dp\//i',
        '/https?:\/\/amzn\.to\//i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            return true;
        }
    }

    return false;
}

function faster_add_amazon_disclaimer($content) {
    if (is_singular('post') && in_the_loop() && is_main_query()) {
        if (faster_has_amazon_link($content)) {
            $extra = '
            <div class="amazon-disclaimer" style="font-size:0.9em; color:#777; margin-top:20px;">
                <i>Cet article contient des liens affiliés Amazon. En tant que partenaire Amazon, ce site peut percevoir une commission sur les achats éligibles, sans coût supplémentaire pour vous.</i>
            </div>
            <div id="mediavine-settings" data-blocklist-all="1"></div>';
            $content .= $extra;
        }
    }
    return $content;
}
add_filter('the_content', 'faster_add_amazon_disclaimer');

/**
 * Mediavine - Blocker meta box
 */
function faster_add_mediavine_blocker_meta_box() {
    add_meta_box(
        'mediavine_blocker',
        'Paramètres Publicité',
        'faster_render_mediavine_blocker_meta_box',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'faster_add_mediavine_blocker_meta_box');

function faster_render_mediavine_blocker_meta_box($post) {
    wp_nonce_field('mediavine_blocker_nonce', 'mediavine_blocker_nonce_field');
    
    $block_ads = get_post_meta($post->ID, '_block_mediavine_ads', true);
    ?>
    <label style="display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" 
               name="block_mediavine_ads" 
               value="1" 
               <?php checked($block_ads, '1'); ?>>
        <span>Bloquer les publicités Mediavine sur cet article</span>
    </label>
    <p class="description" style="margin-top: 10px; font-size: 12px; color: #666;">
        Active cette option pour désactiver toutes les publicités Mediavine sur cette page.
    </p>
    <?php
}

function faster_save_mediavine_blocker_meta_box($post_id) {
    if (!isset($_POST['mediavine_blocker_nonce_field'])) return;
    if (!wp_verify_nonce($_POST['mediavine_blocker_nonce_field'], 'mediavine_blocker_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;
    
    if (isset($_POST['block_mediavine_ads'])) {
        update_post_meta($post_id, '_block_mediavine_ads', '1');
    } else {
        delete_post_meta($post_id, '_block_mediavine_ads');
    }
}
add_action('save_post', 'faster_save_mediavine_blocker_meta_box');

function faster_add_mediavine_blocker_to_content($content) {
    if (is_singular('post') && in_the_loop() && is_main_query()) {
        $block_ads = get_post_meta(get_the_ID(), '_block_mediavine_ads', true);
        
        if ($block_ads == '1') {
            $content .= '<div id="mediavine-settings" data-blocklist-all="1"></div>';
        }
    }
    return $content;
}
add_filter('the_content', 'faster_add_mediavine_blocker_to_content');

/**
 * No-lazy sur les images "large" (première image LCP)
 */
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
    if (!is_single() && !is_page()) {
        return $attr;
    }

    if (empty($attr['class']) || strpos($attr['class'], 'size-large') === false) {
        return $attr;
    }

    $attr['class'] .= ' no-lazy';
    unset($attr['loading']);

    return $attr;
}, 10, 2);

/**
 * Bloc "En résumé" pour les articles
 */
function wog_get_article_resume_html() {
    if (is_admin() || !is_singular('post')) {
        return '';
    }

    $manual_resume = function_exists('get_field') ? (string) get_field('resume_edit') : '';
    $auto_resume = (string) get_post_meta(get_the_ID(), '_article_resume', true);

    $resume_raw = !empty(trim($manual_resume)) ? $manual_resume : $auto_resume;
    if (empty(trim($resume_raw))) {
        return '';
    }

    $allowed = array(
        'p'  => array(),
        'ul' => array(),
        'ol' => array(),
        'li' => array(),
        'br' => array(),
        'b'  => array(),
        'strong' => array(),
        'i'  => array(),
        'em' => array(),
        'a'  => array(
            'href'   => true,
            'title'  => true,
            'rel'    => true,
            'target' => true,
        ),
    );
    $resume_html_safe = wp_kses($resume_raw, $allowed);

    $items = array();
    if (preg_match_all('/<li\b[^>]*>(.*?)<\/li>/is', $resume_html_safe, $m)) {
        foreach ($m[1] as $li_html) {
            $text = trim(wp_strip_all_tags($li_html));
            if ($text !== '') {
                $items[] = $text;
            }
        }
    }

    $intro = '';
    $before_list = preg_split('/<(ul|ol)\b[^>]*>/i', $resume_html_safe, 2);
    if (!empty($before_list[0])) {
        $intro = trim(wp_strip_all_tags($before_list[0]));
    }

    if ($intro === '' && preg_match('/<p\b[^>]*>(.*?)<\/p>/is', $resume_html_safe, $pm)) {
        $intro = trim(wp_strip_all_tags($pm[1]));
    }

    if ($intro === '') {
        $intro = trim(wp_strip_all_tags($resume_html_safe));
    }

    if ($intro === '' && empty($items)) {
        return '';
    }

    $items = array_values(array_filter($items));
    $items = array_slice($items, 0, 6);

    ob_start();
    ?>
    <div class="my-8" role="doc-abstract">
        <details class="bg-gaming-dark-card rounded-xl p-6 my-6" open>
            <summary class="text-xl font-bold text-gaming-accent cursor-pointer list-none mb-4 flex items-center">
                <span class="text-2xl mr-2">📝</span>
                En résumé
            </summary>

            <?php if ($intro !== '') : ?>
                <p class="text-gray-300 text-base leading-relaxed mb-4"><?php echo esc_html($intro); ?></p>
            <?php endif; ?>

            <?php if (!empty($items)) : ?>
                <ul class="list-none p-0 m-0 space-y-2">
                    <?php foreach ($items as $item) : ?>
                        <li class="text-gray-300 leading-relaxed pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-gaming-accent before:font-bold before:text-lg">
                            <?php echo esc_html($item); ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

        </details>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Google News Bar (désactivé par défaut)
 */
// Fonction pour afficher la barre Google News (à appeler dans single.php après </article>)
function faster_display_gnews_bar() {
    $gnews_url = 'https://news.google.com/publications/CAAqKQgKIiNDQklTRkFnTWFoQUtEbmR2Y214a2IyWm5aV1ZyTG1aeUtBQVAB?hl=fr&amp;gl=FR&amp;ceid=FR%3Afr';
    ?>
    <a 
        href="<?php echo esc_url($gnews_url); ?>" 
        target="_blank" 
        rel="noopener nofollow"
        class="block mb-6 sm:mb-8 bg-gaming-dark-card hover:bg-gaming-dark-lighter rounded-lg border-l-4 border-gaming-accent p-4 sm:p-5 transition-colors group"
    >
        <div class="flex items-center justify-between gap-4">
            <div class="flex-1">
                <div class="text-gaming-accent text-base font-bold mb-2 uppercase tracking-wide">
                🙂 Vous avez aimé cet article ?
                </div>
                <div class="text-white text-base font-medium">
                Alors suivez WorldOfGeek sur Google Actualités pour retrouver nos prochains articles directement dans votre fil. C'est gratuit et ça mange pas de pain 🥖.
                </div>
            </div>
            <svg class="w-5 h-5 text-gaming-accent group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </div>
    </a>
    <?php
} 

// ========================================================
// Google Tag Manager Integration
// ========================================================

/**
 * GTM - Script dans le <head>
 */
function faster_gtm_head() {
    ?>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TFHT3GMP');</script>
    <!-- End Google Tag Manager -->
    <?php
}
add_action('wp_head', 'faster_gtm_head', 1);

/**
 * GTM - Noscript après <body>
 */
function faster_gtm_body() {
    ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TFHT3GMP"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
}
add_action('wp_body_open', 'faster_gtm_body', 1);


add_filter('the_content', function ($content) {
  if (!is_singular('post')) return $content;

  global $post;
  if (!$post) return $content;

  $title = get_the_title($post);
  if (!geo_title_looks_like_list($title)) return $content;

  // Ajoute des IDs aux H2 éligibles si absents (pour que les #anchors existent vraiment)
  return geo_add_ids_to_h2($content);
}, 20);

add_action('wp_head', function () {
  if (!is_singular('post')) return;

  global $post;
  if (!$post) return;

  $title = get_the_title($post);
  if (!geo_title_looks_like_list($title)) return;

  // Important: on passe par the_content pour récupérer le HTML final (avec ids ajoutés)
  $html = apply_filters('the_content', $post->post_content);

  $items = geo_extract_h2_items_with_ids($html);
  if (count($items) < 3) return;

  $permalink = get_permalink($post);

  $jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'ItemList',
    'name' => $title,
    'url'  => $permalink,
    'itemListOrder' => 'https://schema.org/ItemListUnordered',
    'numberOfItems' => count($items),
    'itemListElement' => array_map(function ($it, $idx) use ($permalink) {
      $entry = [
        '@type' => 'ListItem',
        'position' => $idx + 1,
        'name' => $it['name'],
      ];

      if (!empty($it['id'])) {
        $entry['url'] = $permalink . '#' . $it['id'];
      }

      return $entry;
    }, $items, array_keys($items)),
  ];

  echo "\n<script type=\"application/ld+json\">" .
    wp_json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) .
    "</script>\n";
}, 99);

/**
 * Détection titre "Top/Sélection".
 */
function geo_title_looks_like_list(string $title): bool {
  $t = mb_strtolower($title);

  return (bool) preg_match(
    '/\b(top\s*\d+|meilleur|meilleurs|sélection|selection|classement|comparatif|guide d\'achat|à venir|a venir|attendu|attendus|best)\b/u',
    $t
  );
}

/**
 * Ignore les H2 qui ne sont pas des items.
 */
function geo_h2_is_excluded(string $text): bool {
  return (bool) preg_match('/^(pourquoi|faq|questions|à retenir|en bref|bonus|sources)/iu', $text);
}

/**
 * Ajoute des attributs id aux H2 éligibles si absents.
 */
function geo_add_ids_to_h2(string $html): string {
  libxml_use_internal_errors(true);

  $dom = new DOMDocument();
  $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
  $xpath = new DOMXPath($dom);

  $h2s = $xpath->query('//h2');
  if (!$h2s || $h2s->length === 0) return $html;

  $used = [];

  foreach ($h2s as $h2) {
    $text = trim(preg_replace('/\s+/', ' ', $h2->textContent));
    if ($text === '') continue;

    // Nettoyage numérotation éventuelle
    $clean = preg_replace('/^\s*(\d+[\.\)\-:]\s+)/u', '', $text);
    $clean = trim($clean);

    if ($clean === '' || geo_h2_is_excluded($clean)) continue;

    // Si un id existe déjà, on le réserve (et on évite collision)
    $existingId = '';
    if ($h2->hasAttribute('id')) {
      $existingId = trim($h2->getAttribute('id'));
      if ($existingId !== '') {
        $base = $existingId;
        $final = $base;
        $n = 2;
        while (isset($used[$final])) {
          $final = $base . '-' . $n;
          $n++;
        }
        if ($final !== $existingId) {
          $h2->setAttribute('id', $final);
        }
        $used[$final] = true;
        continue;
      }
    }

    // Génère un id depuis le titre H2
    $base = sanitize_title($clean);
    if ($base === '') continue;

    $final = $base;
    $n = 2;
    while (isset($used[$final])) {
      $final = $base . '-' . $n;
      $n++;
    }

    $h2->setAttribute('id', $final);
    $used[$final] = true;
  }

  return $dom->saveHTML();
}

/**
 * Extrait les items (name + id) depuis les H2.
 */
function geo_extract_h2_items_with_ids(string $html): array {
  libxml_use_internal_errors(true);

  $dom = new DOMDocument();
  $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
  $xpath = new DOMXPath($dom);

  $h2s = $xpath->query('//h2');
  $items = [];
  $seen = [];

  foreach ($h2s as $h2) {
    $text = trim(preg_replace('/\s+/', ' ', $h2->textContent));
    if ($text === '') continue;

    $text = preg_replace('/^\s*(\d+[\.\)\-:]\s+)/u', '', $text);
    $text = trim($text);

    if ($text === '' || geo_h2_is_excluded($text)) continue;

    $name = mb_substr($text, 0, 120);
    $key = mb_strtolower($name);
    if (isset($seen[$key])) continue;
    $seen[$key] = true;

    $id = $h2->hasAttribute('id') ? trim($h2->getAttribute('id')) : '';
    $items[] = ['name' => $name, 'id' => $id];
  }

  return $items;
}