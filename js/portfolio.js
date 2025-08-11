// Portfolio functionality for Photography Portfolio

// Portfolio filtering
function initializePortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline');
            });
            button.classList.remove('btn-outline');
            button.classList.add('btn-primary');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategories = item.getAttribute('data-category').split(' ');
                    if (itemCategories.includes(category)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Image data for modal
const imageData = {
    'nature-1': {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        title: 'Mountain Landscape',
        category: 'Nature Photography'
    },
    'nature-2': {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=1000&fit=crop',
        title: 'Forest Path',
        category: 'Nature Photography'
    },
    'nature-3': {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
        title: 'Ocean Waves',
        category: 'Nature Photography'
    },
    'nature-4': {
        src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&h=800&fit=crop',
        title: 'Wildlife Portrait',
        category: 'Nature Photography'
    },
    'nature-5': {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        title: 'Sunset Silhouette',
        category: 'Nature Photography'
    },
    'portrait-1': {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1000&fit=crop',
        title: 'Professional Portrait',
        category: 'Portrait Photography'
    },
    'portrait-2': {
        src: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200&h=800&fit=crop',
        title: 'Creative Portrait',
        category: 'Portrait Photography'
    },
    'portrait-3': {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&h=1000&fit=crop',
        title: 'Studio Portrait',
        category: 'Portrait Photography'
    },
    'portrait-4': {
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=1000&fit=crop',
        title: 'Fashion Portrait',
        category: 'Portrait Photography'
    },
    'street-1': {
        src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
        title: 'Urban Street',
        category: 'Street Photography'
    },
    'street-2': {
        src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
        title: 'City Life',
        category: 'Street Photography'
    },
    'street-3': {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
        title: 'Street People',
        category: 'Street Photography'
    },
    'arch-1': {
        src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1000&fit=crop',
        title: 'Modern Building',
        category: 'Architecture Photography'
    },
    'arch-2': {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        title: 'Historical Building',
        category: 'Architecture Photography'
    },
    'arch-3': {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
        title: 'Interior Design',
        category: 'Architecture Photography'
    },
    'abstract-1': {
        src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop',
        title: 'Abstract Art',
        category: 'Abstract Photography'
    },
    'abstract-2': {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        title: 'Geometric Patterns',
        category: 'Abstract Photography'
    },
    'event-1': {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop',
        title: 'Wedding Ceremony',
        category: 'Event Photography'
    },
    'event-2': {
        src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop',
        title: 'Corporate Event',
        category: 'Event Photography'
    },
    'product-1': {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
        title: 'Product Photography',
        category: 'Product Photography'
    },
    'macro-1': {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        title: 'Macro Nature',
        category: 'Macro Photography'
    },
    'bw-1': {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1000&fit=crop',
        title: 'Black & White Portrait',
        category: 'Black & White Photography'
    },
    'aerial-1': {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        title: 'Aerial Landscape',
        category: 'Aerial Photography'
    }
};

// Modal functionality
function openModal(imageId, title, category) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    
    const data = imageData[imageId];
    if (data) {
        modalImage.src = data.src;
        modalImage.alt = data.title;
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
    } else {
        modalImage.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop`;
        modalTitle.textContent = title;
        modalCategory.textContent = category;
    }
    
    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.close();
}

// Initialize portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioFiltering();
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});
