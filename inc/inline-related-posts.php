<?php
/**
 * Inline Related Posts - Articles similaires automatiques
 * Insère automatiquement des articles similaires dans le contenu
 */

// Fonction pour récupérer les articles similaires
function faster_get_inline_related_posts($current_post_id, $limit = 3) {
    // Priorité 1 : Vérifier si l'article a un dossier
    if (function_exists('wog_has_dossier') && function_exists('wog_get_dossier_related_posts')) {
        $has_dossier = wog_has_dossier($current_post_id);
        if ($has_dossier) {
            $dossier_posts = wog_get_dossier_related_posts($current_post_id, $limit);
            if (!empty($dossier_posts)) {
                return $dossier_posts;
            }
        }
    }
    
    // Priorité 2 : Fallback sur la catégorie
    $categories = get_the_category($current_post_id);
    
    if (empty($categories)) {
        return array();
    }
    
    $args = array(
        'posts_per_page' => $limit,
        'post__not_in' => array($current_post_id),
        'category__in' => array($categories[0]->term_id),
        'orderby' => 'date',
        'order' => 'DESC',
        'post_type' => 'post',
        'post_status' => 'publish',
    );
    
    return get_posts($args);
}

// Template HTML pour afficher UN article similaire
function faster_render_single_related_post($post) {
    ob_start();
    ?>
    <a 
        href="<?php echo get_permalink($post); ?>" 
        class="flex items-center justify-between gap-4 my-6 sm:my-8 bg-gaming-dark-card hover:bg-gaming-dark-lighter rounded-lg border-l-4 border-gaming-accent p-4 sm:p-5 transition-colors group"
    >
        <div class="flex-1 flex items-baseline gap-2 flex-wrap">
            <span class="text-gaming-accent text-sm sm:text-base font-bold flex-shrink-0 uppercase tracking-wide">
                À LIRE AUSSI
            </span>
            <span class="text-white text-sm sm:text-base font-medium underline decoration-transparent group-hover:decoration-white transition-all">
                <?php echo get_the_title($post); ?>
            </span>
        </div>
        <svg class="w-5 h-5 text-gaming-accent group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
    </a>
    <?php
    return ob_get_clean();
}

// Insertion automatique dans le contenu (après un </p> tous les X paragraphes)
function faster_insert_inline_related_posts($content) {
    // Uniquement sur les articles
    if (!is_singular('post') || !in_the_loop() || !is_main_query()) {
        return $content;
    }
    
    // Récupérer les articles similaires
    $related_posts = faster_get_inline_related_posts(get_the_ID(), 3);
    
    if (empty($related_posts)) {
        return $content;
    }
    
    // Découper le contenu en paragraphes
    $paragraphs = explode('</p>', $content);
    $total_paragraphs = count($paragraphs);
    
    // Insérer un article tous les 3 paragraphes (après le </p>)
    $insert_every = 3;
    
    foreach ($related_posts as $index => $post) {
        $insert_after = ($index + 1) * $insert_every; // Position: 3, 6, 9...
        
        // Vérifier qu'on a assez de paragraphes
        if ($insert_after < $total_paragraphs) {
            $related_html = faster_render_single_related_post($post);
            $paragraphs[$insert_after - 1] .= '</p>' . $related_html;
        }
    }
    
    // Reconstruire le contenu
    $content = implode('</p>', $paragraphs);
    
    return $content;
}
add_filter('the_content', 'faster_insert_inline_related_posts', 25);
