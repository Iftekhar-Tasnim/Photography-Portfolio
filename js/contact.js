// Contact form functionality for Photography Portfolio

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message (in a real app, you'd send this to a server)
            alert('Thank you for your message! I\'ll get back to you within 24 hours.');
            
            // Reset form
            this.reset();
        });
    }
}

// Initialize contact functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});
