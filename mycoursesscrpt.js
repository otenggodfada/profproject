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
    courseContainer.innerHTML = '<p class="text-center text-gray-500">No courses purchased.</p>';
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
    courseCard.className = 'p-3 shadow-xl rounded-lg overflow-hidden cursor-pointer';

    courseCard.innerHTML = `
      <div class="shadow-2xl rounded-lg overflow-hidden transition duration-300 cursor-pointer mt-[150px] ">
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

      <div class="p-4 bg-gray-800">
        <p class="text-gray-500 text-sm mb-2">Language: <span class="font-medium">${language || 'Not specified'}</span></p>
        
        <!-- Tags Section -->
        <div class="text-sm text-gray-500 mb-4">
          <strong class="font-medium">Tags:</strong> ${tags.length > 0 ? tags.join(', ') : 'None'}
        </div>
        
        <!-- Show More Details -->
        <details class="text-sm text-gray-500 mb-4">
          <summary class="cursor-pointer text-blue-500 hover:text-blue-700">Show More</summary>
          <div class="mt-2">
            <p class="text-gray-500">${meta?.description || 'No description available.'}</p>
                <!-- Sections and Lessons List -->
        <div class="mt-4">
          <strong class="font-medium text-gray-500">Sections:</strong>
          <div class="space-y-4 mt-2">
            ${sections.map((section, sectionIndex) => `
              <div class="p-4 bg-gray-700 rounded-lg">
                <h4 class="text-xl text-gray-200">${section.name}</h4>
                
                <!-- Toggle Lessons Button -->
                <button onclick="toggleLessons(${sectionIndex})" class="text-blue-500 text-sm mt-2">
                  Show Lessons
                </button>

                <!-- Lessons Container -->
                <div id="lessons-container-${sectionIndex}" class="mt-2 hidden">
                  <ul class="list-disc pl-5 text-gray-400 text-sm">
                    ${section.lessons.map(lesson => `
                      <li>
                        <strong class="text-gray-300">${lesson.name}</strong>
                        <p class="text-gray-400">Type: ${lesson.content_type}</p>
                        <p class="text-gray-400">Description: ${lesson.description || 'No description available'}</p>
                        ${lesson.quiz ? `<p class="text-gray-400">Quiz: ${lesson.quiz}</p>` : ''}
                        <a href="${lesson.video_url || '#'}" target="_blank" class="text-blue-500 text-sm">Watch Lesson Video</a>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
          </div>
        </details>

        <!-- Watch Video Link -->
        <a href="${video_url || '#'}" target="_blank" class="inline-block text-blue-500 hover:text-blue-700 text-sm mb-2">Watch Course Video</a>

    

        <!-- Button for continuing -->
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200 transform hover:scale-105">
          Continue Learning
        </button>
      </div>
    `;

    courseContainer.appendChild(courseCard);
  });
}

// Toggle lessons visibility
function toggleLessons(sectionIndex) {
  const lessonsContainer = document.getElementById(`lessons-container-${sectionIndex}`);
  const button = lessonsContainer.previousElementSibling;

  // Toggle visibility
  lessonsContainer.classList.toggle('hidden');

  // Change button text based on visibility
  if (lessonsContainer.classList.contains('hidden')) {
    button.textContent = 'Show Lessons';
  } else {
    button.textContent = 'Hide Lessons';
  }
}




// Main function to load user purchased courses
async function loadPurchasedCourses(userId) {
  const courses = await fetchPurchasedCourses(userId);
  renderCourses(courses);
}

// Initialize the page
document.getElementById('app').innerHTML = `
  <div class="min-h-screen bg-gray-900 text-white ">
   <div class="fixed bg-[#172554] px-5 z-20 w-full ">
       
          <div id="navbar-container"></div></div>
    <div id="course-container" class="space-y-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:mr-40 lg:ml-40">
     <div class=" fixed top-0 right-0 bottom-0 left-0 ">
  <div class="text-center flex flex-col items-center justify-center w-screen h-screen">
    <div class="animate-spin  rounded-full h-16 w-16 border-t-4 border-b-4 border-[#f5f5f5] "></div>
    <p class="text-[#dbdbdb] text-lg font-semibold">Loading...</p>
  </div>
</div>
    </div>
  </div>
`;

// Fetch and load courses for the authenticated user
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadPurchasedCourses(user.uid);
  } else {
    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = '<p class="text-center text-gray-500">Please log in to view your courses.</p>';
  }
});
