// Persistent Shopping Cart Logic
let cart = loadCartFromLocalStorage();
let total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

// Helper Functions for Error Handling
function saveCartToLocalStorage(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const loadedCart = JSON.parse(localStorage.getItem('cart')) || [];
        loadedCart.forEach(item => {
            if (!item.quantity) item.quantity = 1;
        });
        return loadedCart;
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
    }
}

// Add to Cart Button Click Event
document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.parentElement;
        const name = product.querySelector('h3').innerText;
        const price = parseFloat(product.querySelector('p').innerText.replace('$', ''));
        const quantity = parseInt(product.querySelector('input[type="number"]').value);

        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        saveCartToLocalStorage(cart);
        updateCart();
    });
});

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            ${item.name} 
            <input type="number" value="${item.quantity}" min="1" class="cart-quantity">
            - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeItem('${item.name}')">Remove</button>
        `;

        const quantityInput = itemElement.querySelector('.cart-quantity');
        quantityInput.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value);
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                saveCartToLocalStorage(cart);
                updateCart();
            } else {
                event.target.value = item.quantity;
            }
        });

        cartItems.appendChild(itemElement);
    });

    cartTotal.innerText = total.toFixed(2);
}

// Remove Item Function
function removeItem(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        saveCartToLocalStorage(cart);
        updateCart();
    }
}

// Clear Cart Function
function clearCart() {
    cart = [];
    total = 0;
    saveCartToLocalStorage(cart);
    updateCart();
}

// Initialize Cart on Page Load
updateCart();

// Filter Products by Category
document.getElementById('category-filter').addEventListener('change', (event) => {
    const category = event.target.value;
    document.querySelectorAll('.product').forEach(product => {
        const productCategory = product.getAttribute('data-category');
        product.style.display = (category === 'all' || productCategory === category) ? 'block' : 'none';
    });
});

// Real-Time Search Functionality
document.querySelector('.search-bar input').addEventListener('input', () => {
    const query = document.querySelector('.search-bar input').value.toLowerCase();
    document.querySelectorAll('.product').forEach(product => {
        const productName = product.querySelector('h3').innerText.toLowerCase();
        product.style.display = productName.includes(query) ? 'block' : 'none';
    });
});