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
});
