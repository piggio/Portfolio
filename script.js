const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealSet = new Set();
let observer = null;

if (!prefersReducedMotion) {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
}

const addReveal = (el, delay = 0) => {
  if (!el || revealSet.has(el)) return;
  revealSet.add(el);
  el.classList.add("reveal");
  if (delay) {
    el.style.transitionDelay = `${delay}ms`;
  }
  if (prefersReducedMotion) {
    el.classList.add("is-visible");
  } else if (observer) {
    observer.observe(el);
  }
};

document
  .querySelectorAll(
    ".section-head, .card, .step, .about-text, .about-panel, .contact-form, .project-section, .project-meta"
  )
  .forEach((el) => addReveal(el));

document.querySelectorAll("[data-stagger]").forEach((group) => {
  const items = group.querySelectorAll("[data-stagger-item]");
  items.forEach((item, index) => addReveal(item, index * 90));
});

if (!prefersReducedMotion) {
  const tiltCards = document.querySelectorAll("[data-tilt]");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  });
}

if (!prefersReducedMotion) {
  const heroItems = document.querySelectorAll(".hero > *");
  heroItems.forEach((el, index) => {
    el.animate(
      [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0px)" },
      ],
      {
        duration: 600,
        delay: index * 120,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "forwards",
      }
    );
  });
}

const nav = document.querySelector(".nav");
if (nav) {
  const toggleNav = () => {
    if (window.scrollY > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  toggleNav();
  window.addEventListener("scroll", toggleNav, { passive: true });
}

const bg = document.querySelector(".bg");
if (bg && !prefersReducedMotion) {
  const updateBg = () => {
    const shift = window.scrollY * 0.08;
    bg.style.setProperty("--bg-shift", `${shift}px`);
  };
  updateBg();
  window.addEventListener("scroll", updateBg, { passive: true });
}

const menuButton = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
const menuClose = document.querySelector(".menu-close");
if (menuButton && menuOverlay) {
  const updateClip = () => {
    const rect = menuButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    menuOverlay.style.setProperty("--clip-x", `${x}px`);
    menuOverlay.style.setProperty("--clip-y", `${y}px`);
  };

  const openMenu = () => {
    updateClip();
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (menuOverlay.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) {
      closeMenu();
    }
  });

  menuOverlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", updateClip);
}
