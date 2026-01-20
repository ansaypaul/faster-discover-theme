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
