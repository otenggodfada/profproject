/** @format */

// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  query,
  where,
  orderBy,
  getFirestore,
  doc,
  addDoc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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
    // ✅ Fetch user's purchased courses along with expiry dates
    const userCoursesRef = collection(db, "users", userId, "Courses");
    const userCoursesSnapshot = await getDocs(userCoursesRef);

    if (userCoursesSnapshot.empty) {
      console.error("No purchased courses found");
      return [];
    }

    const purchasedCourses = userCoursesSnapshot.docs.map((doc) => ({
      course_id: doc.data().course_id,
      expire_date: doc.data().expire_date,
    }));

    if (purchasedCourses.length === 0) {
      return [];
    }

    // ✅ Fetch completed lessons in one query
    const completedLessonsSnapshot = await getDocs(
      collection(db, "users", userId, "completedLessons")
    );
    const completedLessons = new Set(
      completedLessonsSnapshot.docs.map((doc) => doc.id)
    );

    // ✅ Fetch course details
    const coursePromises = purchasedCourses.map((course) =>
      getDoc(doc(db, "courses", course.course_id))
    );
    const courseDocs = await Promise.allSettled(coursePromises);

    const validCourses = courseDocs
      .map((result, index) => {
        if (result.status === "fulfilled" && result.value.exists()) {
          return {
            id: result.value.id,
            ...result.value.data(),
            expire_date: purchasedCourses[index].expire_date, // ✅ Add expiry date
          };
        }
        return null;
      })
      .filter((course) => course !== null);

    // ✅ Fetch sections and reviews in parallel
    const sectionPromises = validCourses.map((course) =>
      getDocs(query(collection(db, "courses", course.id, "sections"), orderBy("order")))
    );
    const reviewPromises = validCourses.map((course) =>
      getDocs(collection(db, "courses", course.id, "reviews"))
    );

    const [sectionResults, reviewResults] = await Promise.all([
      Promise.allSettled(sectionPromises),
      Promise.allSettled(reviewPromises),
    ]);

    for (let i = 0; i < validCourses.length; i++) {
      // ✅ Process Sections & Lessons
      if (sectionResults[i].status === "fulfilled") {
        const sections = sectionResults[i].value.docs.map((sectionDoc) => ({
          id: sectionDoc.id,
          name: sectionDoc.data().name,
          lessons: [],
        }));

        const lessonPromises = sections.map((section) =>
          getDocs(query(collection(db, "courses", validCourses[i].id, "sections", section.id, "lessons"), orderBy("order")))
        );



        const lessonResults = await Promise.allSettled(lessonPromises);
        let totalLessons = 0;
        let completedCount = 0;

        lessonResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const lessons = result.value.docs.map((lessonDoc) => {
              totalLessons++;
              const isCompleted = completedLessons.has(lessonDoc.id);
              if (isCompleted) completedCount++;
              return {
                ...lessonDoc.data(),
                id: lessonDoc.id,
                completed: isCompleted,
              };
            });

            sections[index].lessons = lessons;
          }
        });

        validCourses[i].sections = sections;
        validCourses[i].totalLessons = totalLessons;
        validCourses[i].completedLessons = completedCount;
      }

      // ✅ Process Reviews & Calculate Average Rating
      if (reviewResults[i].status === "fulfilled") {
        const reviews = reviewResults[i].value.docs.map((reviewDoc) =>
          reviewDoc.data()
        );
        validCourses[i].reviews = reviews;

        const totalRatings = reviews.reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        );
        validCourses[i].averageRating =
          reviews.length > 0
            ? (totalRatings / reviews.length).toFixed(1)
            : "No ratings yet";
      }

      // ✅ Convert expire_date to a readable "YYYY-MM-DD" format
      if (validCourses[i].expire_date instanceof Timestamp) {
        const dateObj = validCourses[i].expire_date.toDate();
        validCourses[i].expire_date = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"
      }
    }

    return validCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

async function markLessonComplete(userId, lessonId) {
  try {
    console.log(`Marking lesson ${lessonId} as completed for user ${userId}`);

    const lessonRef = doc(db, "users", userId, "completedLessons", lessonId);
    await setDoc(lessonRef, {
      completed: true,
      timestamp: Date.now(),
    });

    console.log(`✅ Lesson ${lessonId} marked as completed in Firestore`);
  } catch (error) {
    console.error("❌ Error marking lesson complete:", error);
  }
}

async function submitReview(courseId, userId, rating, reviewText) {
  try {
    const reviewRef = collection(db, "courses", courseId, "reviews");
    await addDoc(reviewRef, {
      userId,
      rating: Number(rating),
      reviewText,
      timestamp: Date.now(),
    });

    console.log(`✅ Review submitted for course ${courseId}`);
  } catch (error) {
    console.error("❌ Error submitting review:", error);
  }
}

// Render purchased courses to the page
function renderCourses(courses) {
  const courseContainer = document.getElementById("course-container");
  courseContainer.innerHTML = "";

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

  courses.forEach((course) => {
    const hasLessons = course.sections.some(
      (section) => section.lessons.length > 0
    );
    const progress =
      course.totalLessons > 0
        ? Math.round((course.completedLessons / course.totalLessons) * 100)
        : 0;
    const courseCard = document.createElement("div");
    courseCard.className =
      "relative shadow-2xl rounded-lg overflow-hidden cursor-pointer border border-gray-500 bg-gray-900 m-3 hover:shadow-pink-500/50 hover:border-pink-500/70";

    courseCard.innerHTML = `
      <div class="overflow-hidden transition duration-300 cursor-pointer">
        <img src="${course.image_url}" alt="${
      course.name
    }" class="w-full object-cover" />
        <div class="p-4 rounded-b-lg">
          <h3 class="text-lg font-semibold text-gray-400 flex items-center gap-2 mb-2">
            <span class="material-icons text-[#172554]">school</span>
            ${course.name}
          </h3>
          <p class="text-gray-200 text-sm flex items-center gap-2 mb-2">
            <span class="material-icons text-[#172554]">group</span>
            ${course.students || 0} students
          </p>
       <p class="text-gray-200 text-sm flex items-center gap-2 mb-2">
  <span class="material-icons text-[#172554]">event</span>
  ${course.expire_date ? course.expire_date : "N/A"} expire date
</p>

          <!-- ⭐ Course Rating -->
          <p class="text-yellow-400 font-semibold mt-2">⭐ ${
            course.averageRating || "No ratings yet"
          }</p>

            <!-- ✅ Progress Bar -->
          <div class="mt-2">
            <p class="text-gray-300 text-sm mb-1">Progress: ${progress}%</p>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: ${progress}%"></div>
            </div>
          </div>
        
        </div>
      </div>
        </div>
      </div>
  
      <div class="p-4">
      
        <p class="text-gray-500 text-sm mb-2">Language: <span class="font-medium">${
          course.language || "Not specified"
        }</span></p>
  
        <div class="text-sm text-gray-500 mb-4">
          <strong class="font-medium">Tags:</strong> ${
            course.tags?.length > 0 ? course.tags.join(", ") : "None"
          }
        </div>
  
        ${
           course.expire_date && new Date(course.expire_date) >= new Date().setHours(0,0,0,0)  ? course.sections && course.sections.length > 0 && course.sections.some(section => section.lessons && section.lessons.length > 0)
            ? `
          <details   class=" mb-4 flex items-center justify-center  border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition">
            <summary onclick="turnonfixed()" class="font-semibold w-full h-full text-center cursor-pointer list-none">
              <i class="fas fa-book-open"></i> <span>Continue Learning</span>
            </summary>
            <div id="modal-container" style="display:fixed;" class="z-50 inset-0 w-screen   bg-black bg-opacity-80 flex items-center justify-center  ">
              <div class="bg-gray-900 h-screen overflow-auto scrollbar-hide max-w-2xl sm:w-screen
">
                <button onclick="toggleDetails()" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <h2 class="text-2xl font-bold text-gray-200 flex items-center gap-2 border-b border-gray-700 p-4">
                 <div> <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h11M9 21V3m7 0l4 4m0 0l-4 4m4-4H13"></path>
                  </svg></div>   ${course.name}
                </h2>

                        <!-- ✅ Progress Bar -->
          <div class="mt-2 mx-6">
            <p class="text-gray-300 text-sm mb-1">Progress: ${progress}%</p>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: ${progress}%"></div>
            </div>
          </div>
                <div class="space-y-6 p-2 max-w-4xl mx-auto">
                  ${course.sections
                    .map(
                      (section, sectionIndex) => `
                    <div class="bg-gray-900 p-2 rounded-lg shadow-xl border border-gray-800">
                      <button onclick="
                        const container = document.getElementById('lessons-container-${sectionIndex}');
                        container.classList.toggle('hidden');
                        this.querySelector('.arrow-icon').classList.toggle('rotate-180');
                      " 
                      class="w-full flex justify-between items-center bg-purple-600 text-white px-5 py-4 rounded-lg hover:bg-purple-700 transition-all duration-300">
                        <span class="text-xl font-semibold flex items-center gap-3">
                          <div><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
                          </svg></div> ${section.name}
                        </span>
    
                        <svg class="w-5 h-5 text-white transition-transform arrow-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      <div id="lessons-container-${sectionIndex}" class="mt-4 hidden space-y-3 relative">


                        ${section.lessons
                          .map(
                            (lesson, lessonIndex) => `
                          <div class="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 relative">
                            <button onclick="
                              const lessonDetails = document.getElementById('lesson-details-${sectionIndex}-${lessonIndex}');
                              lessonDetails.classList.toggle('hidden');
                              this.querySelector('.lesson-arrow').classList.toggle('rotate-180');
                            " 
                            class="w-full flex justify-between items-center text-gray-300 text-lg font-semibold hover:text-white transition">
                              <span class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.58M6.16 10.42L12 14v7"></path>
                                </svg> ${lesson.name}
                              </span>
                              <svg class="w-4 h-4 text-gray-400 transition-transform lesson-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                              </svg>
                              
                            </button>
                                                   <button onclick="toggleFullScreen('lessons-container-${sectionIndex}')" 
    class="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 transition">
    <i class="fas fa-expand"></i> <!-- FontAwesome Icon -->
  </button>
                            <div id="lesson-details-${sectionIndex}-${lessonIndex}" class="hidden mt-3 text-gray-400 text-sm space-y-2">
                              <p><span class="font-medium text-gray-300">Type:</span> ${
                                lesson.content_type
                              }</p>
                              <p>${
                                lesson.description ||
                                '<span class="italic text-gray-500">No description available</span>'
                              }</p>
                              ${
                                lesson.quiz
                                  ? `<p class="text-green-400 font-medium">✅ Quiz Available</p>`
                                  : ""
                              }
                              ${
                                lesson.video_url
                                  ? `
                                <div class="relative mt-4 rounded-lg overflow-hidden border border-gray-500 shadow-md">
    ${getVideoEmbedCode(lesson.video_url)}
  </div>
                              `
                                  : '<p class="italic text-gray-500">No video available</p>'
                              }
                            </div>
                               <button class="lesson-complete-btn mt-3 text-sm px-3 py-1 rounded-lg ${
                                 lesson.completed
                                   ? "bg-green-500 text-white"
                                   : "bg-gray-600 text-gray-300"
                               }" 
                                data-lesson-id="${lesson.id}" 
                                data-course-id="${course.id}">
                          ${
                            lesson.completed
                              ? "✔ Completed"
                              : "Mark as Complete"
                          }
                        </button>
                          </div>
                          
                        `
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </details> 
        `
        : `
        <div class="flex flex-row space-x-2">
          <details class="w-full mb-4 flex items-center justify-center border border-gray-500 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-500 hover:text-white transition">
            <summary style="pointer-events: none; user-select: none;" class="font-semibold cursor-pointer list-none">
              <i class="fas fa-exclamation-circle"></i> <span>No Lessons Available</span>
            </summary>
          </details>
        </div>
        ` 
  
        : ` <div class ="flex flex-row space-x-2">
            
            <details  class="w-full mb-4 flex items-center justify-center  border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition">
            <summary  style="pointer-events: none; user-select: none;" class="font-semibold cursor-pointer list-none">
              <i class="fas fa-lock"></i> <span>Expired Course</span>
            </summary>
       
          </details>   <button  onclick="window.location.href='courses.html?courseid=${encodeURIComponent(course.id)}'" class=" w-full mb-4 flex items-center justify-center  border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-white transition">
        <i class="fas fa-sync-alt"></i>
        Renew
    </button> 
            </div> ` 
        }
<!-- ✅ Review Form - Modern UI -->
<div class="mt-6 border-t border-gray-600 pt-4">
  <h4 class="text-gray-300 font-semibold mb-2">Leave a Review</h4>

  <!-- ⭐ Star Rating -->
  <div class="flex space-x-2 text-yellow-400 text-xl rating-stars" data-course-id="${
    course.id
  }">
    <i class="fas fa-star cursor-pointer" data-value="1"></i>
    <i class="fas fa-star cursor-pointer" data-value="2"></i>
    <i class="fas fa-star cursor-pointer" data-value="3"></i>
    <i class="fas fa-star cursor-pointer" data-value="4"></i>
    <i class="fas fa-star cursor-pointer" data-value="5"></i>
  </div>

  <!-- Hidden Input for Rating -->
  <input type="hidden" class="rating-value" data-course-id="${
    course.id
  }" value="5">

  <!-- Review Textarea -->
  <textarea class="review-text bg-gray-800 text-white p-3 rounded w-full mt-3 focus:ring-2 focus:ring-blue-500" 
    rows="3" placeholder="Write your review..." data-course-id="${
      course.id
    }"></textarea>

  <!-- Submit Button -->
  <!-- ✅ Submit Button with FA Icon -->
<button class="submit-review mt-4 flex items-center justify-between space-x-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition" data-course-id="${
      course.id
    }">
  <i class="fas fa-paper-plane mr-2"></i> Submit Review
</button>

</div>

    
      </div>
    `;

    courseContainer.appendChild(courseCard);
  });

  // Attach event listeners for submitting reviews
  document.querySelectorAll(".submit-review").forEach((button) => {
    button.addEventListener("click", async function () {
      const courseId = this.getAttribute("data-course-id");
      const userId = auth.currentUser?.uid;
      const rating = document.querySelector(
        `.rating-value[data-course-id="${courseId}"]`
      ).value;
      const reviewText = document.querySelector(
        `.review-text[data-course-id="${courseId}"]`
      ).value;

      if (!userId) {
        alert("Please log in to submit a review.");
        return;
      }

      await submitReview(courseId, userId, rating, reviewText);
      alert("Review submitted successfully!");
      fetchReviews(courseId);
    });
  });

  // ⭐ Handle Star Rating Selection
  document.querySelectorAll(".rating-stars").forEach((starContainer) => {
    const stars = starContainer.querySelectorAll("i");
    const courseId = starContainer.getAttribute("data-course-id");

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const ratingValue = star.getAttribute("data-value");
        document.querySelector(
          `.rating-value[data-course-id="${courseId}"]`
        ).value = ratingValue;

        // Update star colors
        stars.forEach((s) =>
          s.classList.toggle(
            "text-yellow-500",
            s.getAttribute("data-value") <= ratingValue
          )
        );
      });
    });
  });

  // Attach event listeners for lesson completion
  document.querySelectorAll(".lesson-complete-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const lessonId = this.getAttribute("data-lesson-id");
      const userId = auth.currentUser.uid;
      await markLessonComplete(userId, lessonId);
      this.classList.add("bg-green-500", "text-white");
      this.textContent = "✔ Completed";
    });
  });
}

// Toggle lessons visibility
document.querySelectorAll(".toggle-lessons").forEach((button) => {
  button.addEventListener("click", function () {
    const sectionIndex = this.getAttribute("data-section-index");
    const container = document.getElementById(
      `lessons-container-${sectionIndex}`
    );

    if (container) {
      container.classList.toggle("hidden");
      this.textContent = container.classList.contains("hidden")
        ? "Show Lessons"
        : "Hide Lessons";
    }
  });
});


function getVideoEmbedCode(url) {
  if (!url) return '<p class="italic text-gray-500">No video available</p>';

  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const dailymotionRegex = /dailymotion\.com\/video\/([\w]+)/;
  const googleDriveRegex = /drive\.google\.com\/file\/d\/(.*?)\/view/;
  const mp4Regex = /\.(mp4|webm|ogg)$/i;

  if (youtubeRegex.test(url)) {
    const videoId = url.match(youtubeRegex)[1];
    return `<iframe class="w-full h-64 rounded-lg" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  } else if (vimeoRegex.test(url)) {
    const videoId = url.match(vimeoRegex)[1];
    return `<iframe class="w-full h-64 rounded-lg" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  } else if (dailymotionRegex.test(url)) {
    const videoId = url.match(dailymotionRegex)[1];
    return `<iframe class="w-full h-64 rounded-lg" src="https://www.dailymotion.com/embed/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  } else if (googleDriveRegex.test(url)) {
    const fileId = url.match(googleDriveRegex)[1];
    return `<iframe class="w-full h-64 rounded-lg" src="https://drive.google.com/file/d/${fileId}/preview" frameborder="0" allowfullscreen></iframe>`;

  } else if (mp4Regex.test(url)) {
    return `<video class="w-full h-64 rounded-lg" controls><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;

  } else {
    return `<p class="italic text-gray-500">Unsupported video format</p>`;
  }
}





// Main function to load user purchased courses
async function loadPurchasedCourses(userId) {
  const courses = await fetchPurchasedCourses(userId);

  requestAnimationFrame(() => {
    renderCourses(courses);
  });
}

// Initialize the page

// Fetch and load courses for the authenticated user
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadPurchasedCourses(user.uid);
  } else {
    const courseContainer = document.getElementById("course-container");
    courseContainer.innerHTML =
      '<p class="text-center text-gray-500">Please log in to view your courses.</p>';
  }
});

// Show Lessons
