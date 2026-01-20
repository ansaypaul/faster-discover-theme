<?php
/**
 * Category Menu - Identique au CategoryMenu.tsx de Next.js
 * Menu de catégories sous le header avec style active
 * Utilise le menu WordPress "secondary"
 */
?>

<nav class="bg-[#1a1a1a]">
    <div class="container mx-auto px-4">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'secondary',
            'container' => false,
            'menu_class' => 'flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2 m-0 p-0 list-none',
            'walker' => new Secondary_Menu_Walker(),
            'fallback_cb' => false,
        ));
        ?>
    </div>
</nav>
