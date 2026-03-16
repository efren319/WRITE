/* =============================================================
   SCROLLING REPORT TEMPLATE — script.js
   =============================================================
   Lightweight vanilla JS powering:
     1. Scroll-triggered fade/slide animations (IntersectionObserver)
     2. Animated stat counters
     3. Animated bar chart fills
     4. Reading-progress bar
     5. Sticky nav background
     6. Mobile nav toggle
     7. Smooth-scroll anchor links
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ─────────────────────────────────────────────
     1. SCROLL-TRIGGERED ANIMATIONS
     Uses IntersectionObserver to add .is-visible
     when elements enter the viewport.
  ───────────────────────────────────────────── */
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale'
  );

  const observerOptions = {
    root: null,            // viewport
    rootMargin: '0px 0px -60px 0px',  // triggers slightly before fully in view
    threshold: 0.15,       // 15 % visible
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animationObserver.unobserve(entry.target); // animate only once
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => animationObserver.observe(el));

  /* ─────────────────────────────────────────────
     2. ANIMATED STAT COUNTERS
     Elements with data-count-to="80" will count
     from 0 to 80 when visible.
  ───────────────────────────────────────────── */
  const counterElements = document.querySelectorAll('[data-count-to]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach((el) => counterObserver.observe(el));

  /**
   * Smoothly counts from 0 to `target`, appending a "%" sign.
   * EDIT: Remove the "%" or change suffix below if your numbers aren't percentages.
   */
  function animateCounter(el, target) {
    const duration = 1600; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     3. ANIMATED BAR-CHART FILLS
     Each .bar-stat__fill uses a CSS variable
     --target-width set via inline style.
  ───────────────────────────────────────────── */
  const barFills = document.querySelectorAll('.bar-stat__fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = getComputedStyle(fill).getPropertyValue('--target-width').trim();
        fill.style.width = targetWidth;
        fill.classList.add('is-visible');
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  barFills.forEach((fill) => barObserver.observe(fill));

  /* ─────────────────────────────────────────────
     4. READING PROGRESS BAR
     Fills the thin bar at the top of the page
     as the user scrolls through the document.
  ───────────────────────────────────────────── */
  const progressBar = document.getElementById('progressBar');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─────────────────────────────────────────────
     5. STICKY NAV BACKGROUND
     Adds .is-scrolled to nav after scrolling
     past 80 px from the top.
  ───────────────────────────────────────────── */
  const siteNav = document.getElementById('siteNav');

  function updateNav() {
    siteNav.classList.toggle('is-scrolled', window.scrollY > 80);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load

  /* ─────────────────────────────────────────────
     6. MOBILE NAV TOGGLE
  ───────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
  });

  // close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-active');
      navLinks.classList.remove('is-open');
    });
  });

  /* ─────────────────────────────────────────────
     7. SMOOTH-SCROLL ANCHOR LINKS
     Handles <a href="#section"> with an offset
     for the fixed nav.
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // skip bare "#"
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = siteNav.offsetHeight;
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });

  /* ─────────────────────────────────────────────
     8. PARALLAX-LITE (optional subtle effect)
     Moves the hero background image slightly
     slower than scroll for depth.
  ───────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }
});
