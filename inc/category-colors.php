<?php
/**
 * Système de couleurs pour les catégories
 * Permet d'associer une couleur à chaque catégorie de la homepage
 */

/**
 * Palette de couleurs disponibles pour les badges de catégories
 */
function faster_get_category_colors() {
    return array(
        'bleu' => array('name' => 'Bleu', 'color' => 'rgb(59, 130, 246)'),
        'vert' => array('name' => 'Vert', 'color' => 'rgb(34, 197, 94)'),
        'rouge' => array('name' => 'Rouge', 'color' => 'rgb(239, 68, 68)'),
        'orange' => array('name' => 'Orange', 'color' => 'rgb(249, 115, 22)'),
        'violet' => array('name' => 'Violet', 'color' => 'rgb(168, 85, 247)'),
        'rose' => array('name' => 'Rose', 'color' => 'rgb(236, 72, 153)'),
        'jaune' => array('name' => 'Jaune', 'color' => 'rgb(234, 179, 8)'),
        'cyan' => array('name' => 'Cyan', 'color' => 'rgb(6, 182, 212)'),
        'indigo' => array('name' => 'Indigo', 'color' => 'rgb(99, 102, 241)'),
        'emeraude' => array('name' => 'Émeraude', 'color' => 'rgb(16, 185, 129)'),
    );
}

/**
 * Récupère la couleur d'une catégorie par son slug
 * @param string $category_slug Slug de la catégorie
 * @return string RGB color
 */
function faster_get_category_color($category_slug) {
    $categories = get_option('faster_homepage_categories', array());
    $colors = faster_get_category_colors();
    
    // Chercher la catégorie et sa couleur
    foreach ($categories as $cat) {
        if (isset($cat['slug']) && $cat['slug'] === $category_slug) {
            $color_key = isset($cat['color']) ? $cat['color'] : 'bleu';
            if (isset($colors[$color_key])) {
                return $colors[$color_key]['color'];
            }
        }
    }
    
    // Couleur par défaut (bleu)
    return $colors['bleu']['color'];
}
