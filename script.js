function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const docConfigs = {
  gis: {
    title: "GIS Analyst CV (Live Document)",
    embedUrl: "https://docs.google.com/document/d/133anLjHZHYtw2hYV_blJY9IR0KdH5CyFJXv4293qwug/preview",
    editUrl: "https://docs.google.com/document/d/133anLjHZHYtw2hYV_blJY9IR0KdH5CyFJXv4293qwug/edit",
    pdfUrl: "Samiul_Amin_GIS_Analyst_CV.pdf"
  },
  research: {
    title: "Research Assistant CV (Live Document)",
    embedUrl: "https://docs.google.com/document/d/1ZHxnGPj9hbjtvzbZl6WiSIsTZbWyk48yiYqy8mV3DmM/preview",
    editUrl: "https://docs.google.com/document/d/1ZHxnGPj9hbjtvzbZl6WiSIsTZbWyk48yiYqy8mV3DmM/edit",
    pdfUrl: "Samiul_Amin_Research_Assistant_CV.pdf"
  }
};

let activeDocType = "gis";

function switchCvTab(type) {
  if (!docConfigs[type]) return;
  activeDocType = type;

  const config = docConfigs[type];

  // Update tabs active state
  document.querySelectorAll(".cv-tab").forEach((tab) => {
    const isTarget = tab.id === `tab-${type}`;
    tab.classList.toggle("active", isTarget);
    tab.setAttribute("aria-selected", String(isTarget));
  });

  // Show loader and update iframe
  const loader = document.getElementById("iframe-loader");
  if (loader) {
    loader.style.opacity = "1";
    loader.style.pointerEvents = "auto";
  }

  const iframe = document.getElementById("cv-iframe");
  if (iframe) {
    iframe.src = config.embedUrl;
  }

  // Update external links
  const gdocLink = document.getElementById("gdoc-external-link");
  if (gdocLink) {
    gdocLink.href = config.editUrl;
  }

  const pdfLink = document.getElementById("pdf-download-link");
  if (pdfLink) {
    pdfLink.href = config.pdfUrl;
  }
}

function hideIframeLoader() {
  const loader = document.getElementById("iframe-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }
}

function openCvFullscreen() {
  const modal = document.getElementById("cv-modal");
  const modalIframe = document.getElementById("modal-iframe");
  const modalTitle = document.getElementById("modal-title");

  const config = docConfigs[activeDocType];
  if (modal && modalIframe && config) {
    modalIframe.src = config.embedUrl;
    if (modalTitle) modalTitle.textContent = config.title;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeCvFullscreen() {
  const modal = document.getElementById("cv-modal");
  const modalIframe = document.getElementById("modal-iframe");

  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modalIframe) modalIframe.src = "";
    document.body.style.overflow = "";
  }
}

const body = document.body;
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const themeToggle = document.getElementById("theme-toggle");
const progressBar = document.getElementById("scroll-progress");
const yearSpan = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const statusBox = document.getElementById("form-status");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  body.classList.add("theme-dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    const nextTheme = body.classList.contains("theme-dark") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    themeToggle.textContent = nextTheme === "dark" ? "☀️" : "🌙";
  });

  themeToggle.textContent = body.classList.contains("theme-dark") ? "☀️" : "🌙";
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  if (progressBar) {
    progressBar.style.transform = `scaleX(${Number.isFinite(scrolled) ? scrolled : 0})`;
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const currentSection = sections.findLast((section) => window.scrollY >= section.offsetTop - 140);

  if (currentSection && navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection.id}`;
      link.classList.toggle("active", isActive);
    });
  }
});

if (contactForm && statusBox) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
      statusBox.textContent = "Please complete all fields before sending your message.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      statusBox.textContent = "Please enter a valid email address.";
      return;
    }

    statusBox.textContent = `Thanks, ${name}! Your message is ready to be sent. I’ll reply soon.`;
    contactForm.reset();
  });
}
