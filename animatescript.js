/** @format */

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".fade-in");

  // List of animations to randomly assign
  const animations = [
    "fade-in1",
    "slide-in-left",
    "slide-in-right",
    "zoom-in",

    "bounce-in",
  ];

  // Assign a random animation class to each element
  elements.forEach((el) => {
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];
    el.classList.add(randomAnimation);
  });

  // Intersection Observer for smooth card animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate cards on scroll
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.classList.add("fade-in");
    card.style.transitionDelay = `${index * 100}ms`;
    observer.observe(card);
  });

  // Touch feedback for mobile devices
  cards.forEach((card) => {
    card.addEventListener("touchstart", () => {
      card.style.transform = "scale(0.98)";
    });

    card.addEventListener("touchend", () => {
      card.style.transform = "scale(1)";
    });
  });

  // Smooth navigation transitions
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        document.body.style.opacity = "0";
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });

  // Loading screen animation
  window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  });

  // Pull to refresh functionality
  let touchStart = 0;
  let touchEnd = 0;

  document.addEventListener("touchstart", (e) => {
    touchStart = e.touches[0].clientY;
  });

  document.addEventListener("touchmove", (e) => {
    touchEnd = e.touches[0].clientY;
  });

  document.addEventListener("touchend", () => {
    if (touchStart < touchEnd && window.scrollY === 0) {
      // Add pull-to-refresh animation
      const header = document.querySelector(".header-section");
      if (header) {
        header.classList.add("refreshing");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  });

  // Lazy loading images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Dark mode toggle with system preference detection
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem(
        "darkMode",
        document.documentElement.classList.contains("dark")
      );
    });
  }

  // Initialize dark mode based on system preference or saved preference
  if (
    localStorage.getItem("darkMode") === "true" ||
    (!localStorage.getItem("darkMode") && prefersDark.matches)
  ) {
    document.documentElement.classList.add("dark");
  }
});
