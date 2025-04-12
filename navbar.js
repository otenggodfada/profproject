/** @format */

async function loadNavbar() {
  const response = await fetch("navbar.html");
  const navbar = await response.text();
  document.getElementById("navbar-container").innerHTML = navbar;

  // Add event listener for mobile menu button
  const btn = document.querySelector("button.mobile-menu-button");
  const menu = document.querySelector(".mobile-menu");
  const drp = document.getElementById("sinb");
  const drp1 = document.getElementById("sinm");

  const response1 = await fetch("profilepage.html");
  const navbar1 = await response1.text();
  document.getElementById("textDiv").innerHTML = navbar1;
  document.getElementById("textDiv1").innerHTML = navbar1;
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
  // on mouse over
  drp.addEventListener("click", () => {
    window.location.href = "mprofilepage.html";
  });

  drp1.addEventListener("click", () => {
    document.getElementById("textDiv1").classList.remove("hidden");
    document.getElementById("textDiv1").classList.add("absolute");
  });
  //goto editprofile page
  // document.getElementById("editProfilebtn").addEventListener("click", () => {
  //   window.location.href = "editprofile.html";
  // });
  // on mouse out
  document.getElementById("textDiv").addEventListener("click", () => {
    // Redirect to edit profile page
    document.getElementById("textDiv").classList.add("hidden");
  });

  document.getElementById("closeit").addEventListener("click", () => {
    // Redirect to edit profile page
    document.getElementById("textDiv").classList.add("hidden");
    document.getElementById("textDiv1").classList.add("hidden");
  });

  document.getElementById("admin-panel").addEventListener("click", () => {
    window.location.href = "https://profstudymateadmin.com/";
  });
}

document.addEventListener("DOMContentLoaded", loadNavbar);

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  const navbar = document.createElement("nav");
  navbar.className =
    "bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 transition-all duration-300";
  navbar.setAttribute("id", "main-nav");

  navbar.innerHTML = `
        <div class="max-w-screen-xl mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo and Brand -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="index.html" class="flex items-center gap-2">
                        <img src="/assets/logo.svg" alt="Logo" class="h-8 w-auto">
                        <span class="text-white font-bold text-lg">ProfStudymate</span>
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-button" class="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span class="sr-only">Open main menu</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex lg:items-center lg:space-x-4">
                    <a href="courses.html" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Courses</a>
                    <a href="store.html" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Store</a>
                    <a href="support.html" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Support</a>
                    <div class="relative group">
                        <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                            More
                            <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                            <div class="py-1">
                                <a href="aboutus.html" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">About Us</a>
                                <a href="privacy-policy.html" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="terms_conditions.html" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Terms & Conditions</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile and Cart -->
                <div class="hidden lg:flex lg:items-center lg:space-x-4">
                    <a href="cart.html" class="relative text-gray-300 hover:text-white p-2 rounded-full transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" id="cart-count">0</span>
                    </a>
                    <a href="myprofile.html" class="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span id="username-display">My Profile</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="lg:hidden hidden bg-gray-800 shadow-xl rounded-b-xl overflow-hidden transition-all duration-300">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a href="courses.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">Courses</a>
                <a href="store.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">Store</a>
                <a href="support.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">Support</a>
                <a href="aboutus.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">About Us</a>
                <a href="privacy-policy.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">Privacy Policy</a>
                <a href="terms_conditions.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">Terms & Conditions</a>
            </div>
        </div>
    `;

  navbarContainer.appendChild(navbar);

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  let isMenuOpen = false;

  mobileMenuButton.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle("hidden");

    // Animate the menu button
    const icon = mobileMenuButton.querySelector("svg");
    if (isMenuOpen) {
      icon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
    } else {
      icon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  });

  // Hide mobile menu on larger screens
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      isMenuOpen = false;
      const icon = mobileMenuButton.querySelector("svg");
      icon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  });

  // Navbar scroll behavior
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });

  // Update username display if available
  const updateUsername = () => {
    const usernameDisplay = document.getElementById("username-display");
    const storedUsername = localStorage.getItem("username");
    if (usernameDisplay && storedUsername) {
      usernameDisplay.textContent = storedUsername;
    }
  };
  updateUsername();

  // Update cart count
  const updateCartCount = () => {
    const cartCount = document.getElementById("cart-count");
    const count = localStorage.getItem("cartCount") || "0";
    if (cartCount) {
      cartCount.textContent = count;
    }
  };
  updateCartCount();
});
