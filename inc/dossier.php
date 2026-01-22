<?php
/**
 * Taxonomie "Dossier" (non publique)
 * Permet de regrouper des articles sur un même sujet fort (ex: Hytale)
 * 
 * Fonctionnalités :
 * - Taxonomie interne (non publique)
 * - Autosuggest basé sur titre/slug
 * - Limitation à 1 dossier par article
 * - Bloc "Dans le dossier..." pour articles liés
 */

// ========================================================
// 1. ENREGISTREMENT DE LA TAXONOMIE
// ========================================================

function wog_register_dossier_taxonomy() {
    $labels = array(
        'name'              => 'Dossiers',
        'singular_name'     => 'Dossier',
        'search_items'      => 'Rechercher un dossier',
        'all_items'         => 'Tous les dossiers',
        'edit_item'         => 'Modifier le dossier',
        'update_item'       => 'Mettre à jour',
        'add_new_item'      => 'Ajouter un nouveau dossier',
        'new_item_name'     => 'Nom du nouveau dossier',
        'menu_name'         => 'Dossiers',
    );

    $args = array(
        'labels'                => $labels,
        'public'                => false,              // Non public
        'publicly_queryable'    => false,              // Pas de query publique
        'show_ui'               => true,               // Visible dans l'admin
        'show_in_menu'          => true,
        'show_in_nav_menus'     => false,              // Pas dans les menus
        'show_tagcloud'         => false,              // Pas de tag cloud
        'show_in_quick_edit'    => true,
        'show_admin_column'     => true,               // Colonne dans la liste des posts
        'show_in_rest'          => true,               // Support Gutenberg
        'hierarchical'          => false,              // Comme les tags
        'rewrite'               => false,              // Pas d'URL
        'query_var'             => true,
        'meta_box_cb'           => 'wog_dossier_radio_metabox', // Metabox custom (radio)
    );

    register_taxonomy('dossier', array('post'), $args);
}
add_action('init', 'wog_register_dossier_taxonomy');

// ========================================================
// 2. INTERFACE ADMIN - METABOX CUSTOM AVEC RECHERCHE
// ========================================================

function wog_dossier_radio_metabox($post, $box) {
    $taxonomy = 'dossier';
    $terms = get_terms(array(
        'taxonomy' => $taxonomy,
        'hide_empty' => false,
        'orderby' => 'name',
        'order' => 'ASC'
    ));
    
    $current = wp_get_object_terms($post->ID, $taxonomy);
    $current_id = !empty($current) && !is_wp_error($current) ? $current[0]->term_id : 0;
    $current_name = !empty($current) && !is_wp_error($current) ? $current[0]->name : '';
    
    // Nonce pour sécurité
    wp_nonce_field('wog_save_dossier', 'wog_dossier_nonce');
    
    ?>
    <div class="wog-dossier-metabox">
        <div style="margin-bottom: 12px;">
            <label for="wog-dossier-search" style="display: block; margin-bottom: 5px; font-weight: 600;">
                Rechercher un dossier :
            </label>
            <input 
                type="text" 
                id="wog-dossier-search" 
                class="widefat" 
                placeholder="Tapez pour rechercher (ex: Hytale)..."
                autocomplete="off"
                style="padding: 6px 10px;"
            >
        </div>
        
        <div style="margin-bottom: 12px;">
            <strong>Dossier sélectionné :</strong>
            <div id="wog-current-dossier" style="padding: 8px; background: #f0f0f1; border-radius: 3px; margin-top: 5px;">
                <?php if ($current_id) : ?>
                    <span class="wog-dossier-badge" style="display: inline-block; padding: 4px 10px; background: #2271b1; color: white; border-radius: 3px; font-size: 13px;">
                        📁 <?php echo esc_html($current_name); ?>
                    </span>
                    <button type="button" id="wog-remove-dossier" style="margin-left: 8px; color: #b32d2e; text-decoration: none; border: none; background: none; cursor: pointer;">
                        ✕ Retirer
                    </button>
                <?php else : ?>
                    <em style="color: #646970;">Aucun dossier assigné</em>
                <?php endif; ?>
            </div>
        </div>
        
        <?php if (!empty($terms)) : ?>
        <div id="wog-dossier-list" style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; border-radius: 3px; padding: 8px;">
            <?php foreach ($terms as $term) : ?>
                <label 
                    class="wog-dossier-option" 
                    data-name="<?php echo esc_attr(strtolower($term->name)); ?>"
                    data-term-id="<?php echo esc_attr($term->term_id); ?>"
                    style="display: block; padding: 6px 8px; margin-bottom: 4px; cursor: pointer; border-radius: 3px; transition: background 0.2s;"
                    onmouseover="this.style.background='#f0f0f1'" 
                    onmouseout="this.style.background='transparent'"
                >
                    <input 
                        type="radio" 
                        name="wog_dossier" 
                        value="<?php echo esc_attr($term->term_id); ?>" 
                        <?php checked($current_id, $term->term_id); ?>
                        style="margin-right: 6px;"
                    >
                    <strong><?php echo esc_html($term->name); ?></strong>
                    <span style="color: #646970; font-size: 12px; margin-left: 4px;">
                        (<?php echo $term->count; ?> articles)
                    </span>
                </label>
            <?php endforeach; ?>
        </div>
        <?php else : ?>
            <p style="color: #d63638; padding: 10px; background: #fcf0f1; border-radius: 3px;">
                ⚠️ Aucun dossier disponible. 
                <a href="<?php echo admin_url('edit-tags.php?taxonomy=dossier&post_type=post'); ?>">Créer un dossier</a>
            </p>
        <?php endif; ?>
        
        <input type="hidden" name="wog_dossier_selected" id="wog-dossier-selected" value="<?php echo esc_attr($current_id); ?>">
    </div>
    
    <script>
    jQuery(document).ready(function($) {
        // Recherche en temps réel
        $('#wog-dossier-search').on('keyup', function() {
            var search = $(this).val().toLowerCase();
            $('.wog-dossier-option').each(function() {
                var name = $(this).data('name');
                if (name.indexOf(search) !== -1 || search === '') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
        
        // Sélection d'un dossier
        $('.wog-dossier-option input[type="radio"]').on('change', function() {
            var termId = $(this).val();
            var termName = $(this).closest('label').find('strong').text();
            $('#wog-dossier-selected').val(termId);
            $('#wog-current-dossier').html(
                '<span class="wog-dossier-badge" style="display: inline-block; padding: 4px 10px; background: #2271b1; color: white; border-radius: 3px; font-size: 13px;">📁 ' + 
                termName + 
                '</span><button type="button" id="wog-remove-dossier" style="margin-left: 8px; color: #b32d2e; text-decoration: none; border: none; background: none; cursor: pointer;">✕ Retirer</button>'
            );
        });
        
        // Retirer le dossier
        $(document).on('click', '#wog-remove-dossier', function() {
            $('input[name="wog_dossier"]').prop('checked', false);
            $('#wog-dossier-selected').val('0');
            $('#wog-current-dossier').html('<em style="color: #646970;">Aucun dossier assigné</em>');
        });
    });
    </script>
    
    <style>
    .wog-dossier-option input[type="radio"]:checked + strong {
        color: #2271b1;
    }
    </style>
    <?php
}

// Sauvegarder le dossier sélectionné
function wog_save_dossier_meta($post_id) {
    // Vérifications de sécurité
    if (!isset($_POST['wog_dossier_nonce']) || !wp_verify_nonce($_POST['wog_dossier_nonce'], 'wog_save_dossier')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Récupérer le dossier sélectionné
    $dossier_id = isset($_POST['wog_dossier_selected']) ? intval($_POST['wog_dossier_selected']) : 0;
    
    if ($dossier_id > 0) {
        // Assigner le dossier
        wp_set_object_terms($post_id, array($dossier_id), 'dossier');
    } else {
        // Retirer tous les dossiers
        wp_set_object_terms($post_id, array(), 'dossier');
    }
}
add_action('save_post', 'wog_save_dossier_meta');

// ========================================================
// 3. AUTOSUGGEST - DÉTECTION AUTOMATIQUE DANS TITRE/SLUG
// ========================================================
// 
// DÉSACTIVÉ pour l'instant - peut être réactivé plus tard si besoin
// L'assignation se fait maintenant uniquement manuellement via la metabox
//
// function wog_autosuggest_dossier($post_id, $post, $update) {
//     // Ne pas exécuter sur autosave, révisions, ou si ce n'est pas un post
//     if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id) || $post->post_type !== 'post') {
//         return;
//     }
//     
//     // Si l'article a déjà un dossier, ne rien faire
//     $current_dossier = wp_get_object_terms($post_id, 'dossier', array('fields' => 'ids'));
//     if (!empty($current_dossier)) {
//         return;
//     }
//     
//     // Récupérer tous les dossiers existants
//     $dossiers = get_terms(array(
//         'taxonomy' => 'dossier',
//         'hide_empty' => false,
//     ));
//     
//     if (empty($dossiers)) {
//         return;
//     }
//     
//     // Rechercher dans titre et slug
//     $post_title = strtolower($post->post_title);
//     $post_slug = strtolower($post->post_name);
//     
//     foreach ($dossiers as $dossier) {
//         $dossier_name = strtolower($dossier->name);
//         $dossier_slug = strtolower($dossier->slug);
//         
//         // Si le nom ou slug du dossier est présent dans le titre ou slug du post
//         if (
//             strpos($post_title, $dossier_name) !== false ||
//             strpos($post_slug, $dossier_slug) !== false ||
//             strpos($post_title, $dossier_slug) !== false ||
//             strpos($post_slug, $dossier_name) !== false
//         ) {
//             // Assigner automatiquement ce dossier
//             wp_set_object_terms($post_id, array($dossier->term_id), 'dossier');
//             break; // Ne garder que le premier match
//         }
//     }
// }
// add_action('save_post', 'wog_autosuggest_dossier', 20, 3);

// ========================================================
// 4. RÉCUPÉRER LES ARTICLES LIÉS D'UN DOSSIER
// ========================================================

/**
 * Récupère les articles du même dossier que le post donné
 * 
 * @param int $post_id ID du post courant
 * @param int $limit Nombre d'articles à récupérer (défaut: 4)
 * @return array Tableau de WP_Post objects
 */
function wog_get_dossier_related_posts($post_id, $limit = 4) {
    // Récupérer le dossier du post courant
    $dossier_terms = wp_get_object_terms($post_id, 'dossier');
    
    if (empty($dossier_terms) || is_wp_error($dossier_terms)) {
        return array();
    }
    
    $dossier = $dossier_terms[0];
    
    // Requête pour récupérer les autres articles du même dossier
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => $limit,
        'post__not_in'   => array($post_id),
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
        'tax_query'      => array(
            array(
                'taxonomy' => 'dossier',
                'field'    => 'term_id',
                'terms'    => $dossier->term_id,
            ),
        ),
    );
    
    $query = new WP_Query($args);
    return $query->posts;
}

// ========================================================
// 5. VÉRIFIER SI UN POST A UN DOSSIER
// ========================================================

/**
 * Vérifie si un post appartient à un dossier
 * 
 * @param int $post_id ID du post
 * @return bool|object False si pas de dossier, sinon le term object
 */
function wog_has_dossier($post_id) {
    $dossier_terms = wp_get_object_terms($post_id, 'dossier');
    
    if (empty($dossier_terms) || is_wp_error($dossier_terms)) {
        return false;
    }
    
    return $dossier_terms[0];
}

// ========================================================
// 6. INTERFACE TAXONOMIE - GESTION DES ARTICLES DU DOSSIER
// ========================================================

// Ajouter un champ custom sur la page d'édition du terme
function wog_dossier_edit_form_fields($term) {
    $term_id = $term->term_id;
    
    // Récupérer tous les articles de ce dossier
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'dossier',
                'field' => 'term_id',
                'terms' => $term_id,
            ),
        ),
        'orderby' => 'date',
        'order' => 'DESC',
    );
    $dossier_posts = get_posts($args);
    
    ?>
    <tr class="form-field">
        <th scope="row">
            <label>Articles de ce dossier</label>
        </th>
        <td>
            <!-- Liste des articles actuels -->
            <div id="wog-dossier-articles" style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">📁 Articles actuellement dans ce dossier (<?php echo count($dossier_posts); ?>)</h4>
                <?php if (!empty($dossier_posts)) : ?>
                    <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 3px; padding: 10px; background: #f9f9f9;">
                        <?php foreach ($dossier_posts as $post) : ?>
                            <div style="padding: 8px; margin-bottom: 5px; background: white; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong><?php echo esc_html($post->post_title); ?></strong>
                                    <br>
                                    <small style="color: #666;">
                                        <?php echo get_the_date('j F Y', $post); ?> · 
                                        <a href="<?php echo get_edit_post_link($post->ID); ?>" target="_blank">Éditer</a> · 
                                        <a href="<?php echo get_permalink($post->ID); ?>" target="_blank">Voir</a>
                                    </small>
                                </div>
                                <button 
                                    type="button" 
                                    class="wog-remove-from-dossier button-link-delete" 
                                    data-post-id="<?php echo $post->ID; ?>"
                                    style="color: #b32d2e; cursor: pointer;"
                                >
                                    Retirer
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else : ?>
                    <p style="color: #666; font-style: italic;">Aucun article dans ce dossier pour le moment.</p>
                <?php endif; ?>
            </div>
            
            <!-- Système d'ajout rapide -->
            <div style="margin-top: 30px; padding: 20px; background: #f0f0f1; border-radius: 5px;">
                <h4 style="margin-bottom: 15px;">➕ Ajouter rapidement des articles</h4>
                
                <div style="margin-bottom: 15px;">
                    <input 
                        type="text" 
                        id="wog-article-search" 
                        class="regular-text"
                        placeholder="Rechercher des articles par titre..."
                        style="width: 100%; padding: 8px;"
                    >
                </div>
                
                <div id="wog-search-results" style="display: none; max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 3px; padding: 10px; background: white;">
                    <!-- Les résultats de recherche apparaîtront ici -->
                </div>
                
                <button 
                    type="button" 
                    id="wog-add-selected" 
                    class="button button-primary"
                    style="margin-top: 10px; display: none;"
                >
                    Ajouter les articles sélectionnés
                </button>
                
                <div id="wog-add-message" style="margin-top: 10px;"></div>
            </div>
            
            <input type="hidden" id="wog-dossier-term-id" value="<?php echo esc_attr($term_id); ?>">
        </td>
    </tr>
    
    <script>
    jQuery(document).ready(function($) {
        var termId = $('#wog-dossier-term-id').val();
        var searchTimeout;
        
        // Recherche d'articles en temps réel
        $('#wog-article-search').on('keyup', function() {
            var search = $(this).val();
            
            clearTimeout(searchTimeout);
            
            if (search.length < 2) {
                $('#wog-search-results').hide();
                $('#wog-add-selected').hide();
                return;
            }
            
            searchTimeout = setTimeout(function() {
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'wog_search_articles',
                        search: search,
                        term_id: termId,
                        nonce: '<?php echo wp_create_nonce('wog_dossier_ajax'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            $('#wog-search-results').html(response.data.html).show();
                            $('#wog-add-selected').show();
                        }
                    }
                });
            }, 300);
        });
        
        // Ajouter les articles sélectionnés
        $('#wog-add-selected').on('click', function() {
            var selectedPosts = [];
            $('.wog-article-checkbox:checked').each(function() {
                selectedPosts.push($(this).val());
            });
            
            if (selectedPosts.length === 0) {
                alert('Veuillez sélectionner au moins un article.');
                return;
            }
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'wog_add_to_dossier',
                    post_ids: selectedPosts,
                    term_id: termId,
                    nonce: '<?php echo wp_create_nonce('wog_dossier_ajax'); ?>'
                },
                success: function(response) {
                    if (response.success) {
                        $('#wog-add-message').html('<div class="notice notice-success inline" style="padding: 10px; margin: 0;"><p>' + response.data.message + '</p></div>');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    }
                }
            });
        });
        
        // Retirer un article du dossier
        $(document).on('click', '.wog-remove-from-dossier', function() {
            if (!confirm('Retirer cet article du dossier ?')) {
                return;
            }
            
            var postId = $(this).data('post-id');
            var $button = $(this);
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'wog_remove_from_dossier',
                    post_id: postId,
                    nonce: '<?php echo wp_create_nonce('wog_dossier_ajax'); ?>'
                },
                success: function(response) {
                    if (response.success) {
                        $button.closest('div').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                }
            });
        });
    });
    </script>
    <?php
}
add_action('dossier_edit_form_fields', 'wog_dossier_edit_form_fields');

// AJAX : Rechercher des articles
function wog_ajax_search_articles() {
    check_ajax_referer('wog_dossier_ajax', 'nonce');
    
    $search = sanitize_text_field($_POST['search']);
    $term_id = intval($_POST['term_id']);
    
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 20,
        'post_status' => 'publish',
        's' => $search,
        'orderby' => 'relevance',
    );
    
    $posts = get_posts($args);
    
    if (empty($posts)) {
        wp_send_json_success(array(
            'html' => '<p style="padding: 10px; color: #666;">Aucun article trouvé.</p>'
        ));
    }
    
    $html = '';
    foreach ($posts as $post) {
        // Vérifier si l'article est déjà dans le dossier
        $current_dossier = wp_get_object_terms($post->ID, 'dossier', array('fields' => 'ids'));
        $is_in_dossier = in_array($term_id, $current_dossier);
        
        $disabled = $is_in_dossier ? 'disabled' : '';
        $label_style = $is_in_dossier ? 'opacity: 0.5;' : '';
        $badge = $is_in_dossier ? '<span style="color: #46b450; margin-left: 5px;">✓ Déjà ajouté</span>' : '';
        
        $html .= '<label style="display: block; padding: 8px; margin-bottom: 5px; cursor: pointer; border-radius: 3px; ' . $label_style . '" onmouseover="this.style.background=\'#f0f0f1\'" onmouseout="this.style.background=\'transparent\'">';
        $html .= '<input type="checkbox" class="wog-article-checkbox" value="' . $post->ID . '" ' . $disabled . ' style="margin-right: 8px;">';
        $html .= '<strong>' . esc_html($post->post_title) . '</strong>' . $badge;
        $html .= '<br><small style="color: #666; margin-left: 24px;">' . get_the_date('j F Y', $post) . '</small>';
        $html .= '</label>';
    }
    
    wp_send_json_success(array('html' => $html));
}
add_action('wp_ajax_wog_search_articles', 'wog_ajax_search_articles');

// AJAX : Ajouter des articles au dossier
function wog_ajax_add_to_dossier() {
    check_ajax_referer('wog_dossier_ajax', 'nonce');
    
    $post_ids = array_map('intval', $_POST['post_ids']);
    $term_id = intval($_POST['term_id']);
    
    $count = 0;
    foreach ($post_ids as $post_id) {
        wp_set_object_terms($post_id, array($term_id), 'dossier');
        $count++;
    }
    
    wp_send_json_success(array(
        'message' => $count . ' article(s) ajouté(s) avec succès !'
    ));
}
add_action('wp_ajax_wog_add_to_dossier', 'wog_ajax_add_to_dossier');

// AJAX : Retirer un article du dossier
function wog_ajax_remove_from_dossier() {
    check_ajax_referer('wog_dossier_ajax', 'nonce');
    
    $post_id = intval($_POST['post_id']);
    
    wp_set_object_terms($post_id, array(), 'dossier');
    
    wp_send_json_success();
}
add_action('wp_ajax_wog_remove_from_dossier', 'wog_ajax_remove_from_dossier');

// ========================================================
// 7. AFFICHER LE BLOC "DANS LE DOSSIER..."
// ========================================================

/**
 * Affiche le bloc d'articles liés du dossier
 * 
 * @param int $post_id ID du post courant
 * @param int $limit Nombre d'articles à afficher (défaut: 4)
 */
function wog_render_dossier_block($post_id, $limit = 4) {
    $dossier = wog_has_dossier($post_id);
    
    if (!$dossier) {
        return;
    }
    
    $related_posts = wog_get_dossier_related_posts($post_id, $limit);
    
    if (empty($related_posts)) {
        return;
    }
    
    ?>
    <div class="dossier-related-block mb-12">
        <div class="flex items-center gap-3 mb-6">
            <svg class="w-6 h-6 text-gaming-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            <h2 class="text-2xl font-bold text-white">
                Dans le dossier <span class="text-gaming-accent"><?php echo esc_html($dossier->name); ?></span>
            </h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <?php foreach ($related_posts as $related_post) : 
                setup_postdata($related_post);
            ?>
                <a 
                    href="<?php echo get_permalink($related_post); ?>"
                    class="group block bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors"
                >
                    <?php if (has_post_thumbnail($related_post)) : ?>
                        <div class="relative aspect-video overflow-hidden">
                            <?php echo get_the_post_thumbnail($related_post, 'faster-news', array(
                                'class' => 'object-cover w-full h-full group-hover:scale-105 transition-transform duration-300',
                                'loading' => 'lazy'
                            )); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="p-4">
                        <h3 class="text-white text-sm font-semibold line-clamp-2 group-hover:text-gaming-accent transition-colors">
                            <?php echo get_the_title($related_post); ?>
                        </h3>
                        <div class="flex items-center text-xs text-gray-500 mt-2">
                            <time datetime="<?php echo get_the_date('c', $related_post); ?>">
                                <?php echo get_the_date('j F Y', $related_post); ?>
                            </time>
                        </div>
                    </div>
                </a>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>
    </div>
    <?php
}
