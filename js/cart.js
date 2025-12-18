// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('silkspeed-cart')) || [];
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        countElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }
    
    addItem(product) {
        const existingItem = this.cart.find(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.cart.push({
                ...product,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Item added to cart!');
    }
    
    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }
    
    updateQuantity(index, quantity) {
        if (quantity < 1) {
            this.removeItem(index);
            return;
        }
        
        this.cart[index].quantity = quantity;
        this.saveCart();
        this.updateCartCount();
    }
    
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }
    
    saveCart() {
        localStorage.setItem('silkspeed-cart', JSON.stringify(this.cart));
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cart-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            }
            
            .cart-notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
    
    setupEventListeners() {
        // Handle add to cart buttons
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn) {
                e.preventDefault();
                
                // Get product data from data attributes or form
                const productCard = addToCartBtn.closest('.product-card, .product-detail');
                if (productCard) {
                    const product = {
                        id: addToCartBtn.dataset.productId || productCard.dataset.productId,
                        name: addToCartBtn.dataset.productName || productCard.querySelector('.product-title')?.textContent,
                        price: parseFloat(addToCartBtn.dataset.productPrice || 
                                         productCard.querySelector('.product-price')?.textContent.replace('$', '') || 0),
                        image: addToCartBtn.dataset.productImage || 
                               productCard.querySelector('.product-image img')?.src,
                        quantity: 1,
                        size: this.getSelectedSize(),
                        color: this.getSelectedColor()
                    };
                    
                    this.addItem(product);
                }
            }
        });
        
        // Handle cart page interactions
        if (window.location.pathname.includes('checkout.html') || 
            window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }
    
    getSelectedSize() {
        const sizeSelector = document.querySelector('.size-selector input:checked, .size-selector select');
        if (sizeSelector) {
            return sizeSelector.value || sizeSelector.textContent;
        }
        return null;
    }
    
    getSelectedColor() {
        const colorSelector = document.querySelector('.color-selector input:checked, .color-selector .selected');
        if (colorSelector) {
            return colorSelector.value || colorSelector.dataset.color;
        }
        return null;
    }
    
    renderCartPage() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.getElementById('empty-cart');
        const cartNotEmpty = document.getElementById('cart-not-empty');
        
        if (!cartContainer) return;
        
        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartNotEmpty) cartNotEmpty.style.display = 'none';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartNotEmpty) cartNotEmpty.style.display = 'block';
        
        // Render cart items
        cartContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                    ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-action="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input">
                    <button class="quantity-btn plus" data-action="increase">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="cart-item-remove" data-action="remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
        
        // Add event listeners to cart controls
        cartContainer.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            
            const index = parseInt(cartItem.dataset.index);
            const action = e.target.closest('[data-action]')?.dataset.action;
            
            switch(action) {
                case 'increase':
                    this.updateQuantity(index, this.cart[index].quantity + 1);
                    this.renderCartPage();
                    break;
                case 'decrease':
                    this.updateQuantity(index, this.cart[index].quantity - 1);
                    this.renderCartPage();
                    break;
                case 'remove':
                    this.removeItem(index);
                    this.renderCartPage();
                    break;
            }
        });
        
        // Handle quantity input changes
        cartContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const index = parseInt(cartItem.dataset.index);
                const quantity = parseInt(e.target.value);
                
                if (!isNaN(quantity) && quantity > 0) {
                    this.updateQuantity(index, quantity);
                    this.renderCartPage();
                }
            }
        });
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.silkspeedCart = new ShoppingCart();
});