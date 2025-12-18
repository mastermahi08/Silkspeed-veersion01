// Main JavaScript for SilkSpeed Website

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Search Toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchBar.classList.toggle('active');
        });
        
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchBar.classList.remove('active');
            });
        }
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (menuToggle) menuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Image lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (this.validateEmail(email)) {
                // Simulate form submission
                emailInput.value = '';
                this.innerHTML = '<p class="success-message">Thank you for subscribing! Check your email for the 10% discount code.</p>';
                
                // In production, you would send this to your backend
                console.log('Newsletter subscription:', email);
            } else {
                this.classList.add('error');
                setTimeout(() => this.classList.remove('error'), 3000);
            }
        });
        
        // Email validation helper
        newsletterForm.validateEmail = function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };
    }
    
    // Product Card Hover Effects
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Testimonial Slider (Simple Auto-rotate)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider && window.innerWidth > 768) {
        let currentSlide = 0;
        const slides = testimonialSlider.children;
        const totalSlides = slides.length;
        
        function rotateTestimonials() {
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Simple fade effect
            slides.forEach((slide, index) => {
                slide.style.opacity = index === currentSlide ? '1' : '0.5';
                slide.style.transform = index === currentSlide ? 'scale(1.02)' : 'scale(1)';
            });
        }
        
        // Initialize
        slides.forEach((slide, index) => {
            slide.style.transition = 'all 0.5s ease';
            slide.style.opacity = index === 0 ? '1' : '0.5';
        });
        
        // Auto rotate every 5 seconds
        setInterval(rotateTestimonials, 5000);
    }
    
    // Add to Cart Button Animation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            
            // Add animation class
            button.classList.add('adding');
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + 1;
                cartCount.classList.add('pulse');
                
                // Remove pulse animation class
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 300);
            }
            
            // Remove animation class
            setTimeout(() => {
                button.classList.remove('adding');
            }, 600);
        }
    });
    
    // Sticky Header
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
    
    // Form Validation
    const forms = document.querySelectorAll('form:not(.newsletter-form)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Remove error class after 3 seconds
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 3000);
                } else {
                    input.classList.remove('error');
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('error');
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                this.classList.add('was-validated');
            }
        });
    });
    
    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Initialize
    console.log('SilkSpeed website initialized successfully');
});

// Add CSS for back-to-top button
const backToTopCSS = `
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: var(--shadow);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background-color: var(--secondary-color);
    transform: translateY(-3px);
}

.tooltip {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
    z-index: 1000;
    pointer-events: none;
    white-space: nowrap;
}

.cart-count.pulse {
    animation: pulse 0.3s ease;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.add-to-cart.adding {
    animation: addToCart 0.6s ease;
}

@keyframes addToCart {
    0% { transform: scale(1); }
    50% { transform: scale(0.9); }
    100% { transform: scale(1); }
}

form .error {
    border-color: #ff4444 !important;
}

.success-message {
    color: #4CAF50;
    text-align: center;
    padding: 10px;
    background-color: rgba(76, 175, 80, 0.1);
    border-radius: var(--radius);
}

.header.scroll-down {
    transform: translateY(-100%);
}

.header.scroll-up {
    transform: translateY(0);
    box-shadow: var(--shadow);
}
`
// Product Detail Page Enhancements (if on product page)
if (document.querySelector('.product-detail')) {
    // Zoom image on hover
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Size guide modal (simplified)
    const sizeGuideLinks = document.querySelectorAll('.size-guide-link');
    sizeGuideLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#size-guide') {
                e.preventDefault();
                const sizeGuide = document.getElementById('size-guide');
                if (sizeGuide) {
                    sizeGuide.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
};


// Inject CSS
const style = document.createElement('style');
style.textContent = backToTopCSS;
document.head.appendChild(style);

/* ============================= */
/* COOKIE POLICY & CONSENT LOGIC */
/* ============================= */

(function () {
    const CONSENT_KEY = 'silkspeed_cookie_consent';

    function getConsent() {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function setConsent(data) {
        data.updatedAt = new Date().toISOString();
        localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    }

    document.addEventListener('DOMContentLoaded', function () {

        /* -------- Cookie Policy Page -------- */
        const policyDate = document.getElementById('policy-date');
        if (policyDate) {
            policyDate.textContent = new Date().toLocaleDateString();
        }

        const openSettingsBtn = document.getElementById('open-cookie-settings');
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', function () {
                // Future: open cookie preference modal
                alert(
                    'Cookie preferences can be managed using the cookie consent banner.'
                );
            });
        }

        /* -------- Cookie Banner Check (Future-ready) -------- */
        const consent = getConsent();
        if (!consent) {
            // Banner will be injected here later
            // showCookieBanner();
        }
    });

    /* -------- Public API (for future banner) -------- */
    window.CookieConsentAPI = {
        get: getConsent,
        set: setConsent,
        clear: function () {
            localStorage.removeItem(CONSENT_KEY);
        }
    };

})();

/* ============================= */
/* ORDER TRACKING LOGIC */
/* ============================= */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tracking-form');
    const resultSection = document.getElementById('tracking-result');
    const trackingDisplay = document.getElementById('display-tracking');
    const lastUpdated = document.getElementById('last-updated');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const trackingNumber = document
            .getElementById('tracking-number')
            .value
            .trim();

        if (!trackingNumber) return;

        // FRONTEND DISPLAY (17TRACK handled externally or via iframe/API later)
        trackingDisplay.textContent = trackingNumber;
        lastUpdated.textContent = new Date().toLocaleString();

        resultSection.hidden = false;

        // SCROLL INTO VIEW FOR UX
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // 🔗 BACKEND / 17TRACK API HOOK
        // fetch(`/api/track?number=${trackingNumber}`)
    });
});
