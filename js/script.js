/* ============================================================
   Jana Harsha Plots — Main Script
   Vanilla JavaScript · No Dependencies
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================
     0. SPLASH SCREEN / PRELOADER
  ========================================================== */
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    document.body.classList.add("splash-active");

    // After logo zoom animation + brief pause, fade out splash
    setTimeout(() => {
      splashScreen.classList.add("fade-out");
      document.body.classList.remove("splash-active");

      // Remove splash from DOM after transition
      setTimeout(() => {
        splashScreen.remove();
      }, 700);
    }, 2800); // Total splash display time: 2.8 seconds
  }


  /* ----------------------------------------------------------
     Cache frequently-used DOM references
  ---------------------------------------------------------- */
  const navbar        = document.querySelector(".navbar");
  const hamburger     = document.querySelector(".hamburger");
  const navMenu       = document.querySelector(".nav-menu");
  const navLinks      = document.querySelectorAll(".nav-menu a");
  const btnTop        = document.querySelector(".btn-top");
  const contactForm   = document.getElementById("contact-form");
  const sections      = document.querySelectorAll("section[id]");

  /* ==========================================================
     1. STICKY NAVIGATION WITH SCROLL EFFECT
  ========================================================== */
  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  /* ==========================================================
     1b. HERO CAROUSEL / SLIDER
  ========================================================== */
  const heroTrack   = document.getElementById("hero-track");
  const heroSlides  = document.querySelectorAll(".hero-slide");
  const heroDots    = document.querySelectorAll(".hero-dot");
  const heroPrev    = document.getElementById("hero-prev");
  const heroNext    = document.getElementById("hero-next");
  let currentSlide  = 0;
  let heroAutoplay  = null;
  const SLIDE_INTERVAL = 5000; // 5 seconds

  function goToSlide(index) {
    if (!heroTrack || heroSlides.length === 0) return;
    // Wrap around
    if (index < 0) index = heroSlides.length - 1;
    if (index >= heroSlides.length) index = 0;

    currentSlide = index;

    // Move the track horizontally
    const offset = -(100 / heroSlides.length) * currentSlide;
    heroTrack.style.transform = `translateX(${offset}%)`;

    // Update active slide
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    // Update dots
    heroDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  // Auto-play
  function startAutoplay() {
    stopAutoplay();
    heroAutoplay = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function stopAutoplay() {
    if (heroAutoplay) {
      clearInterval(heroAutoplay);
      heroAutoplay = null;
    }
  }

  // Arrow clicks
  if (heroNext) heroNext.addEventListener("click", () => { nextSlide(); startAutoplay(); });
  if (heroPrev) heroPrev.addEventListener("click", () => { prevSlide(); startAutoplay(); });

  // Dot clicks
  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
      goToSlide(slideIndex);
      startAutoplay();
    });
  });

  // Pause autoplay on hover
  const heroSection = document.getElementById("home");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopAutoplay);
    heroSection.addEventListener("mouseleave", startAutoplay);
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (heroTrack) {
    heroTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  // Initialize first slide and start autoplay
  goToSlide(0);
  startAutoplay();

  /* ==========================================================
     2. MOBILE HAMBURGER MENU
  ========================================================== */
  function toggleMenu() {
    if (!hamburger || !navMenu) return;
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    if (!hamburger || !navMenu) return;
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Close menu when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (
      navMenu &&
      navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ==========================================================
     3. SMOOTH SCROLLING FOR ANCHOR LINKS
  ========================================================== */
  const NAVBAR_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || targetId === "") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const top =
        targetEl.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ==========================================================
     4. SCROLL ANIMATIONS (Intersection Observer)
  ========================================================== */
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (animatedElements.length) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          // Stagger child animations inside grids / lists
          const children = entry.target.querySelectorAll(
            ".grid > *, .card, .feature-card, .amenity-card, .stat-item"
          );
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
          });

          scrollObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((el) => scrollObserver.observe(el));
  }

  /* ==========================================================
     5. GALLERY LIGHTBOX
  ========================================================== */
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox     = document.querySelector(".lightbox");
  const lbImage      = lightbox && lightbox.querySelector("img");
  const lbClose      = lightbox && lightbox.querySelector(".lightbox-close");
  const lbPrev       = lightbox && lightbox.querySelector(".lightbox-prev");
  const lbNext       = lightbox && lightbox.querySelector(".lightbox-next");
  let currentIndex   = 0;

  /** Return an array of currently visible gallery items (respects filters). */
  function getVisibleItems() {
    return Array.from(galleryItems).filter(
      (item) => item.style.display !== "none"
    );
  }

  function openLightbox(index) {
    if (!lightbox || !lbImage) return;
    const visible = getVisibleItems();
    if (index < 0 || index >= visible.length) return;

    currentIndex = index;
    const img = visible[index].querySelector("img");
    lbImage.src = img ? img.src : "";
    lbImage.alt = img ? img.alt : "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function navigateLightbox(direction) {
    const visible = getVisibleItems();
    currentIndex =
      (currentIndex + direction + visible.length) % visible.length;
    const img = visible[currentIndex].querySelector("img");
    if (lbImage && img) {
      lbImage.src = img.src;
      lbImage.alt = img.alt;
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      openLightbox(idx !== -1 ? idx : 0);
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev)  lbPrev.addEventListener("click", () => navigateLightbox(-1));
  if (lbNext)  lbNext.addEventListener("click", () => navigateLightbox(1));

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard: Escape / Arrow keys
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   navigateLightbox(-1);
    if (e.key === "ArrowRight")  navigateLightbox(1);
  });

  /* ==========================================================
     6. GALLERY CATEGORY FILTER
  ========================================================== */
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;

        if (shouldShow) {
          item.style.display = "";
          requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          });
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          // Hide after fade-out transition
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  /* ==========================================================
     7. FAQ ACCORDION
  ========================================================== */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer   = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other open items
      faqItems.forEach((other) => {
        if (other === item) return;
        other.classList.remove("active");
        const otherAnswer = other.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current item
      item.classList.toggle("active");
      if (!isActive) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================
     8. BACK TO TOP BUTTON
  ========================================================== */
  const TOP_BTN_THRESHOLD = 400;

  function handleBackToTop() {
    if (!btnTop) return;
    if (window.scrollY > TOP_BTN_THRESHOLD) {
      btnTop.classList.add("visible");
    } else {
      btnTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleBackToTop, { passive: true });

  if (btnTop) {
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================
     9. CONTACT FORM HANDLING
  ========================================================== */
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name  = contactForm.querySelector('[name="name"]');
      const phone = contactForm.querySelector('[name="phone"]');
      const email = contactForm.querySelector('[name="email"]');

      // Basic validation
      let valid = true;
      [name, phone, email].forEach((field) => {
        if (field && !field.value.trim()) {
          field.classList.add("error");
          valid = false;
        } else if (field) {
          field.classList.remove("error");
        }
      });

      // Email format check
      if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.classList.add("error");
          valid = false;
        }
      }

      // Phone format check (basic — at least 10 digits)
      if (phone && phone.value.trim()) {
        const digits = phone.value.replace(/\D/g, "");
        if (digits.length < 10) {
          phone.classList.add("error");
          valid = false;
        }
      }

      if (!valid) {
        alert("Please fill in all required fields correctly.");
        return;
      }

      // Success (no backend)
      alert(
        "Thank you for your interest in Jana Harsha Plots! We will get back to you shortly."
      );
      contactForm.reset();
    });
  }

  /* ==========================================================
     10. COUNTER ANIMATION
  ========================================================== */
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute("data-target"), 10);
    if (isNaN(target)) return;

    const duration = 2000; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(ease * target);

      el.textContent = current.toLocaleString() + "+";

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + "+";
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => counterObserver.observe(num));
  }

  /* ==========================================================
     11. NAVBAR ACTIVE LINK HIGHLIGHTING
  ========================================================== */
  function highlightActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - NAVBAR_HEIGHT - 50;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightActiveLink, { passive: true });

  /* ==========================================================
     12. IMAGE LAZY LOADING ENHANCEMENT
  ========================================================== */
  document.querySelectorAll("img").forEach((img) => {
    // Add native lazy loading if not already set
    if (!img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }

    // Fade-in effect when the image finishes loading
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s ease";

    function reveal() {
      img.style.opacity = "1";
    }

    if (img.complete) {
      reveal();
    } else {
      img.addEventListener("load", reveal);
      // Fallback — ensure visibility even if load event never fires
      img.addEventListener("error", reveal);
    }
  });

  /* ==========================================================
     13. HERO TEXT ANIMATION (Typing / Reveal)
  ========================================================== */
  const heroSubtitle = document.querySelector(".hero-subtitle");

  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = "";
    heroSubtitle.style.borderRight = "2px solid currentColor";

    let charIndex = 0;
    const typingSpeed = 50; // ms per character

    function typeChar() {
      if (charIndex < text.length) {
        heroSubtitle.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        // Remove cursor after typing completes
        setTimeout(() => {
          heroSubtitle.style.borderRight = "none";
        }, 1200);
      }
    }

    // Slight delay before typing starts
    setTimeout(typeChar, 600);
  }

  /* ==========================================================
     14. UTILITIES & INITIALISATION
  ========================================================== */

  // Run scroll-dependent functions once on load (page may already be scrolled)
  handleNavbarScroll();
  handleBackToTop();
  highlightActiveLink();

  // Debounce helper (used internally if needed later)
  // function debounce(fn, delay = 100) {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => fn.apply(this, args), delay);
  //   };
  // }

  console.log("Jana Harsha Plots — script loaded ✓");
});
