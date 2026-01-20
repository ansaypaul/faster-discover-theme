# Instructions pour Créer un Thème WordPress Ultra-Performant "Discover"

## Objectif Principal
Créer un thème WordPress minimaliste avec des performances exceptionnelles (PageSpeed 92+). Le thème doit être **propre, rapide et maintenable** en utilisant Tailwind CSS optimisé.

---

## Structure de Fichiers Obligatoire

```
discover/
├── style.css (header du thème uniquement)
├── functions.php
├── index.php
├── header.php
├── footer.php
├── single.php
├── page.php
├── archive.php
├── 404.php
├── screenshot.png (1200x900px)
├── tailwind.config.js
├── package.json
├── assets/
│   ├── css/
│   │   ├── src/
│   │   │   └── input.css (source Tailwind)
│   │   └── main.css (compilé et minifié)
│   ├── js/
│   │   └── main.js
│   └── images/
└── template-parts/
    └── content.php
```

---

## Setup Tailwind CSS (Mode Production Optimisé)

### 1. Installation
```bash
npm init -y
npm install -D tailwindcss
npx tailwindcss init
```

### 2. Configuration tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.php",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 3. Fichier assets/css/src/input.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Ajoutez ici vos customs CSS si nécessaire */
```

### 4. Script de Build dans package.json
```json
{
  "scripts": {
    "dev": "tailwindcss -i ./assets/css/src/input.css -o ./assets/css/main.css --watch",
    "build": "tailwindcss -i ./assets/css/src/input.css -o ./assets/css/main.css --minify"
  }
}
```

### 5. Commandes
- **Développement** : `npm run dev`
- **Production** : `npm run build` (génère CSS minifié avec UNIQUEMENT les classes utilisées)

---

## Règles CRITIQUES pour les Performances

### 1. JavaScript
- **INTERDIT** : jQuery, bibliothèques lourdes
- **OBLIGATOIRE** : Vanilla JavaScript uniquement
- Charger avec `defer` ou `async`
- Minifier en production
- Maximum 1-2 fichiers JS total

### 2. CSS / Tailwind
- **OBLIGATOIRE** : Build de production avec `--minify`
- Utiliser UNIQUEMENT les classes nécessaires (pas de classes inutiles dans le HTML)
- Résultat attendu : 10-25KB de CSS final
- Pas de CDN Tailwind complet (trop lourd)
- Mobile-first (défaut Tailwind)
- Purge automatique des classes non utilisées

### 3. Images
- Format WebP avec fallback automatique
- Lazy loading natif : `loading="lazy"` sur toutes les images
- Responsive images avec `srcset`
- Pas d'images non utilisées dans le thème
- Optimiser toutes les images avant upload (TinyPNG, Squoosh)

### 4. Optimisations WordPress dans functions.php

**DÉSACTIVER obligatoirement :**
```php
// Emojis
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

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

// REST API si non nécessaire
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');

// WLW Manifest
remove_action('wp_head', 'wlwmanifest_link');

// RSD Link
remove_action('wp_head', 'rsd_link');
```

### 5. Enqueue des Assets

**OBLIGATOIRE** :
- Enqueue conditionnel (charger uniquement sur les pages nécessaires)
- Versioning avec filemtime() pour cache-busting
- Déférer tous les scripts non-critiques
- Pas de dépendances externes inutiles

**Exemple de code pour functions.php :**
```php
function discover_enqueue_assets() {
    // CSS Tailwind compilé
    wp_enqueue_style(
        'discover-main', 
        get_template_directory_uri() . '/assets/css/main.css',
        array(),
        filemtime(get_template_directory() . '/assets/css/main.css')
    );
    
    // JS avec defer
    wp_enqueue_script(
        'discover-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        filemtime(get_template_directory() . '/assets/js/main.js'),
        true // in footer
    );
}
add_action('wp_enqueue_scripts', 'discover_enqueue_assets');

// Ajouter attribut defer aux scripts
function discover_defer_scripts($tag, $handle) {
    if ('discover-main' === $handle) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'discover_defer_scripts', 10, 2);
```

### 6. HTML Sémantique avec Tailwind
- Utiliser HTML5 sémantique : `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`
- Pas de divs inutiles
- Classes Tailwind descriptives et cohérentes
- Accessibilité : attributs `alt`, `aria-label` où nécessaire
- Exemple : `<article class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">`

### 7. Database Queries
- **INTERDIT** : Queries non optimisées, boucles dans boucles
- Utiliser `WP_Query` avec pagination
- Limiter le nombre de posts affichés
- Utiliser `no_found_rows => true` si pas de pagination nécessaire
- Cache les résultats répétitifs avec `wp_cache_set()` / `wp_cache_get()`

### 8. Fonts
- **RECOMMANDÉ** : Fonts système (déjà dans config Tailwind)
- Si Google Fonts nécessaire : 
  - Preconnect : `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - `display=swap` obligatoire
  - Maximum 2 variantes de font (ex: Regular 400 + Bold 700)
  - Subset des caractères si possible

---

## Fichiers Clés - Spécifications Détaillées

### style.css
```css
/*
Theme Name: Discover
Theme URI: https://example.com
Author: Your Name
Author URI: https://example.com
Description: Un thème WordPress ultra-rapide avec Tailwind CSS
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: discover
Tags: minimal, fast, performance, tailwind
*/

/* Tout le CSS est dans assets/css/main.css */
```

### functions.php
**Doit contenir dans cet ordre :**

1. **Theme Setup**
```php
function discover_setup() {
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
        'primary' => __('Primary Menu', 'discover'),
        'footer' => __('Footer Menu', 'discover'),
    ));
    
    // Image sizes
    add_image_size('discover-featured', 1200, 630, true);
}
add_action('after_setup_theme', 'discover_setup');
```

2. **Désactivation features WP** (voir section 4 ci-dessus)

3. **Enqueue assets** (voir section 5 ci-dessus)

4. **Helpers et utilities** (fonctions custom si nécessaire)

**Ne doit PAS contenir :**
- Logique métier complexe
- Queries DB directes sans raison
- Code obsolète ou commenté
- Fonctions dépréciées

### header.php
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex justify-between items-center py-4">
            <!-- Logo / Site title -->
            <div class="text-2xl font-bold">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="text-gray-900 hover:text-primary">
                    <?php bloginfo('name'); ?>
                </a>
            </div>
            
            <!-- Navigation -->
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'flex space-x-6',
                'fallback_cb' => false,
            ));
            ?>
        </nav>
    </div>
</header>

<main class="min-h-screen">
```

### footer.php
```php
</main>

<footer class="bg-gray-900 text-white mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
            <p class="text-gray-400">
                &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>
            </p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
```

### index.php
```php
<?php get_header(); ?>

<div class="max-w-4xl mx-auto px-4 py-8">
    <?php if (have_posts()) : ?>
        <div class="space-y-8">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-lg shadow-sm p-6'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="mb-4">
                            <?php the_post_thumbnail('discover-featured', array('class' => 'w-full h-auto rounded-lg', 'loading' => 'lazy')); ?>
                        </div>
                    <?php endif; ?>
                    
                    <h2 class="text-3xl font-bold mb-2">
                        <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-primary">
                            <?php the_title(); ?>
                        </a>
                    </h2>
                    
                    <div class="text-gray-600 mb-4">
                        <?php echo get_the_date(); ?>
                    </div>
                    
                    <div class="prose max-w-none">
                        <?php the_excerpt(); ?>
                    </div>
                    
                    <a href="<?php the_permalink(); ?>" class="inline-block mt-4 text-primary hover:underline">
                        <?php _e('Read more', 'discover'); ?> &rarr;
                    </a>
                </article>
            <?php endwhile; ?>
        </div>
        
        <?php
        // Pagination
        the_posts_pagination(array(
            'mid_size' => 2,
            'prev_text' => __('&larr; Previous', 'discover'),
            'next_text' => __('Next &rarr;', 'discover'),
            'class' => 'flex justify-center space-x-2 mt-8',
        ));
        ?>
    <?php else : ?>
        <div class="text-center py-12">
            <p class="text-gray-600"><?php _e('No posts found.', 'discover'); ?></p>
        </div>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
```

### single.php
```php
<?php get_header(); ?>

<article class="max-w-3xl mx-auto px-4 py-8">
    <?php while (have_posts()) : the_post(); ?>
        
        <?php if (has_post_thumbnail()) : ?>
            <div class="mb-8">
                <?php the_post_thumbnail('discover-featured', array('class' => 'w-full h-auto rounded-lg shadow-lg', 'loading' => 'eager')); ?>
            </div>
        <?php endif; ?>
        
        <header class="mb-8">
            <h1 class="text-4xl md:text-5xl font-bold mb-4"><?php the_title(); ?></h1>
            <div class="text-gray-600">
                <?php echo get_the_date(); ?> • <?php the_author(); ?>
            </div>
        </header>
        
        <div class="prose prose-lg max-w-none">
            <?php the_content(); ?>
        </div>
        
    <?php endwhile; ?>
</article>

<?php get_footer(); ?>
```

### page.php
```php
<?php get_header(); ?>

<div class="max-w-4xl mx-auto px-4 py-8">
    <?php while (have_posts()) : the_post(); ?>
        
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <h1 class="text-4xl font-bold mb-8"><?php the_title(); ?></h1>
            
            <div class="prose prose-lg max-w-none">
                <?php the_content(); ?>
            </div>
        </article>
        
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>
```

### 404.php
```php
<?php get_header(); ?>

<div class="max-w-2xl mx-auto px-4 py-16 text-center">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-2xl text-gray-600 mb-8"><?php _e('Page not found', 'discover'); ?></p>
    <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        <?php _e('Return Home', 'discover'); ?>
    </a>
</div>

<?php get_footer(); ?>
```

---

## Checklist de Performance

Avant de considérer le thème terminé, vérifier :

### Performance
- [ ] `npm run build` exécuté (CSS minifié)
- [ ] CSS final < 30KB
- [ ] JavaScript minifié < 10KB
- [ ] PageSpeed Insights score 92+ (mobile ET desktop)
- [ ] Aucune ressource bloquant le rendu
- [ ] Temps de chargement < 2s (3G rapide)
- [ ] Toutes les images en WebP ou optimisées
- [ ] Lazy loading sur toutes les images sauf hero

### Code Quality
- [ ] Aucune console error
- [ ] HTML valide (W3C validator)
- [ ] Aucun warning PHP (WP_DEBUG = true)
- [ ] Compatible PHP 7.4+
- [ ] Compatible WordPress 6.0+
- [ ] Toutes les sorties échappées (esc_html, esc_url, etc.)

### Accessibilité
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Alt tags sur toutes les images
- [ ] Navigation au clavier fonctionnelle
- [ ] Attributs aria- où nécessaire

### Tailwind
- [ ] Uniquement les classes utilisées dans le CSS final
- [ ] Pas de classes Tailwind inutiles dans le HTML
- [ ] Build de production configuré
- [ ] Aucune dépendance Tailwind en CDN

---

## Bonnes Pratiques Additionnelles

### Utilisation Intelligente de Tailwind
- **Composants répétés** : Utiliser `@apply` dans input.css pour éviter répétition
```css
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition;
}
```
- **Responsive** : Utiliser les préfixes Tailwind (sm:, md:, lg:, xl:)
- **États** : hover:, focus:, active: pour interactions

### Cache
- Headers cache pour assets statiques (.htaccess)
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

### Sécurité de Base
- Échapper toutes les sorties : `esc_html()`, `esc_url()`, `esc_attr()`
- Sanitize les inputs si formulaires
- Nonces pour formulaires
- Pas de `eval()` ou fonctions dangereuses

### Code Quality
- Indentation cohérente (tabs ou 4 espaces)
- Commentaires pour code complexe uniquement
- Noms de fonctions préfixés : `discover_function_name()`
- Pas de code mort ou commenté
- Un fichier = une responsabilité

---

## Ce qu'il NE FAUT PAS faire

❌ Utiliser le CDN Tailwind complet (trop lourd ~3MB)  
❌ Oublier de build en production (`npm run build`)  
❌ Utiliser jQuery ou bibliothèques JS lourdes  
❌ Charger Bootstrap en plus de Tailwind  
❌ Utiliser des page builders (Elementor, Divi, etc.)  
❌ Ajouter des features inutiles "au cas où"  
❌ Charger tous les assets sur toutes les pages  
❌ Faire des requêtes DB non optimisées  
❌ Mettre trop de classes Tailwind inutilisées  
❌ Oublier le lazy loading sur les images  
❌ Négliger l'accessibilité de base  
❌ Pusher node_modules dans git (ajouter au .gitignore)  

---

## Workflow de Développement

### 1. Installation initiale
```bash
# Dans le dossier du thème
npm install
```

### 2. Développement
```bash
# Terminal 1 : Watch Tailwind
npm run dev

# Terminal 2 : Serveur WordPress local
# (MAMP, Local, Docker, etc.)
```

### 3. Avant mise en production
```bash
# Build final minifié
npm run build

# Vérifier la taille du CSS
ls -lh assets/css/main.css

# Ne pas pusher node_modules
echo "node_modules/" >> .gitignore
```

---

## Résultat Attendu

Un thème WordPress qui :
- Se charge en < 2 secondes
- Score PageSpeed 92-98
- CSS final entre 10-25KB
- Code propre et maintenable avec Tailwind
- Prêt pour customisation future
- Respecte les standards WordPress
- Fonctionne sans plugins additionnels pour les features de base
- Design moderne et responsive

---

## Structure de Déploiement

### Fichiers à inclure
- ✅ Tous les .php
- ✅ assets/css/main.css (compilé et minifié)
- ✅ assets/js/*.js
- ✅ assets/images/*
- ✅ screenshot.png
- ✅ tailwind.config.js (pour référence)
- ✅ package.json (pour maintenance)

### Fichiers à EXCLURE (.gitignore)
```
node_modules/
assets/css/src/
*.log
.DS_Store
```

---

## Notes pour l'IA qui Code

### Priorités
1. **Performance avant tout** : Chaque décision doit favoriser la vitesse
2. **Simplicité** : Privilégier la solution la plus simple
3. **Tailwind intelligent** : Utiliser les classes de manière cohérente et sans excès
4. **Accessibilité** : Penser à tous les utilisateurs
5. **WordPress standards** : Suivre les conventions WP

### Approche de Code
- Commencer minimal, ajouter seulement ce qui est nécessaire
- Tester avec WP_DEBUG activé
- Valider le HTML régulièrement
- Vérifier PageSpeed après chaque feature
- Documenter les choix non-évidents

### Tailwind Best Practices
- Utiliser les utilitaires Tailwind de base en priorité
- Créer des composants avec @apply pour code répété
- Rester cohérent dans le naming des classes custom
- Ne pas sur-customiser la config Tailwind

**Version du document** : 2.0 (Tailwind Edition)  
**Mise à jour** : Janvier 2025