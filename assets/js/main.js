// Faster Theme - Main JavaScript (Vanilla JS uniquement)

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Brevo Newsletter Subscription
    const newsletterForm = document.getElementById('brevo-newsletter-form');
    
    if (newsletterForm) {
        // Vérifier si brevoNewsletter est défini
        if (typeof brevoNewsletter === 'undefined') {
            return;
        }
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('brevo-email');
            const submitBtn = document.getElementById('brevo-submit');
            const message = document.getElementById('brevo-message');
            const submitText = submitBtn.querySelector('.submit-text');
            const submitLoading = submitBtn.querySelector('.submit-loading');
            
            // Désactiver le bouton pendant l'envoi
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            message.classList.add('hidden');
            
            // Préparer les données
            const formData = new FormData();
            formData.append('action', 'brevo_subscribe');
            formData.append('nonce', brevoNewsletter.nonce);
            formData.append('email', emailInput.value);
            
            // Envoi AJAX
            fetch(brevoNewsletter.ajax_url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                message.classList.remove('hidden');
                
                if (data.success) {
                    message.classList.remove('text-red-400');
                    message.classList.add('text-gaming-accent');
                    message.textContent = data.data.message;
                    emailInput.value = ''; // Vider le champ
                } else {
                    message.classList.remove('text-gaming-accent');
                    message.classList.add('text-red-400');
                    message.textContent = data.data.message;
                }
            })
            .catch(error => {
                message.classList.remove('hidden', 'text-gaming-accent');
                message.classList.add('text-red-400');
                message.textContent = '❌ Erreur de connexion. Veuillez réessayer.';
            })
            .finally(() => {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
            });
        });
    }
    
    // ========================================================
    // Lazy Loading YouTube (évite les cookies avant le clic)
    // ========================================================
    function lazyLoadYouTube() {
        const iframes = document.querySelectorAll('.article-content iframe[src*="youtube.com"], .article-content iframe[src*="youtu.be"]');
        
        iframes.forEach(iframe => {
            // Extraire l'ID de la vidéo
            const src = iframe.src;
            let videoId = null;
            
            // Essayer différents formats d'URL YouTube
            if (src.includes('youtube.com/embed/')) {
                videoId = src.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
            } else if (src.includes('youtu.be/')) {
                videoId = src.split('youtu.be/')[1].split('?')[0].split('&')[0];
            }
            
            if (!videoId) return;
            
            // Créer le container de remplacement
            const container = document.createElement('div');
            container.className = 'youtube-lazy-container relative w-full rounded-lg shadow-lg bg-black cursor-pointer overflow-hidden';
            container.style.paddingTop = '56.25%'; // Ratio 16:9
            
            // Thumbnail YouTube
            const thumbnail = document.createElement('div');
            thumbnail.className = 'absolute inset-0 w-full h-full bg-center bg-cover';
            thumbnail.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
            
            // Bouton play
            const playButton = document.createElement('div');
            playButton.className = 'absolute inset-0 flex items-center justify-center';
            playButton.innerHTML = `
                <div class="bg-red-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-xl hover:bg-red-700 transition-colors">
                    <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            `;
            
            thumbnail.appendChild(playButton);
            container.appendChild(thumbnail);
            
            // Au clic, charger la vraie iframe
            container.addEventListener('click', function() {
                const realIframe = document.createElement('iframe');
                realIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                realIframe.className = 'absolute inset-0 w-full h-full rounded-lg';
                realIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                realIframe.allowFullscreen = true;
                realIframe.loading = 'lazy';
                
                container.innerHTML = '';
                container.appendChild(realIframe);
            });
            
            // Remplacer l'iframe originale
            iframe.parentNode.replaceChild(container, iframe);
        });
    }
    
    // Exécuter le lazy loading
    lazyLoadYouTube();
    
    // ========================================================
    // Barre de progression de lecture (articles uniquement)
    // ========================================================
    if (document.body.classList.contains('single-post')) {
        initReadingProgress();
    }
});

// ========================================================
// Fonction: Barre de progression de lecture
// ========================================================
function initReadingProgress() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Créer la barre
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    // Calculer la progression
    function updateProgress() {
        // Récupérer l'élément <article>
        const article = document.querySelector('article');
        if (!article) return;
        
        // Position actuelle du scroll
        const scrollTop = window.scrollY;
        
        // Position du début de l'article
        const articleStart = article.offsetTop;
        
        // Hauteur totale de l'article
        const articleHeight = article.offsetHeight;
        
        // Hauteur de la fenêtre
        const windowHeight = window.innerHeight;
        
        // Calcul de la progression (0 à 100%)
        const scrollableHeight = articleHeight - windowHeight + articleStart;
        const scrolled = scrollTop - articleStart;
        const progress = Math.min(Math.max((scrolled / scrollableHeight) * 100, 0), 100);
        
        // Mettre à jour la largeur de la barre
        progressBar.style.width = progress + '%';
        
        // Afficher après 5% de scroll, masquer à 100%
        if (progress >= 5 && progress < 100) {
            progressBar.classList.add('visible');
        } else {
            progressBar.classList.remove('visible');
        }
    }
    
    // Écouteur de scroll (throttle pour les perfs)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Mise à jour initiale
    updateProgress();
}
