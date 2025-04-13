document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in");

    // List of animations to randomly assign
    const animations = [
        "fade-in1",
        "slide-in-left",
        "slide-in-right",
        "zoom-in",
      
        "bounce-in"
    ];

    // Assign a random animation class to each element
    elements.forEach(el => {
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        el.classList.add(randomAnimation);
    });

    // Intersection Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    elements.forEach((el) => observer.observe(el));
});
