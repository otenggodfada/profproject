// Create and insert the dark mode button into every page
function insertDarkModeButton() {
    const buttonHTML = `
        <button id="toggleDarkMode" 
            class="fixed z-50 bottom-24 left-5 flex items-center  px-3 py-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-500">
            <svg id="sunIcon" class="w-6 h-6 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 3v2m4.243 1.757l-1.414 1.414m4.95 2.829h-2M12 19v2m-4.243-1.757l1.414-1.414m-4.95-2.829h2M5.636 5.636l1.414 1.414M21 12h-2M3 12H1"></path>
            </svg>
            <svg id="moonIcon" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 12.79A9 9 0 0112.21 3 7.5 7.5 0 1021 12.79z"></path>
            </svg>
            <span id="toggleText" class="text-sm"></span>
        </button>
    `;

    // Add the button to the body
    document.body.insertAdjacentHTML("beforeend", buttonHTML);

    // Add functionality
    setupDarkMode();
}

// Function to handle dark mode
function setupDarkMode() {
    const toggleButton = document.getElementById("toggleDarkMode");
    const html = document.documentElement; // Use <html> instead of <body>
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");
    const toggleText = document.getElementById("toggleText");

    // Load stored theme preference
    if (localStorage.getItem("theme") === "dark") {
        html.classList.add("dark");
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
        toggleText.textContent = "";
    } else {
        toggleText.textContent = "";
    }

    toggleButton.addEventListener("click", () => {
        const isDark = html.classList.toggle("dark");

        if (isDark) {
            localStorage.setItem("theme", "dark");
            sunIcon.classList.remove("hidden");
            moonIcon.classList.add("hidden");
            toggleText.textContent = "";
        } else {
            localStorage.setItem("theme", "light");
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");
            toggleText.textContent = "";
        }
    });
}

// Run the script when the page loads
document.addEventListener("DOMContentLoaded", insertDarkModeButton);
