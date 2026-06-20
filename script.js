/* ============================================================
   Ali Ramah — Portfolio Scripts
   Particles, scroll reveal, tilt, glow tracking, ripple, nav
   ============================================================ */
 
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initParticles();
  initCursorGlow();
  initScrollReveal();
  initCardTilt();
  initGlowBorder();
  initRippleButtons();
  initBackToTop();
  initActiveNavLink();
});
 
/* ---------------------------------------------------------
   Navbar — background on scroll
--------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
 
/* ---------------------------------------------------------
   Mobile hamburger menu
--------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu-mobile');
  if (!toggle || !menu) return;
 
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });
 
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}
 
/* ---------------------------------------------------------
   Highlight active section link while scrolling (index only)
--------------------------------------------------------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a, .nav-menu-mobile a');
  if (!sections.length || !links.length) return;
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
 
  sections.forEach((section) => observer.observe(section));
}
 
/* ---------------------------------------------------------
   Floating particle background (lightweight canvas)
--------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const colors = ['#00D4FF', '#4F46E5', '#00FFB2'];
 
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
 
  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }
 
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
 
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
 
  resize();
  createParticles();
  animate();
 
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });
}
 
/* ---------------------------------------------------------
   Mouse-tracking ambient glow
--------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}
 
/* ---------------------------------------------------------
   Scroll reveal via IntersectionObserver
--------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
 
  revealEls.forEach((el) => observer.observe(el));
}
 
/* ---------------------------------------------------------
   3D tilt effect on nav cards / project cards
--------------------------------------------------------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;
 
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
 
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}
 
/* ---------------------------------------------------------
   Glow-border tracking (per-card mouse position -> CSS vars)
--------------------------------------------------------- */
function initGlowBorder() {
  const els = document.querySelectorAll('.glow-border');
  els.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    });
  });
}
 
/* ---------------------------------------------------------
   Button ripple effect
--------------------------------------------------------- */
function initRippleButtons() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}
 
/* ---------------------------------------------------------
   Back-to-top button
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
 
  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('show', window.scrollY > 400);
    },
    { passive: true }
  );
 
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
 
/* ---------------------------------------------------------
   Certifications page — search & filter (only runs if present)
--------------------------------------------------------- */
function initCertFilters() {
  const searchInput = document.getElementById('certSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  if (!certCards.length) return;
 
  let activeCategory = 'all';
 
  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    certCards.forEach((card) => {
      const title = card.dataset.title?.toLowerCase() || '';
      const category = card.dataset.category || 'all';
      const matchesQuery = title.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      card.style.display = matchesQuery && matchesCategory ? '' : 'none';
    });
  }
 
  searchInput?.addEventListener('input', applyFilters);
 
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });
}
document.addEventListener('DOMContentLoaded', initCertFilters);
 
