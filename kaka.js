function createBottomNav() {
    const nav = document.createElement("nav");
    nav.className = "fixed bottom-0 z-50 left-0 right-0 bg-[#242525] shadow-lg border-t border-gray-300 md:hidden";
    
    const navContainer = document.createElement("div");
    navContainer.className = "flex justify-around items-center py-3";
    
    const links = [
        { id: "/", href: "/?title=/", icon: "fas fa-home", text: "Home", file: "" },
        { id: "courses", href: "courses.html?title=courses", icon: "fas fa-book", text: "Courses", file: "courses.html" },
        { id: "shop", href: "store.html?title=shop", icon: "fas fa-shopping-cart", text: "Shop", file: "store.html" },
        { id: "meeting", href: "meeting.html?title=meeting", icon: "fas fa-video", text: "Meeting", file: "meeting.html" },
        { id: "account", href: "mprofilepage.html?title=account", icon: "fas fa-user", text: "Account", file: "mprofilepage.html" }
        
    ];

    // Extract the last segment of the pathname to check active tab
    const currentPath = window.location.pathname.split("/").pop();

    links.forEach(link => {
        const anchor = document.createElement("a");
        anchor.id = link.id;
        anchor.href = link.href;
        anchor.className = "nav-link flex flex-col items-center text-white hover:text-blue-400 cursor-pointer";
        
        // Check if the current path matches the link's filename
        if ((currentPath === "" && link.id === "/") || currentPath === link.file) {
            anchor.classList.add("text-blue-400", "font-bold");
        }
        
        const icon = document.createElement("i");
        icon.className = `${link.icon} text-xl`;
        
        const text = document.createElement("span");
        text.className = "text-xs";
        text.textContent = link.text;
        
        anchor.appendChild(icon);
        anchor.appendChild(text);
        navContainer.appendChild(anchor);
    });
    
    nav.appendChild(navContainer);
    document.body.appendChild(nav);
}

document.addEventListener("DOMContentLoaded", createBottomNav);
