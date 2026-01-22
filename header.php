<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="icon" type="image/png" href="https://worldofgeek.fr/fav/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="https://worldofgeek.fr/fav/favicon.svg" />
    <link rel="shortcut icon" href="https://worldofgeek.fr/fav/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="https://worldofgeek.fr/fav/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="WorldOfGeek" />
    <link rel="manifest" href="https://worldofgeek.fr/fav/site.webmanifest" />
    <meta name="facebook-domain-verification" content="gq10rm5tardk2qehfym6hki2bq2vsz" />
    <meta name="google-adsense-account" content="ca-pub-4636608115398996">

    <!-- Performance: Preload critical assets -->
    <link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/images/worldofgeek-logo.svg" as="image" type="image/svg+xml">
    
    <!-- Performance: DNS Prefetch & Preconnect -->
    <link rel="dns-prefetch" href="//api.brevo.com">
    <link rel="preconnect" href="https://api.brevo.com" crossorigin>
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="sticky top-0 z-50">
    <header class="backdrop-blur-sm" style="background-color: #1a1a1a;">
        <div class="container mx-auto px-4">
            <div class="flex items-center gap-8 h-16">
                <!-- Logo SVG -->
                <div class="flex items-center space-x-2 sm:space-x-3">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center">
                        <img 
                            src="<?php echo get_template_directory_uri(); ?>/assets/images/worldofgeek-logo.svg" 
                            alt="<?php bloginfo('name'); ?> - L'actu geek des jeux vidéo, manga et pop culture"
                            class="h-10 sm:h-12 w-auto"
                            width="832"
                            height="391"
                        />
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => 'nav',
                    'container_class' => 'hidden lg:flex items-center space-x-6',
                    'menu_class' => 'flex items-center space-x-6',
                    'fallback_cb' => false,
                ));
                ?>

                <!-- Search Bar Desktop -->
                <form method="get" action="<?php echo esc_url(home_url('/')); ?>" class="hidden md:flex items-center space-x-2 ml-auto">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            name="s"
                            placeholder="Rechercher..." 
                            value="<?php echo get_search_query(); ?>"
                            class="pl-10 w-48 lg:w-64 bg-gaming-dark-lighter border-gaming-dark-card text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gaming-primary border-0"
                        />
                    </div>
                </form>

                <!-- Mobile Menu Button -->
                <button 
                    id="mobile-menu-button"
                    class="lg:hidden text-white ml-auto"
                    aria-label="Menu mobile"
                >
                    <svg class="w-5 h-5 menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    <svg class="w-5 h-5 close-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden lg:hidden py-4 border-t border-gaming-dark-lighter">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => 'nav',
                    'container_class' => 'flex flex-col space-y-2',
                    'menu_class' => 'flex flex-col space-y-2',
                    'fallback_cb' => false,
                ));
                ?>
                
                <!-- Mobile Search -->
                <form method="get" action="<?php echo esc_url(home_url('/')); ?>" class="mt-4">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            name="s"
                            placeholder="Rechercher..." 
                            value="<?php echo get_search_query(); ?>"
                            class="pl-10 w-full bg-gaming-dark-lighter border-gaming-dark-card text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gaming-primary border-0"
                        />
                    </div>
                </form>
            </div>
        </div>
    </header>

    <!-- Category Menu (identique Next.js) -->
    <?php get_template_part('template-parts/category-menu'); ?>
</div>

<main class="min-h-screen bg-gaming-dark">
