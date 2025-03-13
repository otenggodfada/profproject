// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtaftgrL4p4wqNC2w211mUi8amkjw2kzM",
    authDomain: "profstudymate-6d0fc.firebaseapp.com",
    projectId: "profstudymate",
    storageBucket: "profstudymate.appspot.com",
    messagingSenderId: "141453158869",
    appId: "1:141453158869:web:d4ded426a90e9937e2f55c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Fetch and Populate Categories
async function loadCategories() {
  const categoriesRef = collection(db, "categories");
  const snapshot = await getDocs(categoriesRef);
  
  const coursesDropdown = document.getElementById("courses-link");
  if (!coursesDropdown) return;

  // Create a dropdown container
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add(
    "absolute", "hidden", "group-hover:block",
    "bg-black", "text-white", "mt-2",
    "rounded-lg", "shadow-lg", "w-48"
  );

  // Loop through categories and create links
  snapshot.forEach((doc) => {
    const category = doc.data();
    const categoryLink = document.createElement("a");
    categoryLink.href = `./courses.html?title1=${encodeURIComponent(category.name)}`;
    categoryLink.textContent = category.name;
    categoryLink.classList.add("block", "px-4", "py-2", "hover:bg-gray-700", "rounded-md");

    dropdownContainer.appendChild(categoryLink);
  });

  // Append dropdown to the courses link container
  coursesDropdown.appendChild(dropdownContainer);

  // Enable dropdown behavior
  coursesDropdown.classList.add("relative", "group");
  coursesDropdown.addEventListener("mouseenter", () => dropdownContainer.classList.remove("hidden"));
  coursesDropdown.addEventListener("mouseleave", () => dropdownContainer.classList.add("hidden"));
}

// Load categories when the page loads
document.addEventListener("DOMContentLoaded", loadCategories);
