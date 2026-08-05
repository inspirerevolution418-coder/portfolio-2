// =====================================================================
// script.js — Premium Portfolio Interactivity
// Pure vanilla JavaScript, no dependencies.
// =====================================================================

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  setYear();
  initTheme();
  initStickyNavbar();
  initNavToggle();
  initScrollSpy();
  initScrollProgress();
  initRevealOnScroll();
  initTypingEffect();
  initCounters();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initCustomCursor();
  initParticles();
});

/* ---------------------------------------------------------------
   Loading screen — hides once the page is ready
--------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 350);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('is-hidden'), 2500);
}

/* ---------------------------------------------------------------
   Footer year
--------------------------------------------------------------- */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------
   Dark / Light theme toggle, persisted in localStorage
--------------------------------------------------------------- */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('portfolio-theme');

  if (saved) {
    body.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.setAttribute('data-theme', 'light');
  }

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ---------------------------------------------------------------
   Sticky / shrinking navbar on scroll
--------------------------------------------------------------- */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------
   Mobile hamburger menu
--------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------------
   Scroll-spy: highlight active nav link
--------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => spy.observe(s));
}

/* ---------------------------------------------------------------
   Scroll progress bar at the very top of the page
--------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------
   Fade-and-rise reveal animation for elements marked [data-reveal]
--------------------------------------------------------------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (prefersReduced) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => observer.observe(t));
}

/* ---------------------------------------------------------------
   Typing animation in the hero section.
   Edit the `roles` array to change what's typed.
--------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Software Engineer',
    'Web Developer',
    'Problem Solver',
    'AI Enthusiast',
    'Frontend Developer'
  ];

  if (prefersReduced) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }

  tick();
}

/* ---------------------------------------------------------------
   Animated number counters in the About section
--------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (prefersReduced) { el.textContent = target; return; }

    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---------------------------------------------------------------
   Animated skill progress bars — fill in when scrolled into view
--------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level || 0;
        entry.target.style.width = level + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
}

/* ---------------------------------------------------------------
   Contact form — client-side demo only.
   NOTE: does not send real email. To make it functional, connect it
   to Netlify Forms, Formspree, or EmailJS — see README.md.
--------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = '⚠ Please fill in every field.';
      note.style.color = '#F87171';
      return;
    }

    note.textContent = `✓ Thanks, ${name}! This demo form doesn't send email yet — see README.md to connect it.`;
    note.style.color = 'var(--success)';
    form.reset();
  });
}

/* ---------------------------------------------------------------
   Back-to-top button — appears after scrolling down
--------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 600);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

/* ---------------------------------------------------------------
   Custom cursor — only enabled on devices with a fine pointer (mouse)
--------------------------------------------------------------- */
function initCustomCursor() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!hasFinePointer || prefersReduced) return;

  document.body.classList.add('has-fine-pointer');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ringX = e.clientX;
    ringY = e.clientY;
  });

  function animateRing() {
    const currentLeft = parseFloat(ring.style.left) || ringX;
    const currentTop = parseFloat(ring.style.top) || ringY;
    ring.style.left = currentLeft + (ringX - currentLeft) * 0.18 + 'px';
    ring.style.top = currentTop + (ringY - currentTop) * 0.18 + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------------------
   Lightweight particle background — pure Canvas 2D, no libraries
--------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  if (prefersReduced) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = Math.min(70, Math.floor((width * height) / 22000));

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    };
  }
  particles = Array.from({ length: COUNT }, makeParticle);

  function isLight() {
    return document.body.getAttribute('data-theme') === 'light';
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const dotColor = isLight() ? 'rgba(99,102,241,0.45)' : 'rgba(139,92,246,0.55)';
    const lineColor = isLight() ? 'rgba(99,102,241,' : 'rgba(139,92,246,';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor + (1 - dist / 120) * 0.25 + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
