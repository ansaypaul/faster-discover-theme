<?php
/**
 * Breadcrumbs - Fil d'Ariane
 * Identique à Breadcrumbs.tsx
 */

$category = get_query_var('breadcrumb_category', null);
$title = get_query_var('breadcrumb_title', '');
?>

<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm mb-4 overflow-hidden whitespace-nowrap">
    <a 
        href="<?php echo esc_url(home_url('/')); ?>"
        class="text-gray-400 hover:text-gaming-accent transition-colors flex-shrink-0"
    >
        Accueil
    </a>

    <?php if ($category) : ?>
        <div class="flex items-center space-x-2 flex-shrink-0">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <a 
                href="<?php echo esc_url(get_category_link($category->term_id)); ?>"
                class="text-gray-400 hover:text-gaming-accent transition-colors"
            >
                <?php echo esc_html($category->name); ?>
            </a>
        </div>
    <?php endif; ?>

    <?php if ($title) : ?>
        <div class="flex items-center space-x-2 flex-shrink-0">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span class="text-gray-300 truncate max-w-xs"><?php echo esc_html(wp_trim_words($title, 8)); ?></span>
        </div>
    <?php endif; ?>
</nav>
