<article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'); ?>>
    <?php if (has_post_thumbnail()) : ?>
        <div class="mb-4">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('faster-featured', array('class' => 'w-full h-auto rounded-lg', 'loading' => 'lazy')); ?>
            </a>
        </div>
    <?php endif; ?>
    
    <h2 class="text-3xl font-bold mb-2">
        <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-primary transition">
            <?php the_title(); ?>
        </a>
    </h2>
    
    <div class="text-gray-600 text-sm mb-4">
        <?php echo get_the_date(); ?> • <?php the_author(); ?>
    </div>
    
    <div class="prose max-w-none text-gray-700">
        <?php the_excerpt(); ?>
    </div>
    
    <a href="<?php the_permalink(); ?>" class="inline-block mt-4 text-primary hover:underline font-medium">
        <?php _e('Lire la suite', 'faster'); ?> &rarr;
    </a>
</article>
