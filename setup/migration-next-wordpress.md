# Instructions : Conversion d'un Design Next.js vers Thème WordPress

## Contexte du Projet

Nous avons un design existant développé en **Next.js avec Tailwind CSS** dans le dossier `_reference-nextjs/`. 

**Objectif** : Créer un thème WordPress ultra-performant (PageSpeed 92+) en **réutilisant exactement le même design** mais en convertissant le code React/Next.js en PHP WordPress.

---

## Structure du Projet

```
discover/
├── _reference-nextjs/          ← Code Next.js de référence (NE PAS MODIFIER)
│   └── src/
│       ├── components/
│       ├── app/ ou pages/
│       └── styles/
├── assets/
│   ├── css/
│   │   ├── src/input.css
│   │   └── main.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── template-parts/
│   └── (fichiers PHP convertis)
├── functions.php
├── index.php
├── header.php
├── footer.php
├── single.php
├── page.php
├── archive.php
├── 404.php
├── style.css
├── tailwind.config.js
└── package.json
```

---

## Règle FONDAMENTALE : Conservation du Design

### ✅ CE QUI DOIT RESTER IDENTIQUE

1. **Toutes les classes Tailwind** exactement pareilles
2. **Structure HTML** identique
3. **Layout et spacing** identiques
4. **Couleurs, fonts, effets** identiques
5. **Responsive breakpoints** identiques

### 🔄 CE QUI DOIT ÊTRE CONVERTI

1. **Composants React** (`*.jsx`, `*.tsx`) → Templates PHP (`*.php`)
2. **Props React** → Variables PHP WordPress
3. **useState/useEffect** → Logique PHP côté serveur
4. **Routing Next.js** → WordPress template hierarchy
5. **API calls** → WordPress queries (`WP_Query`, `get_posts()`, etc.)

---

## Processus de Conversion Étape par Étape

### Étape 1 : Analyser le Code Next.js

**Parcourir `_reference-nextjs/src/` et identifier :**

- [ ] Quels composants existent (Header, Hero, Card, Footer, etc.)
- [ ] Quelle est la structure des pages (Home, Article, Archive)
- [ ] Quelles sont les couleurs utilisées (palette Tailwind)
- [ ] Quelles fonctionnalités JS sont nécessaires

### Étape 2 : Configurer Tailwind WordPress

**S'assurer que `tailwind.config.js` contient les mêmes valeurs que le projet Next.js**

Exemple :
```javascript
module.exports = {
  content: [
    "./**/*.php",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Reprendre EXACTEMENT les couleurs du projet Next.js
        primary: '#0066cc',
        dark: '#1a1a1a',
        // etc.
      },
      fontFamily: {
        // Reprendre les fonts
      },
    },
  },
  plugins: [],
}
```

### Étape 3 : Convertir les Composants React en Templates PHP

**Pour chaque composant dans `_reference-nextjs/src/components/`**, créer un équivalent PHP.

#### Exemple de Conversion : Card Component

##### Next.js (React) - Référence
```jsx
// _reference-nextjs/src/components/ArticleCard.jsx
export default function ArticleCard({ title, image, excerpt, date, link }) {
  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <span className="text-blue-500 text-sm font-semibold uppercase">News</span>
        <h3 className="text-white text-xl font-bold mt-2 mb-3">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">{date}</span>
          <a href={link} className="text-blue-500 hover:text-blue-400">
            Lire plus →
          </a>
        </div>
      </div>
    </article>
  );
}
```

##### WordPress (PHP) - Converti
```php
<!-- template-parts/article-card.php -->
<article class="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
  <?php if (has_post_thumbnail()) : ?>
    <?php the_post_thumbnail('medium', [
      'class' => 'w-full h-48 object-cover',
      'loading' => 'lazy'
    ]); ?>
  <?php endif; ?>
  
  <div class="p-6">
    <?php
    $categories = get_the_category();
    if (!empty($categories)) :
    ?>
      <span class="text-blue-500 text-sm font-semibold uppercase">
        <?php echo esc_html($categories[0]->name); ?>
      </span>
    <?php endif; ?>
    
    <h3 class="text-white text-xl font-bold mt-2 mb-3">
      <a href="<?php the_permalink(); ?>" class="hover:text-blue-400">
        <?php the_title(); ?>
      </a>
    </h3>
    
    <p class="text-gray-400 text-sm mb-4">
      <?php echo wp_trim_words(get_the_excerpt(), 20, '...'); ?>
    </p>
    
    <div class="flex justify-between items-center">
      <span class="text-gray-500 text-xs">
        <?php echo get_the_date(); ?>
      </span>
      <a href="<?php the_permalink(); ?>" class="text-blue-500 hover:text-blue-400">
        Lire plus →
      </a>
    </div>
  </div>
</article>
```

**Points clés de conversion :**
- `{title}` → `<?php the_title(); ?>`
- `{image}` → `<?php the_post_thumbnail(); ?>`
- `{date}` → `<?php echo get_the_date(); ?>`
- `{link}` → `<?php the_permalink(); ?>`
- Classes Tailwind **IDENTIQUES**

### Étape 4 : Créer les Templates de Pages Principaux

#### index.php (Page d'accueil / Liste d'articles)

**Analyser** `_reference-nextjs/src/app/page.tsx` ou `pages/index.tsx`

**Reproduire** la structure avec :
- Hero section (si présent)
- Grid d'articles
- Sections distinctes (News, Jeux Vidéo, etc.)

```php
<?php get_header(); ?>

<div class="min-h-screen bg-black">
  <!-- Hero Section (si présent dans Next.js) -->
  <?php get_template_part('template-parts/hero'); ?>
  
  <!-- Section News -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-white text-3xl font-bold">News</h2>
      <a href="<?php echo get_category_link(get_cat_ID('News')); ?>" class="text-blue-500 hover:text-blue-400">
        Voir plus →
      </a>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <?php
      $news_query = new WP_Query([
        'category_name' => 'news',
        'posts_per_page' => 4,
        'orderby' => 'date',
        'order' => 'DESC'
      ]);
      
      if ($news_query->have_posts()) :
        while ($news_query->have_posts()) : $news_query->the_post();
          get_template_part('template-parts/article-card');
        endwhile;
        wp_reset_postdata();
      endif;
      ?>
    </div>
  </section>
  
  <!-- Répéter pour autres sections (Jeux Vidéo, Mangas, etc.) -->
</div>

<?php get_footer(); ?>
```

#### single.php (Article individuel)

**Analyser** `_reference-nextjs/src/app/article/[slug]/page.tsx`

```php
<?php get_header(); ?>

<article class="min-h-screen bg-black">
  <?php while (have_posts()) : the_post(); ?>
    
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Featured Image -->
      <?php if (has_post_thumbnail()) : ?>
        <div class="mb-8 rounded-lg overflow-hidden">
          <?php the_post_thumbnail('large', [
            'class' => 'w-full h-auto',
            'loading' => 'eager'
          ]); ?>
        </div>
      <?php endif; ?>
      
      <!-- Article Header -->
      <header class="mb-8">
        <?php
        $categories = get_the_category();
        if (!empty($categories)) :
        ?>
          <span class="text-blue-500 text-sm font-semibold uppercase mb-3 inline-block">
            <?php echo esc_html($categories[0]->name); ?>
          </span>
        <?php endif; ?>
        
        <h1 class="text-white text-4xl md:text-5xl font-bold mb-4">
          <?php the_title(); ?>
        </h1>
        
        <div class="flex items-center text-gray-400 text-sm space-x-4">
          <span><?php echo get_the_date(); ?></span>
          <span>•</span>
          <span><?php the_author(); ?></span>
        </div>
      </header>
      
      <!-- Article Content -->
      <div class="prose prose-invert prose-lg max-w-none">
        <?php the_content(); ?>
      </div>
    </div>
    
  <?php endwhile; ?>
</article>

<?php get_footer(); ?>
```

### Étape 5 : Header et Footer

#### header.php

**Analyser** `_reference-nextjs/src/components/Header.jsx` ou layout

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-black text-white'); ?>>
<?php wp_body_open(); ?>

<header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
        <nav class="flex justify-between items-center py-4">
            <!-- Logo -->
            <div class="text-2xl font-bold">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="text-white hover:text-blue-500 transition">
                    <?php bloginfo('name'); ?>
                </a>
            </div>
            
            <!-- Navigation Menu -->
            <?php
            wp_nav_menu([
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'hidden md:flex space-x-8 items-center',
                'fallback_cb' => false,
                'link_before' => '<span class="text-gray-300 hover:text-white transition">',
                'link_after' => '</span>',
            ]);
            ?>
            
            <!-- Mobile Menu Toggle (si nécessaire) -->
            <button class="md:hidden text-white" id="mobile-menu-toggle">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </nav>
    </div>
</header>

<main class="min-h-screen">
```

#### footer.php

**Analyser** `_reference-nextjs/src/components/Footer.jsx`

```php
</main>

<footer class="bg-gray-900 border-t border-gray-800 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- Colonne 1 -->
            <div>
                <h3 class="text-white font-bold mb-4"><?php bloginfo('name'); ?></h3>
                <p class="text-gray-400 text-sm">
                    <?php bloginfo('description'); ?>
                </p>
            </div>
            
            <!-- Colonne 2 : Navigation -->
            <div>
                <h4 class="text-white font-semibold mb-4">Navigation</h4>
                <?php
                wp_nav_menu([
                    'theme_location' => 'footer',
                    'container' => false,
                    'menu_class' => 'space-y-2',
                    'link_before' => '<span class="text-gray-400 hover:text-white transition text-sm">',
                    'link_after' => '</span>',
                ]);
                ?>
            </div>
            
            <!-- Colonne 3 : Catégories -->
            <div>
                <h4 class="text-white font-semibold mb-4">Catégories</h4>
                <ul class="space-y-2">
                    <?php
                    $categories = get_categories(['number' => 5]);
                    foreach ($categories as $category) :
                    ?>
                        <li>
                            <a href="<?php echo get_category_link($category->term_id); ?>" class="text-gray-400 hover:text-white transition text-sm">
                                <?php echo esc_html($category->name); ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            
            <!-- Colonne 4 : Social -->
            <div>
                <h4 class="text-white font-semibold mb-4">Suivez-nous</h4>
                <!-- Social links si présents dans Next.js -->
            </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 text-center">
            <p class="text-gray-500 text-sm">
                &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Tous droits réservés.
            </p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
```

---

## Guide de Conversion des Éléments React Courants

### useState → Variables PHP ou Options WordPress

**React :**
```jsx
const [isOpen, setIsOpen] = useState(false);
```

**WordPress :**
- Si état simple UI : Gérer en JavaScript vanilla
- Si donnée persistante : `get_option()` / `update_option()`

### map() sur tableau → WordPress Loop

**React :**
```jsx
articles.map(article => (
  <ArticleCard key={article.id} {...article} />
))
```

**WordPress :**
```php
<?php
$articles = new WP_Query(['posts_per_page' => 10]);
if ($articles->have_posts()) :
  while ($articles->have_posts()) : $articles->the_post();
    get_template_part('template-parts/article-card');
  endwhile;
  wp_reset_postdata();
endif;
?>
```

### Conditional Rendering → PHP if/else

**React :**
```jsx
{isLoggedIn ? <UserMenu /> : <LoginButton />}
```

**WordPress :**
```php
<?php if (is_user_logged_in()) : ?>
  <?php get_template_part('template-parts/user-menu'); ?>
<?php else : ?>
  <?php get_template_part('template-parts/login-button'); ?>
<?php endif; ?>
```

### Dynamic Classes → PHP Conditionals

**React :**
```jsx
className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'}`}
```

**WordPress :**
```php
class="btn <?php echo $is_primary ? 'btn-primary' : 'btn-secondary'; ?>"
```

---

## Optimisations WordPress Spécifiques

### functions.php - Configuration Essentielle

```php
<?php
// Theme Setup
function discover_setup() {
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    
    // Navigation Menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'discover'),
        'footer' => __('Footer Menu', 'discover'),
    ));
    
    // Image Sizes (adapter selon Next.js)
    add_image_size('discover-hero', 1920, 1080, true);
    add_image_size('discover-card', 600, 400, true);
}
add_action('after_setup_theme', 'discover_setup');

// Désactiver features WordPress inutiles (PERFORMANCE)
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');
remove_action('wp_head', 'wp_resource_hints', 2);
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');

// Enqueue Assets
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
        true
    );
}
add_action('wp_enqueue_scripts', 'discover_enqueue_assets');

// Defer scripts
function discover_defer_scripts($tag, $handle) {
    if ('discover-main' === $handle) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'discover_defer_scripts', 10, 2);
```

---

## JavaScript : Conversion des Interactions

### Exemple : Mobile Menu Toggle

**React (Next.js) :**
```jsx
const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(!isOpen)}>Menu</button>
{isOpen && <MobileMenu />}
```

**Vanilla JS (WordPress) :**
```javascript
// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
```

**Principe :** Toute interaction client-side doit être en Vanilla JavaScript (pas de React, pas de jQuery).

---

## Checklist de Conversion Complète

### Design & Style
- [ ] Toutes les classes Tailwind du projet Next.js sont réutilisées
- [ ] Les couleurs sont identiques (vérifier `tailwind.config.js`)
- [ ] Les fonts sont identiques
- [ ] Le spacing (padding, margin) est identique
- [ ] Les breakpoints responsive sont identiques
- [ ] Les hover effects et transitions sont identiques
- [ ] Les animations sont reproduites

### Structure & Templates
- [ ] Header converti avec même design
- [ ] Footer converti avec même design
- [ ] Homepage (index.php) reproduit la structure Next.js
- [ ] Single post (single.php) reproduit le design article
- [ ] Archive/Category pages si présentes
- [ ] 404 page
- [ ] Tous les composants React ont un équivalent PHP

### Fonctionnalités
- [ ] Navigation menu fonctionne
- [ ] Recherche (si présente dans Next.js)
- [ ] Pagination
- [ ] Catégories et tags
- [ ] Featured images
- [ ] Lazy loading images
- [ ] Interactions JS converties en vanilla JS

### Performance
- [ ] `npm run build` exécuté (CSS minifié)
- [ ] CSS final < 30KB
- [ ] Pas de jQuery
- [ ] Scripts avec defer
- [ ] Images optimisées WebP
- [ ] Lazy loading actif
- [ ] PageSpeed 92+

### Code Quality
- [ ] Toutes les sorties échappées (`esc_html`, `esc_url`, `esc_attr`)
- [ ] Pas de warnings PHP
- [ ] HTML valide W3C
- [ ] Accessibilité de base (alt tags, aria labels)

---

## Workflow de Développement

### 1. Phase de Référence
```bash
# Analyser le code Next.js
- Explorer _reference-nextjs/src/components/
- Noter tous les composants à convertir
- Screenshot des pages si nécessaire
- Identifier la palette de couleurs
```

### 2. Phase de Setup
```bash
# Dans le dossier du thème
npm install
npm run dev  # Laisser tourner pendant le dev
```

### 3. Phase de Conversion
```bash
# Ordre recommandé :
1. tailwind.config.js (copier config Next.js)
2. header.php + footer.php
3. index.php (homepage)
4. template-parts/ (composants)
5. single.php
6. autres templates
```

### 4. Phase de Test
```bash
# Vérifications
- Tester toutes les pages
- Vérifier le responsive (mobile, tablet, desktop)
- Tester les interactions JS
- PageSpeed Insights
- W3C Validator
```

### 5. Phase de Production
```bash
npm run build  # CSS minifié final
# Upload sur serveur SANS node_modules/
```

---

## Pièges à Éviter

❌ **Ne PAS modifier les classes Tailwind** (utiliser exactement les mêmes)  
❌ **Ne PAS utiliser jQuery**  
❌ **Ne PAS oublier d'échapper les sorties PHP** (`esc_html`, etc.)  
❌ **Ne PAS charger le CDN Tailwind** (uniquement CSS compilé)  
❌ **Ne PAS copier-coller sans adapter** (props React ≠ variables PHP)  
❌ **Ne PAS oublier le responsive** (tester mobile first)  
❌ **Ne PAS négliger les images** (lazy loading, WebP, alt tags)  
❌ **Ne PAS upload node_modules/** sur le serveur  

---

## Résultat Attendu

Un thème WordPress qui :
- ✅ Ressemble **EXACTEMENT** au site Next.js de référence
- ✅ Utilise les **mêmes classes Tailwind**
- ✅ A des **performances excellentes** (PageSpeed 92+)
- ✅ Est **100% fonctionnel** en WordPress
- ✅ Est **maintenable et propre**
- ✅ Fonctionne **sans plugins** pour les features de base

---

## Support & Debugging

### Si le design ne correspond pas :
1. Comparer les classes Tailwind (Next.js vs WordPress)
2. Vérifier `tailwind.config.js` (mêmes valeurs ?)
3. Inspecter avec DevTools (classes appliquées ?)
4. Vérifier que `npm run build` a été exécuté

### Si les performances sont mauvaises :
1. CSS bien minifié ? (`npm run build`)
2. Images en lazy loading ?
3. Scripts avec defer ?
4. Features WP inutiles désactivées dans functions.php ?

### Si erreurs PHP :
1. Activer WP_DEBUG dans wp-config.php
2. Vérifier les échappements (esc_html, esc_url)
3. Vérifier les appels WordPress (have_posts, the_post, etc.)

---

**Version** : 1.0  
**Date** : Janvier 2025  
**Projet** : Discover WordPress Theme (conversion depuis Next.js)