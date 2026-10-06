/**
 * AMIT KUMAR — EDITORIAL DEVELOPER PORTFOLIO
 * Interactive Controllers: Dynamic Typewriter, 3D Card Tilt, Magnetic Buttons, Modals, DSA Code Viewer
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DYNAMIC TYPEWRITER ROLE SWITCHER (NAME & HERO ANIMATION)
  // =========================================================================
  const typewriterElement = document.getElementById('typewriterRole');
  const roles = [
    'SOFTWARE DEVELOPER',
    'JAVA & BACKEND DEVELOPER',
    'DSA & PROBLEM SOLVER'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start typewriter after hero reveal
  setTimeout(typeRole, 600);

  // =========================================================================
  // 2. ADVANCED 3D PROFILE PARALLAX & TILT ENGINE
  // =========================================================================
  const heroStage = document.getElementById('heroProfileStage');
  const hero3dCard = document.getElementById('heroProfileCard');
  const haloAura = document.querySelector('.profile-glow-halo');
  const orbitalRings = document.querySelectorAll('.profile-kinetic-ring');
  const floatCards = document.querySelectorAll('.float-card');

  if (heroStage && hero3dCard && window.matchMedia('(pointer: fine)').matches) {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let isHovered = false;
    let rafId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    function render3D() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);

      const rotateX = (-currentY * 18).toFixed(2);
      const rotateY = (currentX * 18).toFixed(2);
      const liftZ = isHovered ? 20 : 0;

      hero3dCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${liftZ}px)`;

      if (haloAura) {
        haloAura.style.transform = `translate(calc(-50% + ${currentX * 28}px), calc(-50% + ${currentY * 28}px)) scale(${isHovered ? 1.15 : 1})`;
      }

      orbitalRings.forEach((ring, idx) => {
        const factor = (idx + 1) * 12;
        ring.style.transform = `translate(calc(-50% + ${currentX * factor}px), calc(-50% + ${currentY * factor}px))`;
      });

      floatCards.forEach((card, idx) => {
        const factor = (idx + 1) * 10;
        card.style.transform = `translate3d(${currentX * factor}px, ${currentY * factor}px, 35px)`;
      });

      if (isHovered || Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001) {
        rafId = requestAnimationFrame(render3D);
      } else {
        rafId = null;
      }
    }

    heroStage.addEventListener('mouseenter', () => {
      isHovered = true;
      hero3dCard.style.animationPlayState = 'paused';
      if (!rafId) rafId = requestAnimationFrame(render3D);
    });

    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetX = (x - 0.5) * 2; // -1 to 1
      targetY = (y - 0.5) * 2; // -1 to 1

      // Set specular shine coords
      hero3dCard.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
      hero3dCard.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);

      if (!rafId) rafId = requestAnimationFrame(render3D);
    });

    heroStage.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      hero3dCard.style.animationPlayState = 'running';
      if (!rafId) rafId = requestAnimationFrame(render3D);
    });
  }

  // Tilt for other cards (e.g., project preview cards, skill badges)
  const otherTiltCards = document.querySelectorAll('.tilt-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    otherTiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // =========================================================================
  // 3. MAGNETIC BUTTON MICRO-INTERACTION
  // =========================================================================
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  if (window.matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // =========================================================================
  // 4. CENTRAL EDITABLE PROJECT DATA
  // =========================================================================
  const projectsData = {
    'state-arena': {
      title: 'STATE ARENA',
      category: 'ESPORTS TOURNAMENT & STATS PLATFORM',
      image: 'assets/projects/state-arena.svg',
      description: 'A platform for displaying esports matches, teams, players, tournaments, and real-time tournament statistics with SQL relational querying.',
      tech: ['HTML', 'CSS', 'JavaScript', 'SQL'],
      highlights: [
        'Designed relational database schema to index matches, teams, player rosters, and multi-bracket tournament progressions.',
        'Engineered responsive interactive interface featuring live leaderboards and match analytics.',
        'Optimized SQL queries and joins for low-latency statistics calculation and match history fetching.'
      ],
      github: 'https://github.com/Amit7304'
    },
    'fake-news': {
      title: 'FAKE NEWS DETECTION',
      category: 'MACHINE LEARNING & NLP CLASSIFIER',
      image: 'assets/projects/fake-news-detection.svg',
      description: 'A machine learning web application for classifying news articles and textual content as credible or fabricated using NLP algorithms.',
      tech: ['Python', 'Streamlit', 'Machine Learning', 'NLP'],
      highlights: [
        'Developed end-to-end text preprocessing pipeline utilizing tokenization, stop-word removal, and TF-IDF vectorization.',
        'Trained and evaluated classification models (Passive-Aggressive, Naive Bayes) achieving strong accuracy on benchmark datasets.',
        'Deployed interactive user interface via Streamlit enabling instant classification and confidence score gauges.'
      ],
      github: 'https://github.com/Amit7304'
    },
    'weather-app': {
      title: 'WEATHER APPLICATION',
      category: 'REAL-TIME WEATHER WEB APPLICATION',
      image: 'assets/projects/weather-app.svg',
      description: 'A responsive weather web application providing current atmospheric metrics, 24-hour temperature curves, and multi-day meteorological forecasts.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
      highlights: [
        'Integrated RESTful Weather API to fetch live meteorological data with asynchronous fetch/await handling.',
        'Rendered dynamic 24-hour hourly temperature trends, humidity, atmospheric pressure, and 5-day forecasts.',
        'Implemented responsive layout with clean state handling for location search and error boundaries.'
      ],
      github: 'https://github.com/Amit7304'
    },
    'ems': {
      title: 'EMS — EMPLOYEE MANAGEMENT SYSTEM',
      category: 'ENTERPRISE JAVA CRUD APPLICATION',
      image: 'assets/projects/employee-management.svg',
      description: 'Java CRUD application built on the DAO (Data Access Object) design pattern with JDBC and MySQL, featuring employee search, department stats, and database management.',
      tech: ['Java', 'JDBC', 'MySQL', 'DAO Pattern'],
      highlights: [
        'Architected clean separation of concerns utilizing the Data Access Object (DAO) and MVC architectural patterns.',
        'Implemented robust CRUD database operations with MySQL connection pooling and prepared statements for SQL injection prevention.',
        'Added department metrics aggregation (average compensation, headcount distribution, and search indexing).'
      ],
      github: 'https://github.com/Amit7304/EmployeeManagementSystem'
    }
  };

  // =========================================================================
  // 5. SCROLL PROGRESS & HEADER STICKY STATE
  // =========================================================================

  // =========================================================================
  // 6. SCROLL PROGRESS & HEADER STICKY STATE
  // =========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress calculation
    if (scrollHeight > 0 && scrollProgressBar) {
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Header blurred background on scroll
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Section spy
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 7. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile drawer when clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 8. MACOS PROJECT INSPECTION MODAL
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const projectModalOverlay = document.getElementById('projectModalOverlay');
  const btnCloseProjectModal = document.getElementById('btnCloseProjectModal');

  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectImg = document.getElementById('modalProjectImg');
  const modalProjectCategory = document.getElementById('modalProjectCategory');
  const modalProjectHeading = document.getElementById('modalProjectHeading');
  const modalProjectDesc = document.getElementById('modalProjectDesc');
  const modalProjectHighlights = document.getElementById('modalProjectHighlights');
  const modalProjectTechTags = document.getElementById('modalProjectTechTags');
  const modalProjectGithub = document.getElementById('modalProjectGithub');

  const openProjectModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    modalProjectTitle.textContent = `${data.title} — SPECIFICATION`;
    modalProjectImg.src = data.image;
    modalProjectImg.alt = `${data.title} Preview`;
    modalProjectCategory.textContent = data.category;
    modalProjectHeading.textContent = data.title;
    modalProjectDesc.textContent = data.description;

    // Highlights list
    modalProjectHighlights.innerHTML = data.highlights
      .map(item => `<li>${item}</li>`)
      .join('');

    // Tech pills
    modalProjectTechTags.innerHTML = data.tech
      .map(t => `<span class="tech-pill">${t}</span>`)
      .join('');

    if (modalProjectGithub) {
      modalProjectGithub.href = data.github;
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Card click triggers modal
  document.querySelectorAll('.project-editorial-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore if clicking on direct github anchor link
      if (e.target.closest('.icon-link')) return;

      const projectId = card.getAttribute('data-project-id');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (btnCloseProjectModal) btnCloseProjectModal.addEventListener('click', closeProjectModal);
  if (projectModalOverlay) projectModalOverlay.addEventListener('click', closeProjectModal);

  // =========================================================================
  // 9. RESUME PREVIEW MODAL
  // =========================================================================
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalOverlay = document.getElementById('resumeModalOverlay');
  const btnCloseResumeModal = document.getElementById('btnCloseResumeModal');
  const btnOpenResumeModal = document.getElementById('btnOpenResumeModal');
  const btnHeroResumeModal = document.getElementById('btnHeroResumeModal');

  const openResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnOpenResumeModal) btnOpenResumeModal.addEventListener('click', openResumeModal);
  if (btnHeroResumeModal) btnHeroResumeModal.addEventListener('click', openResumeModal);
  if (btnCloseResumeModal) btnCloseResumeModal.addEventListener('click', closeResumeModal);
  if (resumeModalOverlay) resumeModalOverlay.addEventListener('click', closeResumeModal);

  // Global ESC key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });



  // =========================================================================
  // 11. CONTACT FORM DISPATCH HANDLER
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const message = contactForm.elements['message'].value.trim();

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please complete all required fields before dispatching.';
        return;
      }

      // Simulate instantaneous mailto client dispatch / confirmation
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Sender Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:akrathore7304@gmail.com?subject=${subject}&body=${body}`;

      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = '✓ Opening email client to dispatch your message...';

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }

  // =========================================================================
  // 12. BACK TO TOP BUTTON
  // =========================================================================
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 13. PAGE LOAD REVEAL ANIMATIONS
  // =========================================================================
  const revealItems = document.querySelectorAll('.reveal-item');
  revealItems.forEach(el => {
    requestAnimationFrame(() => {
      el.classList.add('revealed');
    });
  });

  // Intersection Observer for scroll-triggered elements
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-category-card, .project-editorial-card, .spec-window, .stat-card, .contact-card-link').forEach(el => {
    el.classList.add('scroll-reveal');
    scrollObserver.observe(el);
  });
});
