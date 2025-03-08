// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtaftgrL4p4wqNC2w211mUi8amkjw2kzM",
  authDomain: "profstudymate-6d0fc.firebaseapp.com",
  projectId: "profstudymate",
  storageBucket: "profstudymate.appspot.com",
  messagingSenderId: "141453158869",
  appId: "1:141453158869:web:d4ded426a90e9937e2f55c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Fetch user purchased courses along with sections and lessons
async function fetchPurchasedCourses(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error('User not found');
      return [];
    }

    const { course_id: purchasedCourseIds } = userDoc.data();

    if (!Array.isArray(purchasedCourseIds) || purchasedCourseIds.length === 0) {
      return [];
    }

    const coursePromises = purchasedCourseIds.map(async (courseId) => {
      const courseDocRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseDocRef);

      if (!courseDoc.exists()) return null; // In case the course doesn't exist

      const courseData = courseDoc.data();

      // Fetch sections for this course
      const sectionsQuerySnapshot = await getDocs(collection(courseDocRef, 'sections'));
      const sections = [];

      // Fetch lessons for each section
      for (const sectionDoc of sectionsQuerySnapshot.docs) {
        const sectionData = sectionDoc.data();
        const lessonsQuerySnapshot = await getDocs(collection(sectionDoc.ref, 'lessons'));
        const lessons = lessonsQuerySnapshot.docs.map(lessonDoc => lessonDoc.data());

        sections.push({
          name: sectionData.name,
          lessons,
        });
      }

      return {
        id: courseDoc.id,
        ...courseData,
        sections, // Adding sections and their lessons to the course
      };
    });

    // Filter out any null values in case some courses don't exist
    const courseDocs = (await Promise.all(coursePromises)).filter(course => course !== null);
    return courseDocs;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Render purchased courses to the page
function renderCourses(courses) {
  const courseContainer = document.getElementById('course-container');
  courseContainer.innerHTML = '';

  if (courses.length === 0) {
    courseContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center h-[60vh] text-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422M12 14l-6.16-3.422M12 14v7M12 14l6.16-3.422" />
      </svg>
      <p class="text-2xl font-semibold opacity-80 mt-4">No Courses Purchased</p>
      <p class="text-sm opacity-60 mt-2 text-center">Browse our catalog and start learning today!</p>
    
        <div class="lg:px-48 mt-4">
            <div onclick="window.location.href='courses.html';" class="p-4 bg-[#172554] border rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-3 shadow-md w-40 cursor-pointer">
              Explore Courses
            </div>
          </div>
    </div>
  `;
  
  
    return;
  }

  courses.forEach(course => {
    const { 
      name, 
      meta,
      rating,
      students,
      video_url, 
      tags = [], 
      language, 
      image_url, 
      sections = [] // Sections with lessons
    } = course;

    const courseCard = document.createElement('div');
    courseCard.className = '  relative shadow-2xl rounded-lg overflow-hidden cursor-pointer border border-gray-500 bg-gray-900 m-3 hover:shadow-pink-500/50 hover:border-pink-500/70';

    courseCard.innerHTML = `
      <div class=" overflow-hidden transition duration-300 cursor-pointer ">
        <img src="${image_url}" alt="${name}" class="w-full object-cover" />
        <div class="p-4  rounded-b-lg">
          <h3 class="text-lg font-semibold text-gray-400 flex items-center gap-2 mb-2">
            <span class="material-icons text-[#172554]">school</span>
            ${name}
          </h3>
          <p class="text-gray-200 text-sm flex items-center gap-2 mb-2">
            <span class="material-icons text-[#172554]">group</span>
            ${students || 0} students
          </p>
          <p class="text-gray-200 text-sm flex items-center gap-2 mb-4">
            <span class="material-icons text-yellow-500">star</span>
            Rating: ${rating || 0}/5
          </p>
        </div>
      </div>

      <div class="p-4 ">
        <p class="text-gray-500 text-sm mb-2">Language: <span class="font-medium">${language || 'Not specified'}</span></p>
        
        <!-- Tags Section -->
        <div class="text-sm text-gray-500 mb-4">
          <strong class="font-medium">Tags:</strong> ${tags.length > 0 ? tags.join(', ') : 'None'}
        </div>
        
        <!-- Show More Details -->
           <details class="text-sm text-gray-500 mb-4">
   
          <div class="mt-2">
            <p class="text-gray-500">${meta?.description || 'No description available.'}</p> </details>

              <!-- Start Learning -->
   
     <div class="flex w-full items-center justify-center space-x-2 border border-blue-500 text-blue-500 px-4 py-4 rounded-md hover:bg-blue-500 hover:text-white transition">
            <details  class="">
            <summary class="font-semibold cursor-pointer list-none">  <i class="fas fa-book-open"></i>
    <span>Continue Learning</span></summary>
                <!-- Sections and Lessons List -->
<div id="modal-container" class="fixed top-0 bottom-0 z-50 inset-0 flex items-center justify-center bg-black ">
  <div class="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto scrollbar-hide ">
    
    <!-- Close Button -->
    <button onclick="closeModal();" class="absolute top-4 right-4 text-gray-400 hover:text-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    
    <h2 class="text-2xl font-bold text-gray-200 flex items-center gap-2 border-b border-gray-700 p-4">
      <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h11M9 21V3m7 0l4 4m0 0l-4 4m4-4H13"></path>
      </svg>
      Course Sections
    </h2>
    
 <div class="space-y-6 p-6 max-w-4xl mx-auto">
  ${sections.map((section, sectionIndex) => `
    <div class="bg-gray-900 p-5 rounded-lg shadow-xl border border-gray-800">
    
      <button onclick="
        const container = document.getElementById('lessons-container-${sectionIndex}');
        container.classList.toggle('hidden');
        this.querySelector('.arrow-icon').classList.toggle('rotate-180');
      " 
      class="w-full flex justify-between items-center bg-purple-600 text-white px-5 py-4 rounded-lg hover:bg-purple-700 transition-all duration-300">
        <span class="text-xl font-semibold flex items-center gap-3">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          ${section.name}
        </span>
        <svg class="w-5 h-5 text-white transition-transform arrow-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
  
      <div id="lessons-container-${sectionIndex}" class="mt-4 hidden space-y-3">
        ${section.lessons.map((lesson, lessonIndex) => `
          <div class="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 relative">
            <button onclick="
              const lessonDetails = document.getElementById('lesson-details-${sectionIndex}-${lessonIndex}');
              lessonDetails.classList.toggle('hidden');
              this.querySelector('.lesson-arrow').classList.toggle('rotate-180');
            " 
            class="w-full flex justify-between items-center text-gray-300 text-lg font-semibold hover:text-white transition">
              <span class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.58M6.16 10.42L12 14v7"></path>
                </svg>
                ${lesson.name}
              </span>
              <svg class="w-4 h-4 text-gray-400 transition-transform lesson-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div id="lesson-details-${sectionIndex}-${lessonIndex}" class="hidden mt-3 text-gray-400 text-sm space-y-2">
              <p><span class="font-medium text-gray-300">Type:</span> ${lesson.content_type}</p>
              <p>${lesson.description || '<span class="italic text-gray-500">No description available</span>'}</p>
              ${lesson.quiz ? `<p class="text-green-400 font-medium">✅ Quiz Available</p>` : ''}
              
              ${lesson.video_url ? `
                <div class="relative mt-4 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                  <button onclick="openFullScreen('${sectionIndex}', '${lessonIndex}')" 
                    class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded-md hover:bg-opacity-75 transition">
                    ⛶ Full Screen
                  </button>
                  <iframe class="w-full h-64 rounded-lg" src="${lesson.video_url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>
                </div>
              ` : '<p class="italic text-gray-500">No video available</p>'}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}
</div>

<!-- Full-Screen Overlay -->
<div id="fullscreen-overlay" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center hidden z-50">
  <div class="relative w-full max-w-5xl p-4">
    <button onclick="closeFullScreen()" 
      class="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition">
      ✖ Close
    </button>
    <div id="fullscreen-content" class="w-full h-screen flex items-center justify-center"></div>
  </div>
</div>
  </div>
</div>
</details>
<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>

</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>

</details>

<style>
  .full-height {
    max-height: 80vh;
    overflow-y: auto;
  }
</style>

</div>
          </div>
        </div>

   

    

   
      </div>
    `;

    courseContainer.appendChild(courseCard);
  }
);

  
}

// Toggle lessons visibility
document.querySelectorAll(".toggle-lessons").forEach((button) => {
  button.addEventListener("click", function () {
    const sectionIndex = this.getAttribute("data-section-index");
    const container = document.getElementById(`lessons-container-${sectionIndex}`);
    
    if (container) {
      container.classList.toggle("hidden");
      this.textContent = container.classList.contains("hidden") ? "Show Lessons" : "Hide Lessons";
    }
  });
});




// Main function to load user purchased courses
async function loadPurchasedCourses(userId) {
  const courses = await fetchPurchasedCourses(userId);
  renderCourses(courses);
}

// Initialize the page


// Fetch and load courses for the authenticated user
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadPurchasedCourses(user.uid);
  } else {
    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = '<p class="text-center text-gray-500">Please log in to view your courses.</p>';
  }
});

// Show Lessons

