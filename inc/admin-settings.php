<?php
/**
 * Admin Settings Page - Configuration du thème
 * Permet de configurer les catégories principales de la homepage
 */

// Ajouter la page de configuration dans le menu admin
function faster_add_admin_menu() {
    add_theme_page(
        'Configuration du Thème',
        'Config Thème',
        'manage_options',
        'faster-settings',
        'faster_settings_page'
    );
}
add_action('admin_menu', 'faster_add_admin_menu');

// Enqueue jQuery UI Sortable pour la page de configuration
function faster_admin_enqueue_scripts($hook) {
    // Charger seulement sur notre page de configuration
    if ('appearance_page_faster-settings' !== $hook) {
        return;
    }
    
    // Enqueue jQuery UI Sortable
    wp_enqueue_script('jquery-ui-sortable');
}
add_action('admin_enqueue_scripts', 'faster_admin_enqueue_scripts');

// Enregistrer les paramètres
function faster_settings_init() {
    // Homepage categories (données JSON from hidden input)
    register_setting('faster_settings_group', 'faster_homepage_categories_data', 'faster_sanitize_categories_data');
    
    // Social networks
    register_setting('faster_settings_group', 'faster_social_facebook');
    register_setting('faster_settings_group', 'faster_social_twitter');
    register_setting('faster_settings_group', 'faster_social_youtube');
    register_setting('faster_settings_group', 'faster_social_instagram');
    register_setting('faster_settings_group', 'faster_social_discord');
    
    // Brevo Newsletter
    register_setting('faster_settings_group', 'faster_brevo_api_key');
    register_setting('faster_settings_group', 'faster_brevo_list_id');
    
    // Section Homepage
    add_settings_section(
        'faster_homepage_section',
        'Configuration de la Homepage',
        'faster_homepage_section_callback',
        'faster-settings'
    );
    
    add_settings_field(
        'faster_homepage_categories_field',
        'Catégories Principales',
        'faster_homepage_categories_callback',
        'faster-settings',
        'faster_homepage_section'
    );
    
    // Section Réseaux Sociaux
    add_settings_section(
        'faster_social_section',
        'Réseaux Sociaux',
        'faster_social_section_callback',
        'faster-settings'
    );
    
    add_settings_field('faster_social_facebook_field', 'Facebook', 'faster_social_facebook_callback', 'faster-settings', 'faster_social_section');
    add_settings_field('faster_social_twitter_field', 'Twitter / X', 'faster_social_twitter_callback', 'faster-settings', 'faster_social_section');
    add_settings_field('faster_social_youtube_field', 'YouTube', 'faster_social_youtube_callback', 'faster-settings', 'faster_social_section');
    add_settings_field('faster_social_instagram_field', 'Instagram', 'faster_social_instagram_callback', 'faster-settings', 'faster_social_section');
    add_settings_field('faster_social_discord_field', 'Discord', 'faster_social_discord_callback', 'faster-settings', 'faster_social_section');
    
    // Section Brevo Newsletter
    add_settings_section(
        'faster_brevo_section',
        'Newsletter (Brevo/Sendinblue)',
        'faster_brevo_section_callback',
        'faster-settings'
    );
    
    add_settings_field('faster_brevo_api_key_field', 'Clé API Brevo', 'faster_brevo_api_key_callback', 'faster-settings', 'faster_brevo_section');
    add_settings_field('faster_brevo_list_id_field', 'ID de la liste', 'faster_brevo_list_id_callback', 'faster-settings', 'faster_brevo_section');
}
add_action('admin_init', 'faster_settings_init');

// Sanitize et save categories data
function faster_sanitize_categories_data($input) {
    // Décoder le JSON
    $categories = json_decode(stripslashes($input), true);
    
    if (!is_array($categories)) {
        return get_option('faster_homepage_categories', array());
    }
    
    // Valider et sauvegarder
    $validated = array();
    foreach ($categories as $cat) {
        if (isset($cat['slug']) && isset($cat['layout'])) {
            // Vérifier que la catégorie existe
            if (get_category_by_slug($cat['slug'])) {
                // Valider le layout
                $layout = in_array($cat['layout'], ['platform', 'thematic']) ? $cat['layout'] : 'thematic';
                
                // Valider le nombre d'articles (entre 1 et 20, défaut 8)
                $posts_count = isset($cat['posts_count']) ? intval($cat['posts_count']) : 8;
                $posts_count = max(1, min(20, $posts_count));
                
                $validated[] = array(
                    'slug' => sanitize_text_field($cat['slug']),
                    'layout' => $layout,
                    'posts_count' => $posts_count
                );
            }
        }
    }
    
    // Sauvegarder dans faster_homepage_categories
    update_option('faster_homepage_categories', $validated);
    
    // Ne rien retourner car on ne veut pas sauvegarder faster_homepage_categories_data
    return '';
}

// Description de la section Homepage
function faster_homepage_section_callback() {
    echo '<p>Sélectionnez les catégories à afficher sur la homepage (dans l\'ordre d\'affichage).</p>';
}

// Description de la section Réseaux Sociaux
function faster_social_section_callback() {
    echo '<p>Configurez vos URLs de réseaux sociaux. Laissez vide pour ne pas afficher.</p>';
}

// Callbacks pour chaque réseau social
function faster_social_facebook_callback() {
    $value = get_option('faster_social_facebook', 'https://facebook.com/worldofgeeks');
    echo '<input type="url" name="faster_social_facebook" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://facebook.com/votre-page">';
}

function faster_social_twitter_callback() {
    $value = get_option('faster_social_twitter', 'https://twitter.com/worldofgeeks');
    echo '<input type="url" name="faster_social_twitter" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://twitter.com/votre-compte">';
}

function faster_social_youtube_callback() {
    $value = get_option('faster_social_youtube', 'https://youtube.com/@worldofgeeks');
    echo '<input type="url" name="faster_social_youtube" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://youtube.com/@votre-chaine">';
}

function faster_social_instagram_callback() {
    $value = get_option('faster_social_instagram', 'https://instagram.com/worldofgeeks');
    echo '<input type="url" name="faster_social_instagram" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://instagram.com/votre-compte">';
}

function faster_social_discord_callback() {
    $value = get_option('faster_social_discord', '');
    echo '<input type="url" name="faster_social_discord" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://discord.gg/votre-serveur">';
}

// Description de la section Brevo
function faster_brevo_section_callback() {
    echo '<p>Configurez votre intégration Brevo (Sendinblue) pour le formulaire de newsletter.</p>';
    echo '<p><strong>Note :</strong> Obtenez votre clé API dans votre compte Brevo > Paramètres > Clés API</p>';
}

// Callbacks pour Brevo
function faster_brevo_api_key_callback() {
    $value = get_option('faster_brevo_api_key', '');
    echo '<input type="text" name="faster_brevo_api_key" value="' . esc_attr($value) . '" class="large-text code" placeholder="xkeysib-...">';
    echo '<p class="description">Votre clé API Brevo (commence par xkeysib-...)</p>';
}

function faster_brevo_list_id_callback() {
    $value = get_option('faster_brevo_list_id', 2);
    echo '<input type="number" name="faster_brevo_list_id" value="' . esc_attr($value) . '" class="small-text" min="1">';
    echo '<p class="description">L\'ID de votre liste de contacts Brevo</p>';
}

// Champ de sélection des catégories
function faster_homepage_categories_callback() {
    $selected_categories = get_option('faster_homepage_categories', array());
    $all_categories = get_categories(array(
        'hide_empty' => false,
        'orderby' => 'name',
        'order' => 'ASC'
    ));
    
    // Normaliser les anciennes données (si c'est un simple tableau de slugs)
    $normalized_categories = array();
    if (!empty($selected_categories)) {
        foreach ($selected_categories as $item) {
            if (is_string($item)) {
                // Ancien format : juste un slug
                $normalized_categories[$item] = 'thematic';
            } elseif (is_array($item) && isset($item['slug'])) {
                // Nouveau format : ['slug' => 'xxx', 'layout' => 'xxx']
                $normalized_categories[$item['slug']] = $item['layout'] ?? 'thematic';
            }
        }
    }
    
    echo '<div class="faster-categories-wrapper">';
    echo '<p class="description">Cochez les catégories à afficher sur la homepage. Utilisez le drag & drop pour les réordonner. Choisissez le layout et le nombre d\'articles pour chaque section.</p>';
    echo '<ul id="faster-categories-list" class="faster-sortable-list">';
    
    // Afficher d'abord les catégories sélectionnées (dans l'ordre)
    if (!empty($normalized_categories)) {
        foreach ($normalized_categories as $cat_slug => $layout) {
            $category = get_category_by_slug($cat_slug);
            if ($category) {
                echo '<li class="faster-category-item" data-slug="' . esc_attr($category->slug) . '">';
                echo '<span class="dashicons dashicons-menu handle"></span>';
                echo '<label class="category-label">';
                echo '<input type="checkbox" class="category-checkbox" data-slug="' . esc_attr($category->slug) . '" checked>';
                echo '<strong>' . esc_html($category->name) . '</strong>';
                echo '<span class="category-slug">(' . esc_html($category->slug) . ')</span>';
                echo '</label>';
                echo '<select class="category-layout" data-slug="' . esc_attr($category->slug) . '">';
                echo '<option value="thematic"' . selected($layout, 'thematic', false) . '>Grille (Thematic)</option>';
                echo '<option value="platform"' . selected($layout, 'platform', false) . '>Scroll Mobile (Platform)</option>';
                echo '</select>';
                $posts_count = is_array($item) && isset($item['posts_count']) ? $item['posts_count'] : 8;
                echo '<input type="number" class="category-posts-count" data-slug="' . esc_attr($category->slug) . '" value="' . esc_attr($posts_count) . '" min="1" max="20" placeholder="8">';
                echo '</li>';
            }
        }
    }
    
    // Afficher les catégories non sélectionnées
    foreach ($all_categories as $category) {
        if (!isset($normalized_categories[$category->slug])) {
            echo '<li class="faster-category-item" data-slug="' . esc_attr($category->slug) . '">';
            echo '<span class="dashicons dashicons-menu handle"></span>';
            echo '<label class="category-label">';
            echo '<input type="checkbox" class="category-checkbox" data-slug="' . esc_attr($category->slug) . '">';
            echo '<strong>' . esc_html($category->name) . '</strong>';
            echo '<span class="category-slug">(' . esc_html($category->slug) . ')</span>';
            echo '</label>';
            echo '<select class="category-layout" data-slug="' . esc_attr($category->slug) . '" disabled>';
            echo '<option value="thematic" selected>Grille (Thematic)</option>';
            echo '<option value="platform">Scroll Mobile (Platform)</option>';
            echo '</select>';
            echo '<input type="number" class="category-posts-count" data-slug="' . esc_attr($category->slug) . '" value="8" min="1" max="20" placeholder="8" disabled>';
            echo '</li>';
        }
    }
    
    echo '</ul>';
    
    // Hidden input pour stocker les données au format JSON
    echo '<input type="hidden" id="faster_categories_data" name="faster_homepage_categories_data" value="">';
    
    echo '</div>';
    
    // CSS pour la page d'admin
    ?>
    <style>
        .faster-categories-wrapper {
            max-width: 800px;
            margin-top: 10px;
        }
        .faster-sortable-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
            border: 1px solid #ddd;
            background: #fff;
        }
        .faster-category-item {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            cursor: move;
            display: flex;
            align-items: center;
            gap: 15px;
            background: #fff;
            transition: background 0.2s;
        }
        .faster-category-item:hover {
            background: #f9f9f9;
        }
        .faster-category-item:last-child {
            border-bottom: none;
        }
        .faster-category-item .handle {
            margin-right: 10px;
            color: #999;
            cursor: move;
        }
        .faster-category-item .category-label {
            display: flex;
            align-items: center;
            margin: 0;
            cursor: pointer;
            flex: 1;
        }
        .faster-category-item input[type="checkbox"] {
            margin: 0 10px 0 0;
        }
        .faster-category-item .category-slug {
            margin-left: 8px;
            color: #666;
            font-size: 12px;
        }
        .faster-category-item .category-layout {
            padding: 5px 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #fff;
            font-size: 13px;
            min-width: 180px;
        }
        .faster-category-item .category-layout:disabled {
            background: #f5f5f5;
            color: #999;
            cursor: not-allowed;
        }
        .faster-category-item .category-posts-count {
            padding: 5px 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #fff;
            font-size: 13px;
            width: 70px;
            text-align: center;
        }
        .faster-category-item .category-posts-count:disabled {
            background: #f5f5f5;
            color: #999;
            cursor: not-allowed;
        }
        .faster-category-item.ui-sortable-helper {
            background: #f0f0f1;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    </style>
    
    <script>
    jQuery(document).ready(function($) {
        // Rendre la liste triable avec jQuery UI
        $('#faster-categories-list').sortable({
            handle: '.handle',
            placeholder: 'ui-state-highlight',
            axis: 'y',
            opacity: 0.8,
            cursor: 'move'
        });
        
        // Activer/désactiver le select de layout et le nombre d'articles quand on coche/décoche
        $('.category-checkbox').on('change', function() {
            const $item = $(this).closest('.faster-category-item');
            const $select = $item.find('.category-layout');
            const $postsCount = $item.find('.category-posts-count');
            
            if ($(this).is(':checked')) {
                $select.prop('disabled', false);
                $postsCount.prop('disabled', false);
            } else {
                $select.prop('disabled', true);
                $postsCount.prop('disabled', true);
            }
        });
        
        // Avant la soumission du formulaire, construire les données JSON
        $('form').on('submit', function(e) {
            const categories = [];
            
            // Parcourir tous les items dans l'ordre
            $('#faster-categories-list .faster-category-item').each(function() {
                const $item = $(this);
                const $checkbox = $item.find('.category-checkbox');
                
                // Si la catégorie est cochée
                if ($checkbox.is(':checked')) {
                    const slug = $checkbox.data('slug');
                    const layout = $item.find('.category-layout').val();
                    const postsCount = parseInt($item.find('.category-posts-count').val()) || 8;
                    
                    categories.push({
                        slug: slug,
                        layout: layout,
                        posts_count: postsCount
                    });
                }
            });
            
            // Stocker dans le hidden input
            $('#faster_categories_data').val(JSON.stringify(categories));
        });
    });
    </script>
    <?php
}

// Page de configuration
function faster_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Message de sauvegarde
    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'faster_messages',
            'faster_message',
            'Configuration enregistrée avec succès !',
            'updated'
        );
    }
    
    settings_errors('faster_messages');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <form action="options.php" method="post">
            <?php
            settings_fields('faster_settings_group');
            do_settings_sections('faster-settings');
            submit_button('Enregistrer la configuration');
            ?>
        </form>
        
        <div class="card" style="max-width: 600px; margin-top: 20px;">
            <h2>💡 Comment ça marche ?</h2>
            <ul>
                <li><strong>Cochez</strong> les catégories que vous voulez afficher sur la homepage</li>
                <li><strong>Glissez-déposez</strong> les catégories pour changer l'ordre d'affichage</li>
                <li>Les catégories apparaîtront dans l'ordre de la liste</li>
                <li>Chaque catégorie affichera jusqu'à <strong>8 articles</strong> en grille 4×2</li>
            </ul>
        </div>
    </div>
    <?php
}

// Fonction helper pour récupérer les catégories configurées
function faster_get_homepage_categories() {
    $selected_categories = get_option('faster_homepage_categories', array());
    
    // Valeurs par défaut si aucune catégorie n'est sélectionnée
    if (empty($selected_categories)) {
        return array(
            array('slug' => 'news', 'title' => 'News', 'layout' => 'thematic', 'posts_count' => 8),
            array('slug' => 'jeux-video', 'title' => 'Jeux Vidéo', 'layout' => 'platform', 'posts_count' => 8),
            array('slug' => 'mangas', 'title' => 'Mangas', 'layout' => 'thematic', 'posts_count' => 8),
            array('slug' => 'esport', 'title' => 'Esport', 'layout' => 'thematic', 'posts_count' => 8),
            array('slug' => 'high-tech', 'title' => 'High-Tech', 'layout' => 'thematic', 'posts_count' => 8),
        );
    }
    
    $categories = array();
    foreach ($selected_categories as $item) {
        // Support ancien format (juste un slug) et nouveau format (array avec slug + layout + posts_count)
        if (is_string($item)) {
            $slug = $item;
            $layout = 'thematic';
            $posts_count = 8;
        } elseif (is_array($item)) {
            $slug = $item['slug'] ?? '';
            $layout = $item['layout'] ?? 'thematic';
            $posts_count = $item['posts_count'] ?? 8;
        } else {
            continue;
        }
        
        $category = get_category_by_slug($slug);
        if ($category) {
            $categories[] = array(
                'slug' => $category->slug,
                'title' => $category->name,
                'layout' => $layout,
                'posts_count' => intval($posts_count)
            );
        }
    }
    
    return $categories;
}
