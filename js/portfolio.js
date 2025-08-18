// Professional Portfolio Management System
class PortfolioManager {
    constructor() {
        this.currentFilter = 'all';
        this.portfolioItems = [];
        this.modal = null;
        this.currentImageIndex = 0;
        this.images = [];
        
        this.init();
    }
    
    init() {
        this.initializePortfolio();
        this.initializeFilters();
        this.initializeModal();
        this.initializeKeyboardNavigation();
        this.initializeTouchGestures();
        this.initializeLazyLoading();
        this.initializeAlbumTabs();
    }

    initializeAlbumTabs() {
        const tabs = document.querySelectorAll('.album-tab');
        const panels = document.querySelectorAll('.album-panel');
        if (!tabs.length || !panels.length) return;
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                // update active tab
                tabs.forEach(t => t.classList.remove('tab-active'));
                tab.classList.add('tab-active');
                // toggle panels
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.remove('hidden');
                    } else {
                        panel.classList.add('hidden');
                    }
                });
            });
        });
    }
    
    initializePortfolio() {
        // Get all portfolio items
        const allowedCategories = new Set(['nature', 'portrait', 'street']);
        const allItems = Array.from(document.querySelectorAll('.portfolio-item'));

        // Remove any item that does not belong to one of the three allowed albums
        allItems.forEach(item => {
            const itemCategories = (item.dataset.category || '').split(' ');
            const belongsToAllowedAlbum = itemCategories.some(cat => allowedCategories.has(cat));
            if (!belongsToAllowedAlbum && item.parentElement) {
                item.remove();
            }
        });

        // Re-query remaining items (only 3 albums)
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.images = Array.from(this.portfolioItems).map(item => ({
            id: item.dataset.category?.split(' ')[0] || 'unknown',
            title: item.querySelector('img')?.alt || 'Untitled',
            category: item.dataset.category || 'other',
            element: item
        }));
        
        // Add click event listeners
        this.portfolioItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openModal(index);
            });
            
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                this.addHoverEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeHoverEffect(item);
            });
        });
    }
    
    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterPortfolio(category);
                this.updateActiveFilter(button);
            });
        });
        
        // Initialize with 'all' filter
        this.updateActiveFilter(document.querySelector('[data-category="all"]'));
    }
    
    filterPortfolio(category) {
        this.currentFilter = category;
        
        this.portfolioItems.forEach(item => {
            const itemCategories = item.dataset.category?.split(' ') || [];
            const shouldShow = category === 'all' || itemCategories.includes(category);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.classList.add('animate-in');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update URL hash for bookmarking
        if (category !== 'all') {
            window.location.hash = `filter=${category}`;
        } else {
            window.location.hash = '';
        }
        
        // Animate filter change
        this.animateFilterChange();
    }
    
    updateActiveFilter(activeButton) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
        
        // Add active class to clicked button
        if (activeButton) {
            activeButton.classList.remove('btn-outline');
            activeButton.classList.add('btn-primary');
        }
    }
    
    animateFilterChange() {
        const container = document.querySelector('.columns-1');
        if (container) {
            container.style.opacity = '0.5';
            container.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    initializeModal() {
        this.modal = document.getElementById('image-modal');
        
        if (this.modal) {
            // Close modal on backdrop click
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
            
            // Close modal on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.open) {
                    this.closeModal();
                }
            });
        }
    }
    
    openModal(imageIndex) {
        if (!this.modal || imageIndex < 0 || imageIndex >= this.images.length) return;
        
        this.currentImageIndex = imageIndex;
        const imageData = this.images[imageIndex];
        const img = imageData.element.querySelector('img');
        
        // Update modal content
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalCategory = document.getElementById('modal-category');
        
        if (modalImage && modalTitle && modalCategory) {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = imageData.title;
            modalCategory.textContent = imageData.category;
            
            // Add loading state
            modalImage.style.opacity = '0';
            modalImage.onload = () => {
                modalImage.style.transition = 'opacity 0.3s ease-in-out';
                modalImage.style.opacity = '1';
            };
        }
        
        // Show modal with animation
        this.modal.showModal();
        this.modal.classList.add('modal-open');
        
        // Add navigation arrows
        this.addModalNavigation();
        
        // Update body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('modal-open');
            this.modal.close();
            
            // Remove navigation arrows
            this.removeModalNavigation();
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }
    
    addModalNavigation() {
        const modalContent = this.modal.querySelector('.modal-box');
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-circle btn-sm bg-black bg-opacity-50 text-white border-none absolute top-1/2 left-4 transform -translate-y-1/2 z-20';
        prevBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        `;
        prevBtn.addEventListener('click', () => this.navigateModal(-1));
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-circle btn-sm bg-black bg-opacity-50 text-white border-none absolute top-1/2 right-4 transform -translate-y-1/2 z-20';
        nextBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        `;
        nextBtn.addEventListener('click', () => this.navigateModal(1));
        
        // Image counter
        const counter = document.createElement('div');
        counter.className = 'absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm';
        counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
        
        modalContent.appendChild(prevBtn);
        modalContent.appendChild(nextBtn);
        modalContent.appendChild(counter);
        
        // Store references for removal
        this.modalNavElements = [prevBtn, nextBtn, counter];
    }
    
    removeModalNavigation() {
        if (this.modalNavElements) {
            this.modalNavElements.forEach(element => {
                if (element.parentElement) {
                    element.remove();
                }
            });
            this.modalNavElements = null;
        }
    }
    
    navigateModal(direction) {
        const newIndex = this.currentImageIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.images.length) {
            this.openModal(newIndex);
        }
    }
    
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal || !this.modal.open) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigateModal(-1);
                    break;
                case 'ArrowRight':
                    this.navigateModal(1);
                    break;
                case 'Escape':
                    this.closeModal();
                    break;
            }
        });
    }
    
    initializeTouchGestures() {
        let startX = 0;
        let startY = 0;
        
        this.modal?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.modal?.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe threshold
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.navigateModal(1); // Swipe left -> next
                } else {
                    this.navigateModal(-1); // Swipe right -> previous
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    addHoverEffect(item) {
        item.style.transform = 'scale(1.02)';
        item.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }
    
    removeHoverEffect(item) {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = '';
    }
    
    // Public methods for external use
    filterByCategory(category) {
        this.filterPortfolio(category);
    }
    
    openImageModal(imageId) {
        const index = this.images.findIndex(img => img.id === imageId);
        if (index !== -1) {
            this.openModal(index);
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
    
    // Check URL hash for initial filter
    const hash = window.location.hash;
    if (hash && hash.includes('filter=')) {
        const category = hash.split('=')[1];
        setTimeout(() => {
            window.portfolioManager.filterByCategory(category);
        }, 100);
    }
});

// Global functions for backward compatibility
function openModal(imageId, title, category) {
    if (window.portfolioManager) {
        window.portfolioManager.openImageModal(imageId);
    }
}

function closeModal() {
    if (window.portfolioManager) {
        window.portfolioManager.closeModal();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}
