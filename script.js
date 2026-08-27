/**
 * SAMIUL AMIN - ADVANCED INTERACTION ENGINE
 * GIS & Spatial Data Analyst | Urban & Regional Planner
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initHeroGeospatialCanvas();
  initScrollEngine();
  initRevealAnimations();
  initStatsCounters();
  initGisLayerSimulator();
  initProjectSystem();
  initSkillSearch();
  initContactForm();
});

/* ==========================================================================
   Theme Management (Light / Dark + System Sync)
   ========================================================================== */

function initThemeSystem() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('portfolio-theme');

  // Dark mode is default unless explicitly set to 'light' by the user
  const isDark = savedTheme ? savedTheme === 'dark' : true;

  function applyTheme(dark) {
    if (dark) {
      body.classList.add('theme-dark');
      if (themeToggle) themeToggle.textContent = '☀️';
    } else {
      body.classList.remove('theme-dark');
      if (themeToggle) themeToggle.textContent = '🌙';
    }
  }

  applyTheme(isDark);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nowDark = !body.classList.contains('theme-dark');
      applyTheme(nowDark);
      localStorage.setItem('portfolio-theme', nowDark ? 'dark' : 'light');
    });
  }
}

/* ==========================================================================
   Hero Interactive Geospatial Canvas (Network & Coordinate Laser)
   ========================================================================== */

function initHeroGeospatialCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isCanvasActive = true;

  let mouse = { x: -1000, y: -1000, isHovering: false };

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovering = true;
    } else {
      mouse.isHovering = false;
    }
  });

  const NODE_COUNT = Math.min(48, Math.floor((window.innerWidth || 800) / 24));
  const MAX_DISTANCE = 140;
  const nodes = [];

  class GeoPoint {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1.2;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.03;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.body.classList.contains('theme-dark');
      const pulseSize = this.radius + Math.sin(this.pulse) * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, pulseSize), 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.75)' : 'rgba(2, 132, 199, 0.65)';
      ctx.fill();
    }
  }

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new GeoPoint());
  }

  function render() {
    if (!isCanvasActive) return;

    ctx.clearRect(0, 0, width, height);
    const isDark = document.body.classList.contains('theme-dark');

    // Draw coordinate lines between nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * (isDark ? 0.28 : 0.2);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      // Mouse proximity interaction
      if (mouse.isHovering) {
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 160) {
          const malpha = (1 - mdist / 160) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDark ? `rgba(52, 211, 153, ${malpha})` : `rgba(16, 185, 129, ${malpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  const heroSection = document.getElementById('home');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isCanvasActive = entry.isIntersecting;
        if (isCanvasActive) render();
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
}

/* ==========================================================================
   Scroll Engine: Progress Bar, Navigation, Dock & Back-to-Top
   ========================================================================== */

function initScrollEngine() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const scrollRing = document.getElementById('scroll-ring-circle');
  const navLinks = document.getElementById('nav-links');
  const menuToggle = document.getElementById('menu-toggle');
    const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = docHeight > 0 ? scrollTop / docHeight : 0;

    // Top progress bar
    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollRatio))})`;
    }

    // Circular back-to-top button
    if (backToTopBtn) {
      if (scrollTop > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    if (scrollRing) {
      const totalDash = 140;
      scrollRing.style.strokeDashoffset = totalDash - scrollRatio * totalDash;
    }

    // ScrollSpy active link highlighting
    const sections = [...document.querySelectorAll('main section[id]')];
    const currentSection = sections.findLast((sec) => scrollTop >= sec.offsetTop - 140);
    
    if (currentSection) {
      const currentId = currentSection.id;

      if (navLinks) {
        navLinks.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href');
          if (href && href.startsWith('#')) {
            a.classList.toggle('active', href === `#${currentId}`);
          }
        });
      }

      
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */

function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Animated Numeric Stats Counters
   ========================================================================== */

function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseFloat(target.getAttribute('data-target'));
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const decimals = parseInt(target.getAttribute('data-decimals') || '0', 10);
        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = easeProgress * endVal;

          target.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            target.textContent = `${prefix}${endVal.toFixed(decimals)}${suffix}`;
          }
        }

        requestAnimationFrame(updateNumber);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach((c) => observer.observe(c));
}

/* ==========================================================================
   Interactive GIS Layer Simulator Component
   ========================================================================== */

const gisLayerData = {
  zoning: {
    title: "Pourashava Land Use & Urban Growth Zoning",
    metric: "15 Municipalities Modeled",
    tools: "ArcGIS Pro • QGIS • Geodatabase Topology",
    description: "Multi-class land use zoning, residential density gradients, commercial corridors, and projected 10-year urban expansion boundaries.",
    svg: `<svg viewBox="0 0 800 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="280" fill="transparent"/>
      <path d="M 40,80 Q 200,40 380,90 T 740,110 L 760,240 Q 520,270 300,230 Z" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="2"/>
      <path d="M 160,110 Q 320,80 480,120 T 680,180 L 640,230 Q 420,250 200,210 Z" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="2"/>
      <circle cx="280" cy="150" r="30" fill="rgba(99, 102, 241, 0.35)" stroke="#6366f1" stroke-width="2.5"/>
      <text x="280" y="155" fill="currentColor" font-size="11" font-weight="700" text-anchor="middle">Central Core</text>
      <circle cx="520" cy="160" r="42" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="2"/>
      <text x="520" y="165" fill="currentColor" font-size="11" font-weight="700" text-anchor="middle">Growth Sector</text>
    </svg>`
  },
  drainage: {
    title: "Hydrology, Catchment & Drainage Network",
    metric: "100% Flow Connectivity QA",
    tools: "DEM • Flow Accumulation • QGIS",
    description: "Topographic slope analysis, natural storm runoff channels, drainage bottlenecks, and waterlogging vulnerability zones.",
    svg: `<svg viewBox="0 0 800 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="280" fill="transparent"/>
      <path d="M 60,40 Q 250,160 450,130 T 750,220" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
      <path d="M 180,60 Q 260,110 320,135" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,4"/>
      <path d="M 400,60 Q 440,100 450,130" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4,4"/>
      <path d="M 580,90 Q 610,140 640,180" fill="none" stroke="#38bdf8" stroke-width="3.5"/>
      <circle cx="450" cy="130" r="8" fill="#ef4444"/>
      <text x="450" y="112" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Critical Sluice Point</text>
    </svg>`
  },
  thermal: {
    title: "Thermal Inequity & Land Surface Temp (LST)",
    metric: "Landsat 4–9 Thermal Bands",
    tools: "Google Earth Engine • Moran\'s I • Springer Book Chapter",
    description: "Microclimate surface temperature anomaly mapping, NDVI/NDBI indices correlation, and marginalized community heat risk modeling in Rajshahi.",
    svg: `<svg viewBox="0 0 800 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heatGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.6"/>
          <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1"/>
        </radialGradient>
      </defs>
      <rect width="800" height="280" fill="transparent"/>
      <circle cx="340" cy="140" r="110" fill="url(#heatGrad)"/>
      <circle cx="560" cy="130" r="85" fill="url(#heatGrad)"/>
      <circle cx="340" cy="140" r="28" fill="rgba(239, 68, 68, 0.45)" stroke="#ef4444" stroke-width="2"/>
      <text x="340" y="145" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">High LST (+4.2°C)</text>
      <text x="560" y="135" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">Moderate (+2.1°C)</text>
    </svg>`
  },
  accessibility: {
    title: "Infrastructure Gap & Spatial Accessibility Modeling",
    metric: "3 Upazilas • 270 FGDs",
    tools: "Network Analyst • KoboToolbox • Spatial Sampling",
    description: "Distance-decay travel time buffers to healthcare, schools, water supply points, and administrative nodes to identify underserved settlements.",
    svg: `<svg viewBox="0 0 800 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="280" fill="transparent"/>
      <circle cx="400" cy="140" r="120" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,6"/>
      <circle cx="400" cy="140" r="75" fill="none" stroke="#0284c7" stroke-width="2"/>
      <circle cx="400" cy="140" r="35" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="2.5"/>
      <circle cx="400" cy="140" r="6" fill="#0284c7"/>
      <text x="400" y="130" fill="currentColor" font-size="11" font-weight="700" text-anchor="middle">Civic Service Node</text>
      <text x="400" y="195" fill="currentColor" font-size="10" text-anchor="middle">10-min Walking Buffer</text>
      <text x="400" y="245" fill="currentColor" font-size="10" text-anchor="middle">20-min Service Radius</text>
    </svg>`
  }
};

function initGisLayerSimulator() {
  const container = document.getElementById('gis-canvas-view');
  const infoBox = document.getElementById('gis-layer-info-content');
  const buttons = document.querySelectorAll('.gis-layer-btn');
  if (!container || !infoBox || !buttons.length) return;

  window.setGisLayer = function(layerKey) {
    const data = gisLayerData[layerKey];
    if (!data) return;

    buttons.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-layer') === layerKey);
    });

    container.innerHTML = data.svg;
    infoBox.innerHTML = `
      <div>
        <strong>${data.title}</strong> &bull; <span style="color: var(--primary);">${data.metric}</span>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">${data.description}</p>
      </div>
      <div style="font-size: 0.78rem; background: var(--primary-bg-light); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; white-space: normal;">
        ${data.tools}
      </div>
    `;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const layer = btn.getAttribute('data-layer');
      window.setGisLayer(layer);
    });
  });

  // Default initialize with zoning layer
  window.setGisLayer('zoning');
}

/* ==========================================================================
   Project System: Filter & Case Study Modal
   ========================================================================== */

const projectDetailsDatabase = {
  'lged-iugip': {
    badge: 'LGED IUGIP Master Planning',
    title: 'Preparation of Urban Master Plan for 15 Pourashavas',
    client: 'Local Government Engineering Department (LGED) & PDRC',
    overview: 'Formulated GIS-supported spatial planning and infrastructure development analytical frameworks across fifteen (15) Pourashava municipalities under the Improving Urban Governance and Infrastructure Program (IUGIP).',
    sections: [
      {
        heading: 'Spatial Methodology & Analysis',
        content: 'Integrated multi-source high-resolution satellite imagery and topographic survey data to perform comprehensive spatial modeling of land use dynamics, existing road networks, and natural drainage channels. Modeled 10-year urban expansion trajectories using ArcGIS Pro and QGIS.'
      },
      {
        heading: 'Geodatabase Architecture & QA/QC',
        content: 'Designed and standardized enterprise-grade geodatabases with strict topological rules, attribute integrity constraints, and complete metadata documentation across all 15 municipal project deliverables.'
      },
      {
        heading: 'Key Deliverables & Decision Support',
        content: 'Generated comprehensive cartographic atlases including Land Use Zoning Plans, Ward Action Plans, Infrastructure Development Proposals, and Drainage Master Plans used directly by municipal authorities and LGED executive engineers.'
      }
    ],
    tools: ['ArcGIS Pro', 'ArcMap', 'QGIS', 'Spatial Analyst', 'Geodatabase Design', 'Topological Modeling']
  },
  'lged-utmidp': {
    badge: 'LGED UTMIDP Spatial Sampling',
    title: 'Upazila Town Master Plan & Infrastructure Framework',
    client: 'Local Government Engineering Department (LGED) & PDRC',
    overview: 'Engineered GIS-based spatial sampling frameworks and socio-economic infrastructure gap assessments across three non-municipal Upazila growth centers.',
    sections: [
      {
        heading: 'Spatial Sampling Design',
        content: 'Developed a statistically robust spatial sampling model factoring in settlement clustering, distance decay to civic amenities, and transport network accessibility to optimize socio-economic survey enumerator coverage.'
      },
      {
        heading: 'Infrastructure Gap Analysis',
        content: 'Mapped spatial disparities in access to potable water, healthcare facilities, solid waste disposal points, and educational institutions, providing evidence-based priority zones for basic infrastructure investment.'
      }
    ],
    tools: ['QGIS', 'Spatial Sampling', 'Network Analysis', 'KoboToolbox', 'Accessibility Modeling']
  },
  'mod-cantonment': {
    badge: 'Ministry of Defense Feasibility Study',
    title: 'Physical Infrastructure Feasibility for Barisal & Ramu Cantonment Boards',
    client: 'Ministry of Defense, Govt of Bangladesh & PDRC',
    overview: 'Conducted rigorous GIS base mapping, site suitability evaluations, and spatial feasibility assessments for physical facilities development in newly established Cantonment Board zones.',
    sections: [
      {
        heading: 'Site Context & Multicriteria Suitability',
        content: 'Performed multi-criteria spatial suitability evaluations (MCE) incorporating elevation gradients, proximity to transportation corridors, soil stability, and flood inundation risk layers.'
      },
      {
        heading: 'Technical Narrative & Feasibility Reporting',
        content: 'Authored technical report sections harmonizing GIS-derived locational insights with strategic infrastructure and environmental governance narratives.'
      }
    ],
    tools: ['ArcGIS', 'Digital Elevation Modeling (DEM)', 'Multi-Criteria Evaluation (MCE)', 'Cartography']
  },
  'thesis-heat': {
    badge: 'Academic Thesis (Springer Shortlisted)',
    title: 'Urban Change and Thermal Inequity: LST & Heat Vulnerability in Rajshahi',
    client: 'RUET Academic Thesis (Supervisor: Sakib Zubayer)',
    overview: 'Comprehensive empirical investigation integrating Landsat thermal remote sensing, spatial statistics, and socio-demographic microdata to map urban thermal disparities and vulnerability among marginalized populations.',
    sections: [
      {
        heading: 'Remote Sensing & Land Surface Temperature',
        content: 'Processed multi-temporal Landsat 4–9 thermal infrared (TIR) and multispectral bands via Google Earth Engine to compute Land Surface Temperature (LST), Normalized Difference Vegetation Index (NDVI), and Normalized Difference Built-Up Index (NDBI).'
      },
      {
        heading: 'Socio-Spatial Vulnerability Index',
        content: 'Constructed an integrated Urban Thermal Vulnerability Index (UTVI) using spatial autocorrelation (Moran\'s I) and Hot Spot Analysis (Getis-Ord Gi*) to pinpoint clusters of marginalized communities facing acute heat stress.'
      },
      {
        heading: 'Academic Recognition',
        content: 'Abstract shortlisted for book chapter publication in the prestigious Springer Disaster Risk Reduction series.'
      }
    ],
    tools: ['Google Earth Engine', 'Landsat 4-9', 'Spatial Statistics', 'LST Extraction', 'Policy Analysis']
  },
  'jute-study': {
    badge: 'Peer-Reviewed Journal Publication',
    title: 'Constraints of Jute Cultivation & Market Value Analysis (Paba, Rajshahi)',
    client: 'International Journal of Scientific Agriculture (IJSA, 2024)',
    overview: 'Empirical research analyzing socio-economic bottlenecks, production costs, and market chain dynamics for sustainable agriculture in Northern Bangladesh.',
    sections: [
      {
        heading: 'Research Methodology & Field Investigation',
        content: 'Conducted household surveys, in-depth grower interviews, and participatory rural appraisals (PRA) in Bhugroil, Paba Upazila to quantify market margins and middleman distortions.'
      },
      {
        heading: 'Publication & Citation Information',
        content: 'Published in IJSA, Vol. 09, No. 4, March 2024. DOI: 10.25081/jsa.2025.v9.9504.'
      }
    ],
    tools: ['SPSS', 'Quantitative Survey', 'Market Chain Analysis', 'Academic Writing', 'DOI: 10.25081/jsa.2025.v9.9504']
  },
  'betar-study': {
    badge: 'Research Study & Qualitative Evaluation',
    title: 'Role of Bangladesh Betar in Socio-Economic & Cultural Development',
    client: 'Bangladesh Betar & PDRC (Apr 2026 – Jun 2026)',
    overview: 'Led field data collection and qualitative thematic synthesis evaluating public broadcasting impact on agricultural dissemination and rural cultural heritage in Northern Bangladesh.',
    sections: [
      {
        heading: 'Participatory Facilitation',
        content: 'Facilitated 3 Focus Group Discussions (FGDs) and conducted 15 Key Informant Interviews (KIIs) with community leaders, farmers, and media practitioners.'
      },
      {
        heading: 'Thematic Analysis & Documentation',
        content: 'Conducted qualitative coding and thematic synthesis to inform national media policy and strategic broadcast scheduling.'
      }
    ],
    tools: ['FGD & KII Facilitation', 'Qualitative Synthesis', 'Thematic Analysis', 'Technical Reporting']
  }
};

function initProjectSystem() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalTitle = document.getElementById('modal-project-title');
  const modalClient = document.getElementById('modal-project-client');
  const modalOverview = document.getElementById('modal-project-overview');
  const modalBody = document.getElementById('modal-project-body');
  const modalTechStack = document.getElementById('modal-project-tech');

  window.openProjectModal = function(projectId) {
    const data = projectDetailsDatabase[projectId];
    if (!data || !modalOverlay) return;

    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalClient) modalClient.textContent = `Client / Institution: ${data.client}`;
    if (modalOverview) modalOverview.textContent = data.overview;

    if (modalBody) {
      modalBody.innerHTML = data.sections.map((s) => `
        <div>
          <div class="modal-section-h">${s.heading}</div>
          <p>${s.content}</p>
        </div>
      `).join('');
    }

    if (modalTechStack) {
      modalTechStack.innerHTML = data.tools.map((t) => `
        <span class="tech-tag">${t}</span>
      `).join('');
    }

    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', window.closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-open')) {
      window.closeProjectModal();
    }
  });
}

/* ==========================================================================
   Realtime Skill Search & Highlights
   ========================================================================== */

function initSkillSearch() {
  const searchInput = document.getElementById('skill-search-input');
  if (!searchInput) return;

  const skillCategories = document.querySelectorAll('.skill-category-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillCategories.forEach((cat) => {
      let hasVisible = false;
      const badges = cat.querySelectorAll('.skill-badge');

      badges.forEach((badge) => {
        const text = badge.textContent.toLowerCase();
        if (text.includes(query)) {
          badge.style.display = 'inline-flex';
          hasVisible = true;
        } else {
          badge.style.display = 'none';
        }
      });

      cat.style.display = hasVisible ? 'block' : 'none';
    });
  });
}

/* ==========================================================================
   Clipboard & Animated Toast Notifications
   ========================================================================== */

window.copyContact = function(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'Copied to clipboard!');
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(successMsg || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(tempInput);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

/* ==========================================================================
   Contact Form Validation & Feedback
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]')?.value.trim();
    const email = form.querySelector('input[name="email"]')?.value.trim();
    const message = form.querySelector('textarea[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please complete all required fields.';
      statusEl.className = 'form-status-msg error';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusEl.textContent = 'Please enter a valid email address.';
      statusEl.className = 'form-status-msg error';
      return;
    }

    statusEl.textContent = `Thank you, ${name}! Your inquiry is noted. Feel free to also email directly at aminsamiul968@gmail.com.`;
    statusEl.className = 'form-status-msg success';
    showToast('Message sent successfully!');
    form.reset();
  });
}
