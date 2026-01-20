<?php
/**
 * Custom Walker pour le menu secondaire
 * Ajoute les classes Tailwind directement
 */

class Secondary_Menu_Walker extends Walker_Nav_Menu {
    
    function start_lvl(&$output, $depth = 0, $args = null) {
        // Pas de sous-menus pour le menu catégorie
    }
    
    function end_lvl(&$output, $depth = 0, $args = null) {
        // Pas de sous-menus
    }
    
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = 'whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors';
        
        // État actif
        if (in_array('current-menu-item', $item->classes) || 
            in_array('current_page_item', $item->classes) ||
            in_array('current-cat', $item->classes)) {
            $classes .= ' bg-gaming-accent text-gaming-dark';
        } else {
            $classes .= ' text-gray-300 hover:text-white';
        }
        
        $output .= '<li class="inline-block">';
        $output .= '<a href="' . esc_url($item->url) . '" class="' . $classes . '">';
        $output .= esc_html($item->title);
        $output .= '</a>';
    }
    
    function end_el(&$output, $item, $depth = 0, $args = null) {
        $output .= '</li>';
    }
}
