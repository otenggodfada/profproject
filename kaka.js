/** @format */

function createBottomNav() {
  const nav = document.createElement("nav");
  nav.className =
    "fixed bottom-0 z-50 left-0 right-0 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-xl md:hidden";

  const navContainer = document.createElement("div");
  navContainer.className = "flex justify-around items-center py-3 px-4";

  const links = [
    { id: "/", href: "/?title=/", icon: "fas fa-home", text: "Home", file: "" },
    {
      id: "courses",
      href: "courses.html?title=courses",
      icon: "fas fa-book",
      text: "Courses",
      file: "courses.html",
    },
    {
      id: "shop",
      href: "store.html",
      icon: "fas fa-shopping-cart",
      text: "Shop",
      file: "store.html",
    },
    {
      id: "meeting",
      href: "meeting.html?title=meeting",
      icon: "fas fa-video",
      text: "Meeting",
      file: "meeting.html",
    },
    {
      id: "account",
      href: "mprofilepage.html?title=account",
      icon: "fas fa-user",
      text: "Account",
      file: "mprofilepage.html",
    },
  ];

  // Extract the last segment of the pathname to check active tab
  const currentPath = window.location.pathname.split("/").pop();

  // Create floating indicator
  const floatingIndicator = document.createElement("div");
  floatingIndicator.className =
    "absolute bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out";
  navContainer.appendChild(floatingIndicator);

  links.forEach((link, index) => {
    const anchor = document.createElement("a");
    anchor.id = link.id;
    anchor.href = link.href;
    anchor.className =
      "nav-link flex flex-col items-center text-gray-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer relative group flex-1";

    // Check if the current path matches the link's filename
    if ((currentPath === "" && link.id === "/") || currentPath === link.file) {
      anchor.classList.add("text-white", "font-medium");
      // Position the floating indicator
      const indicatorWidth = 100 / links.length;
      floatingIndicator.style.width = `${indicatorWidth}%`;
      floatingIndicator.style.left = `${index * indicatorWidth}%`;
    }

    const iconContainer = document.createElement("div");
    iconContainer.className =
      "relative p-2 rounded-full group-hover:bg-white/10 transition-all duration-300";

    const icon = document.createElement("i");
    icon.className = `${link.icon} text-xl transform group-hover:scale-110 transition-transform duration-300`;

    const text = document.createElement("span");
    text.className =
      "text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded-md whitespace-nowrap";
    text.textContent = link.text;

    // Add subtle glow effect for active items
    if ((currentPath === "" && link.id === "/") || currentPath === link.file) {
      iconContainer.classList.add(
        "bg-gradient-to-r",
        "from-blue-500/20",
        "to-purple-500/20"
      );
      icon.classList.add(
        "text-transparent",
        "bg-clip-text",
        "bg-gradient-to-r",
        "from-blue-400",
        "to-purple-400"
      );
    }

    iconContainer.appendChild(icon);
    anchor.appendChild(iconContainer);
    anchor.appendChild(text);
    navContainer.appendChild(anchor);
  });

  nav.appendChild(navContainer);
  document.body.appendChild(nav);
}

document.addEventListener("DOMContentLoaded", createBottomNav);