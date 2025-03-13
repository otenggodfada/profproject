const options = {
    bottom: '100px', // Adjusted position
    left: '10px',
    time: '0.5s', // Smooth transition
    mixColor: '#fff',
    backgroundColor: '#fff',
    buttonColorDark: '#100f2c',
    buttonColorLight: '#fff',
    saveInCookies: true,
    label: '🌓',
    autoMatchOsTheme: true
  };
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();
  
  setTimeout(() => {
    const darkModeButton = document.querySelector('.darkmode-toggle');
    if (darkModeButton) {
      darkModeButton.style.zIndex = "9999"; // Ensures visibility
      darkModeButton.style.position = "fixed"; // Fixed positioning
      darkModeButton.style.borderRadius = "50%"; // Round button
      darkModeButton.style.padding = "10px"; // Better spacing
      darkModeButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Subtle shadow
      darkModeButton.style.transition = "all 0.3s ease-in-out"; // Smooth hover effect
  
      darkModeButton.addEventListener("mouseenter", () => {
        darkModeButton.style.transform = "scale(1.1)"; // Slight hover effect
      });
  
      darkModeButton.addEventListener("mouseleave", () => {
        darkModeButton.style.transform = "scale(1)"; // Reset on mouse leave
      });
    }
  }, 100);
  