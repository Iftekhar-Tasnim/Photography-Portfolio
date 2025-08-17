// Professional Image Carousel System
class CarouselManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.isAutoPlaying = true;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.slides = document.querySelectorAll('.carousel-item');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides > 0) {
            this.initializeCarousel();
            this.initializeControls();
            this.initializeAutoPlay();
            this.initializeTouchGestures();
            this.initializeKeyboardNavigation();
            this.initializeAccessibility();
        }
    }
    
    initializeCarousel() {
        // Set initial state
        this.showSlide(0);
        
        // Add transition classes
        this.slides.forEach((slide, index) => {
            slide.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
            slide.dataset.index = index;
        });
        
        // Add fade-in animation on load
        setTimeout(() => {
            this.slides[0].classList.add('animate-in');
        }, 100);
    }
    
    initializeControls() {
        // Previous button functionality
        const prevButton = document.querySelector('[onclick="previousSlide()"]');
        if (prevButton) {
            prevButton.removeAttribute('onclick');
            prevButton.addEventListener('click', () => this.previousSlide());
        }
        
        // Next button functionality
        const nextButton = document.querySelector('[onclick="nextSlide()"]');
        if (nextButton) {
            nextButton.removeAttribute('onclick');
            nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicator functionality
        this.indicators.forEach((indicator, index) => {
            indicator.removeAttribute('onclick');
            indicator.addEventListener('click', () => this.showSlide(index));
        });
        
        // Add pause/play button
        this.addPlayPauseButton();
    }
    
    addPlayPauseButton() {
        const carouselContainer = document.querySelector('.carousel');
        if (!carouselContainer) return;
        
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'btn btn-circle btn-sm bg-black bg-opacity-50 text-white border-none absolute top-4 left-1/2 transform -translate-x-1/2 z-20 hover:bg-opacity-70 transition-all duration-300';
        playPauseBtn.setAttribute('aria-label', 'Pause carousel');
        playPauseBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
        
        playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());
        carouselContainer.appendChild(playPauseBtn);
        
        this.playPauseButton = playPauseBtn;
    }
    
    initializeAutoPlay() {
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
        
        // Pause auto-play on hover
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
        
        this.updatePlayPauseButton(true);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
        
        this.updatePlayPauseButton(this.isAutoPlaying);
    }
    
    updatePlayPauseButton(isPlaying) {
        if (!this.playPauseButton) return;
        
        if (isPlaying) {
            this.playPauseButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
            this.playPauseButton.setAttribute('aria-label', 'Pause carousel');
        } else {
            this.playPauseButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
            this.playPauseButton.setAttribute('aria-label', 'Play carousel');
        }
    }
    
    initializeTouchGestures() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            
            // Pause auto-play during touch
            this.pauseAutoPlay();
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const duration = endTime - startTime;
            
            // Minimum swipe distance and maximum duration
            const minSwipeDistance = 50;
            const maxSwipeDuration = 500;
            
            if (duration < maxSwipeDuration && Math.abs(diffX) > minSwipeDistance) {
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.previousSlide();
                    }
                }
            }
            
            // Resume auto-play after touch
            setTimeout(() => {
                if (this.isAutoPlaying) {
                    this.resumeAutoPlay();
                }
            }, 1000);
            
            startX = 0;
            startY = 0;
            startTime = 0;
        });
    }
    
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const carousel = document.querySelector('.carousel');
            if (!carousel || !carousel.matches(':hover')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
            }
        });
    }
    
    initializeAccessibility() {
        // Add ARIA labels and roles
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-label', 'Image carousel');
            carousel.setAttribute('aria-live', 'polite');
        }
        
        // Update slide indicators with proper ARIA
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
        });
        
        // Add slide counter
        this.addSlideCounter();
    }
    
    addSlideCounter() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        const counter = document.createElement('div');
        counter.className = 'absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm font-medium';
        counter.setAttribute('aria-live', 'polite');
        counter.textContent = `1 of ${this.totalSlides}`;
        
        carousel.appendChild(counter);
        this.slideCounter = counter;
    }
    
    showSlide(index) {
        if (this.isTransitioning || index < 0 || index >= this.totalSlides) return;
        
        this.isTransitioning = true;
        
        // Hide current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].style.opacity = '0';
            this.slides[this.currentSlide].style.zIndex = '1';
        }
        
        // Update current slide
        this.currentSlide = index;
        
        // Show new slide
        if (this.slides[index]) {
            this.slides[index].style.opacity = '1';
            this.slides[index].style.zIndex = '2';
            this.slides[index].classList.add('animate-in');
        }
        
        // Update indicators
        this.updateIndicators(index);
        
        // Update slide counter
        if (this.slideCounter) {
            this.slideCounter.textContent = `${index + 1} of ${this.totalSlides}`;
        }
        
        // Update URL hash for bookmarking
        this.updateURLHash(index);
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }
    
    updateIndicators(activeIndex) {
        this.indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('opacity-100');
                indicator.classList.remove('opacity-60');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('opacity-100');
                indicator.classList.add('opacity-60');
                indicator.setAttribute('aria-current', 'false');
            }
        });
    }
    
    updateURLHash(slideIndex) {
        const hash = `slide=${slideIndex + 1}`;
        if (window.location.hash !== `#${hash}`) {
            window.location.hash = hash;
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(slideNumber) {
        const index = slideNumber - 1;
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    // Public methods for external use
    pause() {
        this.pauseAutoPlay();
    }
    
    play() {
        this.startAutoPlay();
    }
    
    getCurrentSlide() {
        return this.currentSlide + 1;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.carouselManager = new CarouselManager();
    
    // Check URL hash for initial slide
    const hash = window.location.hash;
    if (hash && hash.includes('slide=')) {
        const slideNumber = parseInt(hash.split('=')[1]);
        setTimeout(() => {
            if (window.carouselManager) {
                window.carouselManager.goToSlide(slideNumber);
            }
        }, 100);
    }
});

// Global functions for backward compatibility
function showSlide(slideNumber) {
    if (window.carouselManager) {
        window.carouselManager.goToSlide(slideNumber);
    }
}

function nextSlide() {
    if (window.carouselManager) {
        window.carouselManager.nextSlide();
    }
}

function previousSlide() {
    if (window.carouselManager) {
        window.carouselManager.previousSlide();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarouselManager;
}
