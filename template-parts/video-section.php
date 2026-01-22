<?php
/**
 * Video Section - Nos dernières vidéos
 * Identique à VideoSection.tsx
 * 1 grande vidéo + 3 petites vidéos à côté
 */

$title = get_query_var('video_section_title', 'Nos dernières vidéos');

// Pour l'instant, on utilise des posts de catégorie "videos" ou posts récents
$videos_cat = get_category_by_slug('videos');
$videos = array();

if ($videos_cat) {
    $videos = get_posts(array(
        'category' => $videos_cat->term_id,
        'posts_per_page' => 4,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

// Fallback: utiliser des posts récents
if (empty($videos)) {
    $videos = get_posts(array(
        'posts_per_page' => 4,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
}

if (empty($videos)) {
    return;
}

$main_video = $videos[0];
$side_videos = array_slice($videos, 1, 3);
?>

<section class="mb-6 sm:mb-8">
    <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        <?php echo esc_html($title); ?>
    </h2>
    
    <div class="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        <!-- Main video -->
        <?php if ($main_video) : 
            setup_postdata($main_video);
        ?>
            <div class="lg:col-span-2">
                <a href="<?php echo get_permalink($main_video); ?>" class="group relative bg-gaming-dark-card rounded-xl overflow-hidden cursor-pointer block">
                    <div class="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                        <?php if (has_post_thumbnail($main_video)) : 
                            echo get_the_post_thumbnail($main_video, 'faster-medium', array(
                                'class' => 'object-cover w-full h-full',
                                'loading' => 'lazy'
                            ));
                        endif; ?>
                        <div class="absolute inset-0 bg-black/30"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gaming-accent rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gaming-dark fill-current ml-1" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs">
                            <?php echo ceil(str_word_count(strip_tags(get_post_field('post_content', $main_video))) / 200); ?> min
                        </div>
                    </div>
                    <div class="p-3 sm:p-4">
                        <h3 class="text-white font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                            <?php echo get_the_title($main_video); ?>
                        </h3>
                        <p class="text-gray-400 text-sm"><?php echo get_the_date('', $main_video); ?></p>
                    </div>
                </a>
            </div>
        <?php wp_reset_postdata(); endif; ?>

        <!-- Side videos -->
        <div class="space-y-3 sm:space-y-4">
            <?php foreach ($side_videos as $video) : 
                setup_postdata($video);
            ?>
                <a 
                    href="<?php echo get_permalink($video); ?>"
                    class="group flex bg-gaming-dark-card rounded-lg overflow-hidden cursor-pointer"
                >
                    <div class="relative w-20 h-16 sm:w-24 sm:h-16 flex-shrink-0">
                        <?php if (has_post_thumbnail($video)) : 
                            echo get_the_post_thumbnail($video, 'faster-side', array(
                                'class' => 'object-cover w-full h-full',
                                'loading' => 'lazy'
                            ));
                        endif; ?>
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                        <div class="absolute bottom-1 right-1 bg-black/80 text-white px-1 text-xs rounded">
                            <?php echo ceil(str_word_count(strip_tags(get_post_field('post_content', $video))) / 200); ?> min
                        </div>
                    </div>
                    <div class="p-2 sm:p-3 flex-1 min-w-0">
                        <h3 class="text-white text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-gaming-accent transition-colors">
                            <?php echo get_the_title($video); ?>
                        </h3>
                        <p class="text-gray-400 text-xs mt-1"><?php echo get_the_date('', $video); ?></p>
                    </div>
                </a>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>
    </div>
</section>
