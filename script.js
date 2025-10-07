document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'admin-login') {
                document.getElementById('admin-login-modal').classList.remove('hidden');
            } else if (targetId === 'cart-icon') {
                document.getElementById('cart-modal').classList.remove('hidden');
                displayCart();
            } else {
                const targetElement = document.getElementById(targetId);
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cart System
    let cart = [];
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            cart.push({ name, price });
            updateCartCount();
        });
    });

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.length;
    }

    function displayCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartItems.appendChild(li);
            total += item.price;
        });
        document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
    }

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your order! Total: $' + cart.reduce((sum, item) => sum + item.price, 0).toFixed(2) + '. Please visit or call to complete your purchase.');
            cart = [];
            updateCartCount();
            document.getElementById('cart-modal').classList.add('hidden');
            document.getElementById('cart-items').innerHTML = '';
            document.getElementById('cart-total').textContent = 'Total: $0.00';
        } else {
            alert('Your cart is empty.');
        }
    });

    document.getElementById('close-cart-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('hidden');
    });

    // Admin Login
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminCloseBtn = document.getElementById('admin-close-btn');
    const adminPanel = document.getElementById('admin-panel');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    const adminUsername = 'admin';
    const adminPassword = 'mellow123';

    adminLoginBtn.addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        if (username === adminUsername && password === adminPassword) {
            adminLoginModal.classList.add('hidden');
            adminPanel.classList.remove('hidden');
        } else {
            alert('Invalid username or password.');
        }
    });

    adminCloseBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
    });

    adminLogoutBtn.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });

    // Contact form submission
    document.querySelector('#contact button[type="submit"]').addEventListener('click', () => {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        if (name && email && message) {
            alert('Thank you for your message! We will get back to you soon at ' + email + ' (as of 12:51 PM PKT, October 07, 2025).');
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-message').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Reservation form submission
    document.getElementById('reservation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('res-name').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;
        
        if (name && date && time && guests) {
            alert('Reservation confirmed for ' + name + ' on ' + date + ' at ' + time + ' for ' + guests + ' guests. We will contact you soon (as of 12:51 PM PKT, October 07, 2025).');
            document.getElementById('res-name').value = '';
            document.getElementById('res-date').value = '';
            document.getElementById('res-time').value = '';
            document.getElementById('res-guests').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Admin Panel - Add Menu Item
    document.getElementById('add-menu-item').addEventListener('click', () => {
        const name = document.getElementById('menu-item-name').value;
        const desc = document.getElementBy
