<?php
/**
 * Champs personnalisés pour les auteurs
 * Job title + Réseaux sociaux
 */

// Ajouter les champs dans le profil utilisateur
function faster_add_author_custom_fields($user) {
    ?>
    <h2>Informations Publiques (Affichées sur la page auteur)</h2>
    
    <table class="form-table">
        <tr>
            <th><label for="author_job_title">Fonction / Titre</label></th>
            <td>
                <input type="text" 
                       name="author_job_title" 
                       id="author_job_title" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_job_title', true)); ?>" 
                       class="regular-text"
                       placeholder="Ex: Rédacteur en chef, Journaliste gaming, Expert tech..."
                />
                <p class="description">Votre fonction/titre affiché sous votre nom sur la page auteur</p>
            </td>
        </tr>
    </table>

    <h3>Réseaux Sociaux</h3>
    <table class="form-table">
        <tr>
            <th><label for="author_twitter">Twitter / X</label></th>
            <td>
                <input type="url" 
                       name="author_twitter" 
                       id="author_twitter" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_twitter', true)); ?>" 
                       class="regular-text"
                       placeholder="https://twitter.com/votre_compte"
                />
            </td>
        </tr>
        
        <tr>
            <th><label for="author_instagram">Instagram</label></th>
            <td>
                <input type="url" 
                       name="author_instagram" 
                       id="author_instagram" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_instagram', true)); ?>" 
                       class="regular-text"
                       placeholder="https://instagram.com/votre_compte"
                />
            </td>
        </tr>
        
        <tr>
            <th><label for="author_linkedin">LinkedIn</label></th>
            <td>
                <input type="url" 
                       name="author_linkedin" 
                       id="author_linkedin" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_linkedin', true)); ?>" 
                       class="regular-text"
                       placeholder="https://linkedin.com/in/votre_profil"
                />
            </td>
        </tr>
        
        <tr>
            <th><label for="author_youtube">YouTube</label></th>
            <td>
                <input type="url" 
                       name="author_youtube" 
                       id="author_youtube" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_youtube', true)); ?>" 
                       class="regular-text"
                       placeholder="https://youtube.com/@votre_chaine"
                />
            </td>
        </tr>
        
        <tr>
            <th><label for="author_facebook">Facebook</label></th>
            <td>
                <input type="url" 
                       name="author_facebook" 
                       id="author_facebook" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_facebook', true)); ?>" 
                       class="regular-text"
                       placeholder="https://facebook.com/votre_page"
                />
            </td>
        </tr>
        
        <tr>
            <th><label for="author_twitch">Twitch</label></th>
            <td>
                <input type="url" 
                       name="author_twitch" 
                       id="author_twitch" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'author_twitch', true)); ?>" 
                       class="regular-text"
                       placeholder="https://twitch.tv/votre_chaine"
                />
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'faster_add_author_custom_fields');
add_action('edit_user_profile', 'faster_add_author_custom_fields');

// Sauvegarder les champs
function faster_save_author_custom_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    // Job Title
    if (isset($_POST['author_job_title'])) {
        update_user_meta($user_id, 'author_job_title', sanitize_text_field($_POST['author_job_title']));
    }
    
    // Réseaux sociaux
    $social_fields = array(
        'author_twitter',
        'author_instagram',
        'author_linkedin',
        'author_youtube',
        'author_facebook',
        'author_twitch'
    );
    
    foreach ($social_fields as $field) {
        if (isset($_POST[$field])) {
            update_user_meta($user_id, $field, esc_url_raw($_POST[$field]));
        }
    }
}
add_action('personal_options_update', 'faster_save_author_custom_fields');
add_action('edit_user_profile_update', 'faster_save_author_custom_fields');

// Fonction helper pour récupérer les infos auteur
function faster_get_author_info($author_id) {
    return array(
        'job_title' => get_user_meta($author_id, 'author_job_title', true),
        'socials' => array(
            'twitter' => get_user_meta($author_id, 'author_twitter', true),
            'instagram' => get_user_meta($author_id, 'author_instagram', true),
            'linkedin' => get_user_meta($author_id, 'author_linkedin', true),
            'youtube' => get_user_meta($author_id, 'author_youtube', true),
            'facebook' => get_user_meta($author_id, 'author_facebook', true),
            'twitch' => get_user_meta($author_id, 'author_twitch', true),
        )
    );
}

// Fonction helper pour afficher les icônes SVG
function faster_get_social_icon($network) {
    $icons = array(
        'twitter' => '<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>',
        'instagram' => '<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>',
        'linkedin' => '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        'youtube' => '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
        'facebook' => '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
        'twitch' => '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>',
    );
    
    return isset($icons[$network]) ? $icons[$network] : '';
}
