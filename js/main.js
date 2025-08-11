// Main JavaScript for Photography Portfolio

// Theme toggle functionality
function initializeTheme() {
    const themeController = document.querySelector('.theme-controller');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    if (themeController) {
        themeController.checked = currentTheme === 'dark';
    }
    
    // Theme toggle event
    if (themeController) {
        themeController.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .stat, .hero-content').forEach(el => {
        observer.observe(el);
    });
}

// Back to Top floating button
function initializeBackToTop() {
    if (document.getElementById('back-to-top')) {
        return; // already initialized
    }

    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.type = 'button';
    button.setAttribute('aria-label', 'Back to top');
    button.className = [
        'fixed','bottom-6','right-6','z-50',
        'rounded-full','p-3','bg-primary','text-primary-content','shadow-lg',
        'hover:bg-primary-focus','transition','transform','hover:scale-110',
        'opacity-0','pointer-events-none'
    ].join(' ');
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
        </svg>
    `;

    document.body.appendChild(button);

    const showThreshold = 300;
    const onScroll = () => {
        const shouldShow = window.scrollY > showThreshold;
        if (shouldShow) {
            button.classList.remove('opacity-0','pointer-events-none');
            button.classList.add('opacity-100');
        } else {
            button.classList.add('opacity-0','pointer-events-none');
            button.classList.remove('opacity-100');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeBackToTop();
});
