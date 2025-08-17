// Professional Contact Form Management System
class ContactFormManager {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.isSubmitting = false;
        this.validationErrors = new Map();
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.submitButton = this.form.querySelector('button[type="submit"]');
            this.initializeForm();
            this.initializeValidation();
            this.initializeAutoSave();
            this.initializeCharacterCount();
        }
    }
    
    initializeForm() {
        // Add form submission handler
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Add real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
        
        // Add form reset handler
        this.form.addEventListener('reset', () => {
            this.clearAllErrors();
            this.clearAutoSavedData();
        });
    }
    
    initializeValidation() {
        // Custom validation rules
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^[\+]?[1-9][\d]{0,15}$/
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000
            }
        };
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        // Pattern validation
        else if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = this.getPatternErrorMessage(fieldName);
        }
        // Length validation
        else if (rules.minLength && value && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} must be at least ${rules.minLength} characters.`;
        }
        else if (rules.maxLength && value && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} must be no more than ${rules.maxLength} characters.`;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
            this.validationErrors.set(fieldName, errorMessage);
        } else {
            this.clearFieldError(field);
            this.validationErrors.delete(fieldName);
        }
        
        return isValid;
    }
    
    validateForm() {
        let isValid = true;
        
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class
        field.classList.add('input-error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'text-error text-sm mt-1 flex items-center gap-1';
        errorElement.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${message}
        `;
        
        // Insert error message after field
        field.parentNode.appendChild(errorElement);
        
        // Store reference for removal
        field.errorElement = errorElement;
    }
    
    clearFieldError(field) {
        field.classList.remove('input-error');
        if (field.errorElement) {
            field.errorElement.remove();
            field.errorElement = null;
        }
    }
    
    clearAllErrors() {
        this.form.querySelectorAll('.input-error').forEach(field => {
            this.clearFieldError(field);
        });
        this.validationErrors.clear();
    }
    
    getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    getPatternErrorMessage(fieldName) {
        const messages = {
            email: 'Please enter a valid email address.',
            phone: 'Please enter a valid phone number.',
            firstName: 'Please enter a valid first name (letters, spaces, hyphens, and apostrophes only).',
            lastName: 'Please enter a valid last name (letters, spaces, hyphens, and apostrophes only).'
        };
        return messages[fieldName] || 'Please enter a valid value.';
    }
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors above.', 'error');
            this.scrollToFirstError();
            return;
        }
        
        // Prepare form data
        const formData = new FormData(this.form);
        const submitData = Object.fromEntries(formData.entries());
        
        // Show loading state
        this.setSubmittingState(true);
        
        try {
            // Simulate API call
            await this.submitFormData(submitData);
            
            // Success
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            this.clearAutoSavedData();
            
        } catch (error) {
            // Error
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    async submitFormData(data) {
        // Simulate API call with delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true, message: 'Message sent successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    setSubmittingState(submitting) {
        this.isSubmitting = submitting;
        
        if (this.submitButton) {
            if (submitting) {
                this.submitButton.disabled = true;
                this.submitButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                `;
            } else {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = 'Send Message';
            }
        }
    }
    
    scrollToFirstError() {
        const firstError = this.form.querySelector('.input-error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstError.focus();
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-24 right-4 z-50 max-w-sm transition-all duration-300 transform translate-x-full`;
        
        const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info';
        notification.innerHTML = `
            <div class="alert ${alertClass} shadow-lg">
                <div>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' : 
                          type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
                          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'}
                    </svg>
                    <span>${message}</span>
                </div>
                <div class="flex-none">
                    <button class="btn btn-sm btn-ghost" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Auto-save functionality
    initializeAutoSave() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('input', () => {
                this.autoSaveField(field);
            });
        });
        
        // Restore saved data on page load
        this.restoreAutoSavedData();
    }
    
    autoSaveField(field) {
        const key = `contact_form_${field.name}`;
        const value = field.value;
        
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    }
    
    restoreAutoSavedData() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            const key = `contact_form_${field.name}`;
            const savedValue = localStorage.getItem(key);
            
            if (savedValue) {
                field.value = savedValue;
            }
        });
    }
    
    clearAutoSavedData() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            const key = `contact_form_${field.name}`;
            localStorage.removeItem(key);
        });
    }
    
    // Character count for message field
    initializeCharacterCount() {
        const messageField = this.form.querySelector('textarea[name="message"]');
        if (messageField) {
            const counter = document.createElement('div');
            counter.className = 'text-right text-sm text-base-content/60 mt-1';
            counter.textContent = '0 / 1000 characters';
            
            messageField.parentNode.appendChild(counter);
            
            messageField.addEventListener('input', () => {
                const length = messageField.value.length;
                const maxLength = 1000;
                counter.textContent = `${length} / ${maxLength} characters`;
                
                if (length > maxLength * 0.9) {
                    counter.classList.add('text-warning');
                } else {
                    counter.classList.remove('text-warning');
                }
                
                if (length > maxLength) {
                    counter.classList.add('text-error');
                } else {
                    counter.classList.remove('text-error');
                }
            });
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactFormManager = new ContactFormManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormManager;
}
