document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Contact form submission
    document.getElementById('submitContact').addEventListener('click', () => {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        if (name && email && message) {
            alert('Thank you for your message! We will get back to you soon.');
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-message').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Reservation form submission
    document.getElementById('submitReservation').addEventListener('click', () => {
        const name = document.getElementById('res-name').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;
        
        if (name && date && time && guests) {
            alert('Reservation confirmed! We will contact you to confirm details.');
            document.getElementById('res-name').value = '';
            document.getElementById('res-date').value = '';
            document.getElementById('res-time').value = '';
            document.getElementById('res-guests').value = '';
        } else {
            alert('Please fill out all fields.');
        }
    });
});
