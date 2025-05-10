document.addEventListener('DOMContentLoaded', () => {
    // Lazy-Load Backgrounds
    const bgElements = document.querySelectorAll('[data-bg]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.background = entry.target.dataset.bg;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    bgElements.forEach(el => observer.observe(el));

    // Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Smooth Scroll
    document.querySelectorAll('.nav-link, .btn[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            if (link.classList.contains('nav-link')) link.classList.add('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Active Section Highlight with Debounce
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let timeout;
    const updateActiveSection = () => {
        const scrollY = window.scrollY;
        sections.forEach((section, index) => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateActiveSection, 50);
    }, { passive: true });

    // Quote Form Submission
    const form = document.getElementById('quote-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const successMessage = form.querySelector('.form-success');
        const formData = new FormData(form);

        // Reset previous errors and success
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            group.querySelector('.form-error').textContent = '';
        });
        successMessage.classList.remove('active');
        successMessage.textContent = '';

        let isValid = true;

        // Validation
        if (!formData.get('name')) {
            const nameInput = form.querySelector('#name');
            nameInput.classList.add('error');
            nameInput.nextElementSibling.textContent = 'Name is required';
            isValid = false;
        }
        if (!formData.get('email')) {
            const emailInput = form.querySelector('#email');
            emailInput.classList.add('error');
            emailInput.nextElementSibling.textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
            const emailInput = form.querySelector('#email');
            emailInput.classList.add('error');
            emailInput.nextElementSibling.textContent = 'Enter a valid email';
            isValid = false;
        }
        if (!formData.get('phone')) {
            const phoneInput = form.querySelector('#phone');
            phoneInput.classList.add('error');
            phoneInput.nextElementSibling.textContent = 'Phone is required';
            isValid = false;
        } else if (!/^\+?\d{10,15}$/.test(formData.get('phone').replace(/\D/g, ''))) {
            const phoneInput = form.querySelector('#phone');
            phoneInput.classList.add('error');
            phoneInput.nextElementSibling.textContent = 'Enter a valid phone number';
            isValid = false;
        }
        if (!formData.get('project-type')) {
            const projectType = form.querySelector('#project-type');
            projectType.classList.add('error');
            projectType.nextElementSibling.textContent = 'Project type is required';
            isValid = false;
        }
        if (!formData.get('budget')) {
            const budget = form.querySelector('#budget');
            budget.classList.add('error');
            budget.nextElementSibling.textContent = 'Budget range is required';
            isValid = false;
        }
        if (!formData.get('timeline')) {
            const timelineGroup = form.querySelector('fieldset');
            timelineGroup.classList.add('error');
            timelineGroup.querySelector('.form-error').textContent = 'Timeline is required';
            isValid = false;
        }
        if (!formData.get('message')) {
            const messageInput = form.querySelector('#message');
            messageInput.classList.add('error');
            messageInput.nextElementSibling.textContent = 'Project details are required';
            isValid = false;
        }
        const file = formData.get('file');
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            const fileInput = form.querySelector('#file');
            fileInput.classList.add('error');
            fileInput.nextElementSibling.textContent = 'File size must be under 5MB';
            isValid = false;
        }

        if (!isValid) return;

        // Simulate submission
        submitButton.disabled = true;

        try {
            // Example: Using Formspree (replace with your endpoint)
            const response = await fetch('https://formspree.io/f/your-form-id', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Submission failed');

            form.reset();
            successMessage.textContent = 'Quote request submitted successfully! We’ll get back to you soon.';
            successMessage.classList.add('active');
        } catch (error) {
            successMessage.textContent = 'Submission failed. Please try again later.';
            successMessage.style.color = '#EF4444';
            successMessage.classList.add('active');
        } finally {
            submitButton.disabled = false;
        }
    });

    // Touch Swipe for Portfolio
    let touchStartX = 0, touchEndX = 0;
    const slider = document.querySelector('.portfolio-slider');
    if (slider) {
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            const threshold = slider.offsetWidth * 0.2;
            if (Math.abs(diff) > threshold) {
                const items = slider.querySelectorAll('.portfolio-item');
                const scrollX = slider.scrollLeft;
                let target;
                if (diff > 0) {
                    target = Array.from(items).find(i => i.offsetLeft > scrollX + 10);
                } else {
                    target = Array.from(items).findLast(i => i.offsetLeft < scrollX - 10);
                }
                if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        }, { passive: true });
    }

    // Scroll to Top
    const scrollTopBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});