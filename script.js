
// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

function toggleMenu() {
    navContainer.classList.toggle('active');
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
        navLinks.querySelector('a').focus();
    }
}

// Back to Top Button
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTop.style.display = 'block';
        backToTop.style.opacity = '1';
    } else {
        backToTop.style.opacity = '0';
        setTimeout(() => backToTop.style.display = 'none', 300);
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fade-in animation on scroll
const fadeInElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

fadeInElements.forEach(el => observer.observe(el));