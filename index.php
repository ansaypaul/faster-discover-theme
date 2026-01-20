<?php
/**
 * Homepage - IDENTIQUE à page.tsx du projet Next.js
 * Structure complète avec toutes les sections
 */
get_header();

// Catégories principales (configurables depuis Apparence > Config Thème)
$main_categories = faster_get_homepage_categories();

// Système de déduplication : tracker les articles déjà affichés
$used_article_ids = array();
?>

<div class="min-h-screen bg-gaming-dark">
    <div class="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        
        <!-- Synopsis / Welcome Section -->
        <div class="synopsis mb-6 sm:mb-8 text-sm sm:text-base">
            <span class="synopsis-welcome text-gray-400">Bienvenue sur </span>
            <h1 class="inline text-white font-semibold">
                WorldofGeek.fr : l'actu geek des jeux vidéo, manga et pop culture.
            </h1>
        </div>

        <!-- Hero Grid - À la une -->
        <?php 
        // Récupérer les catégories autorisées pour le Hero
        $hero_categories = get_option('faster_hero_categories', array());
        
        // Préparer les arguments de la requête
        $hero_args = array(
            'posts_per_page' => 6,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'post',
            'post_status' => 'publish',
        );
        
        // Si des catégories sont sélectionnées, filtrer par ces catégories
        if (!empty($hero_categories)) {
            $hero_args['category_name'] = implode(',', $hero_categories);
        }
        
        // Récupérer les articles pour le hero
        $hero_posts = get_posts($hero_args);
        set_query_var('hero_posts', $hero_posts);
        get_template_part('template-parts/hero-grid');
        
        // Ajouter les IDs à la liste de déduplication
        foreach ($hero_posts as $post) {
            $used_article_ids[] = $post->ID;
        }
        ?>

        <?php /* Ad Banner Placeholder - Caché temporairement
        <div class="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-6 sm:mb-8">
            <p class="text-gray-500 text-sm">Emplacement publicitaire - Bannière horizontale 728x90</p>
        </div>
        */ ?>

        <!-- Category Sections -->
        <?php foreach ($main_categories as $category) : 
            $cat = get_category_by_slug($category['slug']);
            if (!$cat) continue;
            
            // Récupérer les articles de la catégorie (en excluant les déjà affichés)
            $category_posts = get_posts(array(
                'category' => $cat->term_id,
                'posts_per_page' => $category['posts_count'],
                'orderby' => 'date',
                'order' => 'DESC',
                'post__not_in' => $used_article_ids, // Exclure les articles déjà utilisés
            ));
            
            // Afficher seulement si la catégorie a au moins 1 article
            if (empty($category_posts)) continue;
            
            // Ajouter les IDs de ces articles au tableau de déduplication
            foreach ($category_posts as $post) {
                $used_article_ids[] = $post->ID;
            }
            
            // Choisir le template en fonction du layout configuré
            $layout_template = ($category['layout'] === 'platform') ? 'platform-section' : 'thematic-section';
            
            // Préparer les variables pour le template
            set_query_var('section_title', $category['title']);
            set_query_var('category_slug', $category['slug']);
            set_query_var('category_link', get_category_link($cat->term_id));
            set_query_var('section_posts', $category_posts);
            set_query_var('posts_count', $category['posts_count']);
            
            // Appeler le bon template (Platform = scroll mobile, Thematic = grille)
            get_template_part('template-parts/' . $layout_template);
        endforeach; ?>

        <!-- Editorial Picks - Top de la rédac -->
        <?php
        // Récupérer les articles les plus vus (SANS filtrage - TOP absolu)
        $editorial_days = get_option('faster_editorial_picks_days', 7);
        $editorial_articles = faster_get_most_viewed_posts(6, $editorial_days);
        
        // Note: On n'ajoute PAS les IDs à $used_article_ids
        // Le top de la rédac doit toujours afficher les vrais tops, même s'ils sont ailleurs
        
        set_query_var('editorial_title', 'Le top de la rédac');
        set_query_var('editorial_articles', $editorial_articles);
        get_template_part('template-parts/editorial-picks');
        ?>

        <!-- Tech / Dossiers / Lifestyle -->
        <?php
        /* $dossiers_cat = get_category_by_slug('dossiers');
        if ($dossiers_cat) :
            set_query_var('section_title', 'Tech / Dossiers / Lifestyle');
            set_query_var('category_slug', 'dossiers');
            set_query_var('category_link', get_category_link($dossiers_cat->term_id));
            set_query_var('posts_count', 4);
            get_template_part('template-parts/thematic-section');
        endif;
        */
        ?>

        <!-- Top Games -->
        <?php
            //set_query_var('top_games_title', 'Les meilleurs jeux du moment');
            //get_template_part('template-parts/top-games');
        ?>

        <?php /* Ad Banner Placeholder - Caché temporairement
        <div class="bg-gaming-dark-card border-2 border-dashed border-gaming-dark-lighter rounded-lg p-4 sm:p-6 text-center mb-6 sm:mb-8">
            <p class="text-gray-500 text-sm">Emplacement publicitaire - Bannière native</p>
        </div>
        */ ?>

        <!-- Video Section -->
        <?php
        //set_query_var('video_section_title', 'Nos dernières vidéos');
        //get_template_part('template-parts/video-section');
        ?>


        <!-- Top Rankings -->
        <?php
        //set_query_var('top_rankings_title', 'Top 10 des jeux de la semaine');
        //get_template_part('template-parts/top-rankings');
        ?>

        <!-- Newsletter Section -->
        <section class="bg-gaming-dark-lighter rounded-xl p-6 sm:p-8 text-center">
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">
                Rejoignez la communauté World of Geeks
            </h2>
            <p class="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Recevez les dernières actualités gaming, nos tests exclusifs et nos dossiers tech directement dans votre boîte mail.
            </p>
            
            <!-- Formulaire Brevo -->
            <form id="brevo-newsletter-form" class="flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4 mb-4">
                <input 
                    type="email" 
                    name="email"
                    id="brevo-email"
                    placeholder="Votre adresse email"
                    required
                    class="flex-1 px-4 py-3 bg-gaming-dark border border-gaming-dark-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-accent text-sm sm:text-base"
                />
                <button type="submit" id="brevo-submit" class="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors text-sm sm:text-base">
                    <span class="submit-text">S'abonner</span>
                    <span class="submit-loading hidden">⏳</span>
                </button>
            </form>
            
            <!-- Message de retour -->
            <div id="brevo-message" class="hidden text-sm"></div>
        </section>

    </div>
</div>

<?php get_footer(); ?>
