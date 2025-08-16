// Carousel functionality for Photography Portfolio

let currentSlide = 1;
const totalSlides = 3;

function nextSlide() {
    currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = currentSlide <= 1 ? totalSlides : currentSlide - 1;
    showSlide(currentSlide);
}

function showSlide(slideNumber) {
    // Hide all slides
    for (let i = 1; i <= totalSlides; i++) {
        const slide = document.getElementById(`slide${i}`);
        if (slide) {
            slide.style.display = 'none';
            slide.style.opacity = '0';
        }
    }
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide${slideNumber}`);
    if (currentSlideElement) {
        currentSlideElement.style.display = 'block';
        // Add a small delay for smooth transition
        setTimeout(() => {
            currentSlideElement.style.opacity = '1';
        }, 50);
    }
    
    // Update indicators
    updateIndicators(slideNumber);
    
    // Update current slide variable
    currentSlide = slideNumber;
}

function updateIndicators(activeSlide) {
    // Remove active class from all indicators
    document.querySelectorAll('.carousel-indicator').forEach(indicator => {
        indicator.classList.remove('opacity-100');
        indicator.classList.add('opacity-60');
    });
    
    // Add active class to current indicator
    const activeIndicator = document.querySelector(`[data-slide="${activeSlide}"]`);
    if (activeIndicator) {
        activeIndicator.classList.remove('opacity-60');
        activeIndicator.classList.add('opacity-100');
    }
}

// Auto-play carousel
function autoPlay() {
    setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    showSlide(1);
    autoPlay();
});
