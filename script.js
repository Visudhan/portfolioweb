/* ═══════════════════════════════════════════════════════════════
   script.js — Portfolio interactions
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── DOM References ────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    const reveals = document.querySelectorAll('.reveal');
    const taglineEl = document.getElementById('taglineRotate');
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    /* ── Typed / Text-Rotate Effect ────────────────── */
    const titles = [
        'Backend Developer in Progress',
        'Python & Django Enthusiast',
        'CS Student & Builder',
        'AI-Powered Dev Explorer',
    ];
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 70;
    const DELETE_SPEED = 40;
    const PAUSE_END = 1800;
    const PAUSE_DELETE = 600;

    function typeLoop() {
        const current = titles[titleIdx];
        if (!isDeleting) {
            taglineEl.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(typeLoop, PAUSE_END);
                return;
            }
            setTimeout(typeLoop, TYPE_SPEED);
        } else {
            taglineEl.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(typeLoop, PAUSE_DELETE);
                return;
            }
            setTimeout(typeLoop, DELETE_SPEED);
        }
    }
    typeLoop();

    /* ── Navbar: shrink on scroll ──────────────────── */
    let lastScroll = 0;
    function handleScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        lastScroll = y;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    /* ── Navbar: mobile toggle ─────────────────────── */
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    /* ── Active nav-link highlight ─────────────────── */
    function highlightNav() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        allLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    /* ── Intersection Observer: reveal on scroll ───── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger for sibling reveals
                    setTimeout(() => entry.target.classList.add('active'), i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));

    /* ── Contact form (client-side only) ───────────── */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        // Basic validation
        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all fields.';
            formStatus.className = 'form-status error';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            formStatus.textContent = 'Please enter a valid email.';
            formStatus.className = 'form-status error';
            return;
        }

        // Simulate send
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.textContent = 'Sending…';

        setTimeout(() => {
            formStatus.textContent = 'Message sent! I\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            form.reset();
            btn.disabled = false;
            btn.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
        }, 1200);
    });

})();
