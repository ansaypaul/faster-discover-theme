<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input type="search" 
               class="w-full pl-10 pr-4 py-3 bg-gaming-dark-lighter border-0 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gaming-primary" 
               placeholder="<?php echo esc_attr_x('Rechercher...', 'placeholder', 'faster'); ?>" 
               value="<?php echo get_search_query(); ?>" 
               name="s" />
    </div>
</form>
