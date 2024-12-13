// async function loadNavbar() {
//   try {
//     const response = await fetch("store.html");
//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.statusText}`);
//     }
//     const navbar = await response.text();
//     const bookshElement = document.getElementById("booksh");
//     if (bookshElement) {
//       bookshElement.innerHTML = navbar;
//     } else {
//       console.error("Element with ID 'booksh' not found.");
//     }
//   } catch (error) {
//     console.error("Failed to fetch navbar:", error);
//   }
// }

// document.addEventListener("DOMContentLoaded", loadNavbar);
