/* ============================================================================
   IDIE CRAFT DESAIN — Interaksi Landing Page
   File: assets/js/main.js

   Isi:
   1.  Helper
   2.  Header: efek scroll + progress bar + tombol ke atas
   3.  Smooth scroll dengan offset header
   4.  Menu mobile
   5.  Reveal on scroll (IntersectionObserver)
   6.  Animasi angka statistik
   7.  Tilt 3D pada kartu showcase
   8.  Cursor glow
   9.  Slider testimoni
   10. Accordion FAQ
   11. Highlight menu aktif
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. HELPER
     -------------------------------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);


  /* --------------------------------------------------------------------------
     2. HEADER, PROGRESS BAR, TOMBOL KE ATAS
     -------------------------------------------------------------------------- */
  const header     = $('#siteHeader');
  const progressEl = $('.scroll-progress span');
  const toTopBtn   = $('#toTop');

  let lastScroll = -1;
  let ticking = false;

  function onScrollFrame() {
    const y = window.scrollY;

    // header mengecil setelah 40px
    if (header) header.classList.toggle('is-scrolled', y > 40);

    // progress bar
    if (progressEl) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (y / docH) * 100 : 0;
      progressEl.style.width = clamp(pct, 0, 100) + '%';
    }

    // tombol ke atas muncul setelah 1 layar
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', y > window.innerHeight * 0.75);

    // highlight menu aktif
    updateActiveLink(y);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }


  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLL DENGAN OFFSET HEADER
     (CSS sudah pakai scroll-behavior, ini hanya penyesuaian offset + fallback)
     -------------------------------------------------------------------------- */
  function headerOffset() {
    return header ? header.offsetHeight + 12 : 80;
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });


  /* --------------------------------------------------------------------------
     4. MENU MOBILE
     -------------------------------------------------------------------------- */
  const navToggle = $('#navToggle');
  const nav       = $('#primaryNav');

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // tutup kalau klik di luar
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeMenu();
    });

    // tutup dengan Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // tutup kalau layar dibesarkan ke desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }


  /* --------------------------------------------------------------------------
     5. REVEAL ON SCROLL
     -------------------------------------------------------------------------- */
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }


  /* --------------------------------------------------------------------------
     6. ANIMASI ANGKA STATISTIK
     -------------------------------------------------------------------------- */
  const counters = $$('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    // kalau user minta tanpa animasi, langsung set angka final
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }


  /* --------------------------------------------------------------------------
     7. TILT 3D PADA KARTU SHOWCASE HERO
     -------------------------------------------------------------------------- */
  const tiltEl = $('.tilt');

  if (tiltEl && isFinePointer && !reduceMotion) {
    let raf = null;

    tiltEl.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = tiltEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tiltEl.style.transform =
          `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateZ(0)`;
        raf = null;
      });
    });

    tiltEl.addEventListener('mouseleave', () => {
      tiltEl.style.transform = 'rotateY(0) rotateX(0)';
    });
  }


  /* --------------------------------------------------------------------------
     8. CURSOR GLOW
     -------------------------------------------------------------------------- */
  const glow = $('.cursor-glow');

  if (glow && isFinePointer && !reduceMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let cx = gx, cy = gy;

    window.addEventListener('mousemove', (e) => {
      gx = e.clientX;
      gy = e.clientY;
      glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    (function loop() {
      // gerak halus (lerp) biar tidak kaku
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }


  /* --------------------------------------------------------------------------
     9. SLIDER TESTIMONI
     -------------------------------------------------------------------------- */
  const slider       = $('#testimonialSlider');
  const track        = slider ? $('.slider-track', slider) : null;
  const slides       = slider ? $$('.slide', slider) : [];
  const dotsWrap     = $('#sliderDots');
  const navBtns      = slider ? $$('.slider-btn', slider) : [];

  if (slider && track && slides.length) {
    let index = 0;
    let autoTimer = null;

    // bikin dot sesuai jumlah slide
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;

      if (dotsWrap) {
        $$('button', dotsWrap).forEach((d, di) => {
          d.classList.toggle('is-active', di === index);
        });
      }
      restartAuto();
    }

    navBtns.forEach((btn) => {
      btn.addEventListener('click', () => goTo(index + Number(btn.dataset.dir)));
    });

    // geser pakai sentuhan di HP
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // autoplay, berhenti saat kursor di atas slider
    function startAuto() {
      if (reduceMotion) return;
      autoTimer = setInterval(() => goTo(index + 1), 6500);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }
    function restartAuto() {
      stopAuto();
      startAuto();
    }

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    startAuto();
  }


  /* --------------------------------------------------------------------------
     10. ACCORDION FAQ
     -------------------------------------------------------------------------- */
  $$('.faq-item').forEach((item) => {
    const btn = $('.faq-q', item);
    const panel = $('.faq-a', item);
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // tutup semua (biar rapi, hanya satu yang terbuka)
      $$('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        const ob = $('.faq-q', other);
        const op = $('.faq-a', other);
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.style.maxHeight = '0px';
      });

      // buka yang diklik kalau sebelumnya tertutup
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // kalau layar berubah ukuran, tinggi panel yang terbuka disesuaikan
  window.addEventListener('resize', () => {
    $$('.faq-item.is-open .faq-a').forEach((panel) => {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });


  /* --------------------------------------------------------------------------
     11. HIGHLIGHT MENU AKTIF
     -------------------------------------------------------------------------- */
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href');
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function updateActiveLink(y) {
    if (!sections.length) return;

    let current = null;
    const line = y + headerOffset() + 80;

    sections.forEach((sec) => {
      if (sec.offsetTop <= line) current = sec;
    });

    navLinks.forEach((link) => {
      const active = current && link.getAttribute('href') === '#' + current.id;
      link.classList.toggle('is-active', Boolean(active));
    });
  }


  /* --------------------------------------------------------------------------
     INIT
     -------------------------------------------------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // jalankan sekali saat load supaya posisi awal benar
  onScrollFrame();
})();
