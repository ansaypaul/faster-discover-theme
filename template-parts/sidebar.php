<?php
/**
 * Sidebar - "À lire aussi"
 * Identique à Sidebar.tsx du Next.js
 * 1 grand article + articles compacts
 */

$posts = get_query_var('sidebar_posts', array());

if (empty($posts)) {
    return;
}

$first_post = $posts[0];
$other_posts = array_slice($posts, 1);
?>

<aside class="hidden lg:block lg:w-[364px] space-y-8">
    <!-- Section "À lire aussi" -->
    <div class="bg-gaming-dark-card rounded-lg p-4 shadow-lg">
        <div class="text-xl font-bold text-white mb-6">À lire aussi</div>
        
        <!-- Premier article - Grand format -->
        <?php if ($first_post) : 
            setup_postdata($first_post);
        ?>
            <article class="group mb-6">
                <a
                    href="<?php echo get_permalink($first_post); ?>"
                    class="block bg-[#1a1a1a] rounded-lg overflow-hidden"
                >
                    <div class="relative aspect-video w-full">
                        <?php if (has_post_thumbnail($first_post)) : 
                            echo get_the_post_thumbnail($first_post, 'faster-news', array(
                                'class' => 'object-cover w-full h-full',
                                'loading' => 'lazy'
                            ));
                        else : ?>
                            <div class="absolute inset-0 bg-gaming-dark"></div>
                        <?php endif; ?>
                    </div>
                    <div class="p-4">
                        <div class="text-base text-white group-hover:text-gaming-accent transition-colors line-clamp-2 font-medium">
                            <?php echo get_the_title($first_post); ?>
                        </div>
                        <time datetime="<?php echo get_the_date('c', $first_post); ?>" class="text-xs text-gray-400 mt-2 block">
                            <?php echo get_the_date('j F Y', $first_post); ?>
                        </time>
                    </div>
                </a>
            </article>
        <?php wp_reset_postdata(); endif; ?>

        <!-- Articles suivants - Format compact -->
        <div class="space-y-3">
            <?php foreach ($other_posts as $post) : 
                setup_postdata($post);
            ?>
                <article class="group">
                    <a
                        href="<?php echo get_permalink($post); ?>"
                        class="flex gap-3 items-center bg-[#1a1a1a] rounded-lg overflow-hidden p-2"
                    >
                        <div class="relative w-24 aspect-video flex-shrink-0">
                            <?php if (has_post_thumbnail($post)) : 
                                echo get_the_post_thumbnail($post, 'faster-side', array(
                                    'class' => 'object-cover rounded w-full h-full',
                                    'loading' => 'lazy'
                                ));
                            else : ?>
                                <div class="absolute inset-0 bg-gaming-dark rounded"></div>
                            <?php endif; ?>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-sm text-white group-hover:text-gaming-accent transition-colors line-clamp-2">
                                <?php echo get_the_title($post); ?>
                            </div>
                            <time datetime="<?php echo get_the_date('c', $post); ?>" class="text-xs text-gray-400 mt-1 block">
                                <?php echo get_the_date('j F Y', $post); ?>
                            </time>
                        </div>
                    </a>
                </article>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>
    </div>
</aside>
