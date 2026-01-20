<?php
/**
 * Brevo (Sendinblue) Newsletter Integration
 * Gère l'inscription à la newsletter via l'API Brevo
 */

// Configuration Brevo (à configurer dans Apparence > Config Thème)
define('BREVO_API_KEY', get_option('faster_brevo_api_key', ''));
define('BREVO_LIST_ID', get_option('faster_brevo_list_id', 2));

// Endpoint AJAX pour l'inscription
add_action('wp_ajax_brevo_subscribe', 'faster_brevo_subscribe');
add_action('wp_ajax_nopriv_brevo_subscribe', 'faster_brevo_subscribe');

function faster_brevo_subscribe() {
    // Vérification du nonce pour la sécurité
    check_ajax_referer('brevo_subscribe_nonce', 'nonce');
    
    // Récupération et validation de l'email
    $email = sanitize_email($_POST['email']);
    
    if (!is_email($email)) {
        wp_send_json_error(array(
            'message' => 'Adresse email invalide.'
        ));
    }
    
    // Appel à l'API Brevo
    $response = wp_remote_post('https://api.brevo.com/v3/contacts', array(
        'headers' => array(
            'api-key' => BREVO_API_KEY,
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode(array(
            'email' => $email,
            'listIds' => array(BREVO_LIST_ID),
            'updateEnabled' => true,
        )),
        'timeout' => 30,
    ));
    
    // Gestion des erreurs
    if (is_wp_error($response)) {
        wp_send_json_error(array(
            'message' => 'Erreur de connexion. Veuillez réessayer.'
        ));
    }
    
    $status_code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    // Succès (201 = créé, 204 = mis à jour)
    if ($status_code === 201 || $status_code === 204) {
        wp_send_json_success(array(
            'message' => '🎉 Merci ! Vous êtes maintenant abonné(e) à notre newsletter !'
        ));
    }
    
    // Email déjà inscrit
    if ($status_code === 400 && isset($body['code']) && $body['code'] === 'duplicate_parameter') {
        wp_send_json_success(array(
            'message' => '✅ Vous êtes déjà abonné(e) à notre newsletter !'
        ));
    }
    
    // Autre erreur
    wp_send_json_error(array(
        'message' => 'Une erreur est survenue. Veuillez réessayer.'
    ));
}

// Fonction pour récupérer les données Brevo (appelée depuis functions.php)
function faster_get_brevo_localize_data() {
    return array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('brevo_subscribe_nonce'),
    );
}
