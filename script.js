// ===== Particle Canvas Background =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let mouse = { x: null, y: null };
let animationId;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.02;
        this.y -= dy * 0.02;
      }
    }

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  animationId = requestAnimationFrame(animateParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
}

// ===== Typing Effect =====
const typedText = document.getElementById('typedText');
const roles = [
  'Aspiring Java Developer',
  'Problem Solver',
  'Open to Internships'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeEffect() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 40;
  } else {
    typedText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 80;
  }

  if (!isDeleting && charIndex === current.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}

if (typedText) typeEffect();

// ===== Hero Name Letter Animation =====
function initNameAnimation() {
  const heroName = document.getElementById('heroName');
  if (!heroName) return;

  const text = heroName.textContent.trim();
  if (!text) return;

  heroName.textContent = '';
  heroName.setAttribute('aria-label', text);

  const chars = [...text];
  let revealedCount = 0;

  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.className = char === ' ' ? 'name-char name-space' : 'name-char';
    span.style.setProperty('--char-index', i);
    span.textContent = char === ' ' ? '\u00A0' : char;
    heroName.appendChild(span);

    span.addEventListener('animationend', (e) => {
      if (e.animationName === 'letterReveal') {
        revealedCount++;
        if (revealedCount === chars.length) {
          heroName.classList.add('all-revealed');
        }
      }
    });
  });

  // Fallback: ensure name is visible even if animation fails
  setTimeout(() => {
    heroName.querySelectorAll('.name-char').forEach((char) => {
      if (getComputedStyle(char).opacity === '0') {
        char.style.opacity = '1';
        char.style.transform = 'none';
      }
    });
    if (!heroName.classList.contains('all-revealed')) {
      heroName.classList.add('all-revealed');
    }
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNameAnimation);
} else {
  initNameAnimation();
}

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
let glowX = 0;
let glowY = 0;
let currentX = 0;
let currentY = 0;

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function animateGlow() {
    currentX += (glowX - currentX) * 0.08;
    currentY += (glowY - currentY) * 0.08;
    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ===== Scroll Progress =====
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== Navbar Scroll =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
  });
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');
const standaloneStagger = document.querySelectorAll('.about-text.stagger-item');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));
standaloneStagger.forEach(el => revealObserver.observe(el));

// ===== Stagger Groups =====
const staggerGroups = document.querySelectorAll('[data-stagger]');

const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const items = entry.target.querySelectorAll('.stagger-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 110);
      });

      staggerObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

staggerGroups.forEach(group => staggerObserver.observe(group));

// ===== Parallax Orbs =====
const orbs = document.querySelectorAll('.orb');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = 0.08 + i * 0.04;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ===== Code Snippet Fade In =====
const codeSnippet = document.querySelector('.code-snippet');

if (codeSnippet) {
  const codeObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        codeSnippet.classList.add('code-visible');
        codeObserver.unobserve(codeSnippet);
      }
    },
    { threshold: 0.3 }
  );
  codeObserver.observe(codeSnippet);
}

// ===== Stack Path Line Animation =====
const stackPathLine = document.getElementById('stackPathLine');
const stackPath = document.querySelector('.stack-path');

if (stackPathLine && stackPath) {
  const stackPathObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        stackPathLine.style.height = '100%';
        stackPathLine.classList.add('is-drawn');
        stackPathObserver.unobserve(entries[0].target);
      }
    },
    { threshold: 0.15 }
  );
  stackPathObserver.observe(stackPath);
}

// ===== Score Rings Animation =====
const scoreRings = document.querySelectorAll('.score-ring');

const ringObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = parseInt(entry.target.dataset.percent);
        const circumference = 2 * Math.PI * 34;
        const offset = circumference - (percent / 100) * circumference;
        const fill = entry.target.querySelector('.ring-fill');
        fill.style.setProperty('--offset', offset);
        fill.style.strokeDashoffset = offset;
        entry.target.classList.add('animated');
        ringObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

scoreRings.forEach(ring => ringObserver.observe(ring));

// ===== Timeline Line Animation =====
const timelineLine = document.getElementById('timelineLine');

const timelineObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      timelineLine.style.height = '100%';
      timelineObserver.unobserve(entries[0].target);
    }
  },
  { threshold: 0.2 }
);

const timeline = document.querySelector('.timeline');
if (timeline) timelineObserver.observe(timeline);

// ===== 3D Tilt Effect =====
const tiltCards = document.querySelectorAll('[data-tilt]');

if (window.matchMedia('(pointer: fine)').matches) {
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -6;
      const rotateY = (x - centerX) / centerX * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ===== Magnetic Buttons =====
const magneticElements = document.querySelectorAll('.magnetic');

if (window.matchMedia('(pointer: fine)').matches) {
  magneticElements.forEach(el => {
    const strength = parseFloat(el.dataset.strength) || 0.3;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ===== Skill Tag Ripple =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.style.transform = 'scale(0.95)';
    setTimeout(() => {
      tag.style.transform = '';
    }, 150);
  });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
