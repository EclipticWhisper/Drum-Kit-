/*
 * Drum Kit Website - Main JavaScript
 * ====================================
 * This file implements the core drum-playing functionality and all
 * modern interactive features requested in the refactoring brief.
 *
 * Key features demonstrated:
 *   - Event-driven programming (keyboard + click input)
 *   - Audio API for sound playback
 *   - Intersection Observer for scroll-based animations
 *   - CSS custom properties for theme switching
 *   - localStorage for persisting user preferences
 *   - Canvas API for particle background effects
 *   - DOM manipulation and class toggling for visual feedback
 */

/* ------------------------------------------------------------------ */
/*  1. LOADING SCREEN                                                 */
/*     Hides the overlay once all assets and the page are ready.      */
/*     Uses a short delay to ensure smooth visual transition.         */
/* ------------------------------------------------------------------ */

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("loader-hidden");
      loader.addEventListener("transitionend", () => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      });
    }
  }, 600);
});

/* ------------------------------------------------------------------ */
/*  2. THEME TOGGLE (DARK / LIGHT)                                    */
/*     Stores preference in localStorage so the choice persists       */
/*     across page reloads. Toggles a data-theme attribute on the     */
/*     root element which drives CSS custom property values.          */
/* ------------------------------------------------------------------ */

(function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const saved = localStorage.getItem("drum-kit-theme") || "dark";
  root.setAttribute("data-theme", saved);
  if (toggle) toggle.textContent = saved === "dark" ? "☀️" : "🌙";

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("drum-kit-theme", next);
      toggle.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }
})();

/* ------------------------------------------------------------------ */
/*  3. SCROLL PROGRESS INDICATOR                                      */
/*     A thin bar at the very top of the viewport fills as the user   */
/*     scrolls down the page, giving a visual sense of progress.      */
/* ------------------------------------------------------------------ */

(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  });
})();

/* ------------------------------------------------------------------ */
/*  4. STICKY NAVIGATION & MOBILE MENU                                */
/*     The nav bar sticks to the top of the viewport. A hamburger     */
/*     toggle is used on smaller screens for mobile-friendly access.  */
/* ------------------------------------------------------------------ */

(function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const header = document.querySelector("header");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-open");
      hamburger.textContent = navLinks.classList.contains("nav-open") ? "✕" : "☰";
    });
  }

  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("nav-scrolled", window.scrollY > 50);
    }
  });
})();

/* ------------------------------------------------------------------ */
/*  5. SMOOTH SCROLLING FOR ANCHOR LINKS                               */
/*     Each navigation link and the CTA button scroll smoothly to     */
/*     the targeted section using the native scroll-behavior API.     */
/* ------------------------------------------------------------------ */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        const nav = document.querySelector("header");
        const offset = nav ? nav.offsetHeight : 0;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: "smooth",
        });
      }
      const navLinksEl = document.getElementById("nav-links");
      const hamburgerEl = document.getElementById("hamburger");
      if (navLinksEl && navLinksEl.classList.contains("nav-open")) {
        navLinksEl.classList.remove("nav-open");
        if (hamburgerEl) hamburgerEl.textContent = "☰";
      }
    });
  });
})();

/* ------------------------------------------------------------------ */
/*  6. INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS             */
/*     Elements with the 'reveal' class will fade and slide in when   */
/*     they enter the viewport. Uses a threshold so triggers early.   */
/* ------------------------------------------------------------------ */

(function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ------------------------------------------------------------------ */
/*  7. CANVAS PARTICLE / FLOATING SHAPES BACKGROUND                   */
/*     Draws animated geometric shapes (circles, triangles, squares)  */
/*     that float across the hero section, creating a dynamic look.   */
/*     Uses requestAnimationFrame for smooth 60fps rendering.         */
/* ------------------------------------------------------------------ */

(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  const shapes = [];
  const shapeCount = 30;

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createShapes() {
    shapes.length = 0;
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        size: randomBetween(8, 40),
        speedX: randomBetween(-0.4, 0.4),
        speedY: randomBetween(-0.4, 0.4),
        opacity: randomBetween(0.08, 0.18),
        rotation: randomBetween(0, Math.PI * 2),
        rotationSpeed: randomBetween(-0.01, 0.01),
        type: ["circle", "triangle", "square"][Math.floor(Math.random() * 3)],
      });
    }
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    const fillColor =
      document.documentElement.getAttribute("data-theme") === "light"
        ? `rgba(218, 4, 99, ${s.opacity + 0.05})`
        : `rgba(255, 255, 255, ${s.opacity})`;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    if (s.type === "circle") {
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
    } else if (s.type === "triangle") {
      const h = (s.size * Math.sqrt(3)) / 2;
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(-s.size / 2, h / 2);
      ctx.lineTo(s.size / 2, h / 2);
      ctx.closePath();
    } else {
      ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
    }

    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    shapes.forEach((s) => {
      s.x += s.speedX;
      s.y += s.speedY;
      s.rotation += s.rotationSpeed;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;
      drawShape(s);
    });
    requestAnimationFrame(animate);
  }

  resize();
  createShapes();
  animate();
  window.addEventListener("resize", () => {
    resize();
    createShapes();
  });
})();

/* ------------------------------------------------------------------ */
/*  8. DRUM KIT — CORE AUDIO + INTERACTION ENGINE                     */
/*     Preserves the original click-and-key behavior described in     */
/*     the brief while adding modern visual feedback: button press    */
/*     animation, glow effects, and click ripple.                     */
/*     Mapping:                                                        */
/*       w → tom-1    a → tom-2    s → tom-3    d → tom-4             */
/*       j → snare    k → crash    l → kick-bass                      */
/* ------------------------------------------------------------------ */

(function initDrumKit() {
  const drumButtons = document.querySelectorAll(".drum");

  drumButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      playDrum(btn);
      createRipple(e, btn);
    });
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`.drum[data-key="${key}"]`);
    if (btn) {
      playDrum(btn);
      btn.classList.add("key-pressed");
    }
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`.drum[data-key="${key}"]`);
    if (btn) btn.classList.remove("key-pressed");
  });

  function playDrum(button) {
    const soundName = button.getAttribute("data-sound");
    if (!soundName) return;

    const audio = new Audio(`sounds/${soundName}.mp3`);
    audio.currentTime = 0;
    audio.play().catch(() => {});

    button.classList.add("playing");
    button.classList.add("glow");
    button.addEventListener(
      "transitionend",
      () => {
        button.classList.remove("playing");
        button.classList.remove("glow");
      },
      { once: true }
    );
  }

  function createRipple(e, btn) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    });
  }
})();

/* ------------------------------------------------------------------ */
/*  9. MOUSE PARALLAX EFFECT ON DRUM SECTION                          */
/*     A subtle tilt towards the cursor creates depth and makes       */
/*     the drum kit feel more immersive.                              */
/* ------------------------------------------------------------------ */

(function initParallax() {
  const grid = document.querySelector(".drum-grid");
  if (!grid) return;

  grid.addEventListener("mousemove", (e) => {
    const rect = grid.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    grid.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  grid.addEventListener("mouseleave", () => {
    grid.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg)";
  });
})();
