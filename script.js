document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'admin-login') {
                document.getElementById('admin-login-modal').classList.remove('hidden');
            } else {
                const targetElement = document.getElementById(targetId);
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
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
            alert('Thank you for your message! We will get back to you soon at ' + email + '.');
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
            alert('Reservation confirmed for ' + name + ' on ' + date + ' at ' + time + ' for ' + guests + ' guests. We will contact you soon!');
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
        const desc = document.getElementById('menu-item-desc').value;
        const price = document.getElementById('menu-item-price').value;
        const image = document.getElementById('menu-item-image').value;

        if (name && desc && price && image) {
            const menuItems = document.getElementById('menu-items');
            const newItem = document.createElement('div');
            newItem.className = 'bg-gray-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-400 transform hover:-translate-y-6';
            newItem.innerHTML = `
                <img src="${image}" alt="${name}" class="w-full h-64 object-cover rounded-xl mb-6">
                <h3 class="text-3xl font-semibold text-green-700">${name}</h3>
                <p class="text-gray-600 mt-4">${desc}</p>
                <p class="text-2xl font-medium mt-4 text-yellow-600">${price}</p>
                <button class="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300">Add to Cart</button>
            `;
            menuItems.appendChild(newItem);
            document.getElementById('menu-item-name').value = '';
            document.getElementById('menu-item-desc').value = '';
            document.getElementById('menu-item-price').value = '';
            document.getElementById('menu-item-image').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Admin Panel - Add Deal
    document.getElementById('add-deal').addEventListener('click', () => {
        const name = document.getElementById('deal-name').value;
        const desc = document.getElementById('deal-desc').value;
        const price = document.getElementById('deal-price').value;

        if (name && desc && price) {
            const dealItems = document.getElementById('deal-items');
            const newDeal = document.createElement('div');
            newDeal.className = 'bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-400';
            newDeal.innerHTML = `
                <h3 class="text-3xl font-semibold text-green-700">${name}</h3>
                <p class="text-gray-600 mt-4">${desc}</p>
                <p class="text-2xl font-medium mt-4 text-yellow-600">${price}</p>
                <button class="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300">Grab Deal</button>
            `;
            dealItems.appendChild(newDeal);
            document.getElementById('deal-name').value = '';
            document.getElementById('deal-desc').value = '';
            document.getElementById('deal-price').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });
});
