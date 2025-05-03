/** @format */

// Import Firebase modules
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
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtaftgrL4p4wqNC2w211mUi8amkjw2kzM",
  authDomain: "profstudymate-6d0fc.firebaseapp.com",
  projectId: "profstudymate",
  storageBucket: "profstudymate.appspot.com",
  messagingSenderId: "141453158869",
  appId: "1:141453158869:web:d4ded426a90e9937e2f55c",
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Course Types and Interfaces
class Course {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.image_url;
    this.expireDate = data.expire_date;
    this.averageRating = data.averageRating;
    this.author = {
      name: data.author?.name || "Unknown Author",
      imageUrl: data.author?.image_url || "https://via.placeholder.com/32",
      id: data.author?.id,
    };
    this.students = data.students || 0;
    this.language = data.language;
    this.sections = [];
    this.progress = { total: 0, completed: 0, percentage: 0 };
  }
}

// Course Service
class CourseService {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Set();
  }

  subscribe(callback) {
    this.subscriptions.add(callback);
    return () => this.subscriptions.delete(callback);
  }

  notify(courses) {
    this.subscriptions.forEach((callback) => callback(courses));
  }

  async fetchCourse(courseId, expireDate) {
    // Check cache first
    if (this.cache.has(courseId)) {
      const cached = this.cache.get(courseId);
      if (Date.now() - cached.timestamp < 300000) {
        // 5 minutes cache
        return { ...cached.data, expire_date: expireDate };
      }
    }

    const courseDoc = await getDoc(doc(db, "courses", courseId));
    if (!courseDoc.exists()) return null;

    const courseData = new Course({
      id: courseDoc.id,
      ...courseDoc.data(),
      expire_date: expireDate,
    });

    // Cache the result
    this.cache.set(courseId, {
      data: courseData,
      timestamp: Date.now(),
    });

    return courseData;
  }

  async fetchSections(courseId, completedLessons) {
    const sectionsRef = collection(db, "courses", courseId, "sections");
    const sectionsSnap = await getDocs(query(sectionsRef, orderBy("order")));

    return Promise.all(
      sectionsSnap.docs.map(async (sectionDoc) => {
        const section = {
          id: sectionDoc.id,
          courseId,
          ...sectionDoc.data(),
          lessons: [],
        };

        const lessonsRef = collection(
          db,
          "courses",
          courseId,
          "sections",
          section.id,
          "lessons"
        );
        const lessonsSnap = await getDocs(query(lessonsRef, orderBy("order")));

        section.lessons = lessonsSnap.docs.map((lessonDoc) => ({
          id: lessonDoc.id,
          ...lessonDoc.data(),
          completed: completedLessons.has(lessonDoc.id),
        }));

        return section;
      })
    );
  }

  async getCompletedLessons(userId) {
    const completedRef = collection(db, "users", userId, "completedLessons");
    const completedSnap = await getDocs(completedRef);
    return new Set(completedSnap.docs.map((doc) => doc.id));
  }

  calculateProgress(sections) {
    let total = 0;
    let completed = 0;

    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        total++;
        if (lesson.completed) completed++;
      });
    });

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  async initialize(userId) {
    if (!userId) return;

    const userCoursesRef = collection(db, "users", userId, "Courses");

    // Setup real-time listener
    onSnapshot(userCoursesRef, async (snapshot) => {
      try {
        const completedLessons = await this.getCompletedLessons(userId);
        const courses = await this.processCourses(
          snapshot.docs,
          completedLessons
        );
        this.notify(courses);
      } catch (error) {
        console.error("Error processing courses:", error);
        this.notify([]);
      }
    });
  }

  async processCourses(courseDocs, completedLessons) {
    const coursePromises = courseDocs.map(async (doc) => {
      const courseId = doc.data().course_id;
      const expireDate = doc.data().expire_date;

      const course = await this.fetchCourse(courseId, expireDate);
      if (!course) return null;

      const sections = await this.fetchSections(courseId, completedLessons);
      course.sections = sections;
      course.progress = this.calculateProgress(sections);

      return course;
    });

    return (await Promise.all(coursePromises)).filter(Boolean);
  }

  async markLessonComplete(userId, lessonId) {
    try {
      await setDoc(doc(db, "users", userId, "completedLessons", lessonId), {
        completed: true,
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      return false;
    }
  }
}

// UI Components
class CourseCard {
  static render(course) {
    const isExpired = new Date(course.expireDate) < new Date();
    const hasLessons = course.sections.some(
      (section) => section.lessons.length > 0
    );

    return `
            <div class="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                <div class="relative aspect-video overflow-hidden">
                    <img src="${course.imageUrl}" alt="${course.name}" 
                         class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    ${
                      course.progress.percentage > 0
                        ? `
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                 style="width: ${course.progress.percentage}%"></div>
                        </div>
                    `
                        : ""
                    }
                </div>

                <div class="p-6 space-y-4">
                    <div class="flex justify-between items-start gap-4">
                        <h3 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            ${course.name}
                        </h3>
                        <span class="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full whitespace-nowrap">
                            ${course.language || "Not specified"}
                        </span>
                    </div>

                    <div class="space-y-3 text-sm">
                        <div class="flex items-center gap-2 text-gray-400">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M12 4.318l-1.318 2.844-2.844 1.318 2.844 1.318L12 12.682l1.318-2.844 2.844-1.318-2.844-1.318L12 4.318z"/>
                            </svg>
                            <span>${course.students} enrolled</span>
                        </div>

                        <div class="flex items-center gap-2 text-gray-400">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span>Expires: ${this.formatDate(
                              course.expireDate
                            )}</span>
                        </div>

                        ${
                          course.progress.percentage > 0
                            ? `
                            <div class="flex items-center gap-2 text-gray-400">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>${course.progress.percentage}% Complete</span>
                            </div>
                        `
                            : ""
                        }
                    </div>

                    <div class="pt-4 border-t border-gray-800">
                        ${this.renderActionButton(
                          course,
                          hasLessons,
                          isExpired
                        )}
                    </div>
                </div>
            </div>
        `;
  }

  static renderActionButton(course, hasLessons, isExpired) {
    const currentDate = new Date();
    const expirationDate =
      course.expireDate instanceof Timestamp
        ? course.expireDate.toDate()
        : new Date(course.expireDate);

    // Check if course is expired
    if (expirationDate < currentDate) {
      return `
        <button onclick="window.location.href='courses.html?courseid=${encodeURIComponent(
          course.id
        )}'" 
                class="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg 
                       hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Renew Course
        </button>`;
    }

    return hasLessons
      ? `<button   onclick="window.showCourseContent(this.getAttribute('data-course'))"
  data-course='${btoa(unescape(encodeURIComponent(JSON.stringify(course))))}'
                        class="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg 
                               hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Continue Learning
                </button>`
      : `<button disabled 
                        class="w-full px-4 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed 
                               flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    No Lessons Available
                </button>`;
  }

  static formatDate(timestamp) {
    if (!timestamp) return "N/A";
    const date =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

class CourseContentModal {
  static render(course) {
    return `
            <div class="space-y-8">
                <div class="flex items-center gap-6">
                    <div class="relative w-24 h-24 rounded-xl overflow-hidden">
                        <img src="${course.imageUrl}" alt="${course.name}" 
                             class="w-full h-full object-cover" />
                        ${
                          course.progress.percentage > 0
                            ? `
                            <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div class="relative w-16 h-16">
                                    <svg class="w-full h-full" viewBox="0 0 36 36">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="#4F46E5" stroke-width="3" stroke-dasharray="${course.progress.percentage}, 100"/>
                                        <text x="18" y="20.35" class="progress-text" text-anchor="middle" fill="#4F46E5" font-size="8">
                                            ${course.progress.percentage}%
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-white">${
                          course.name
                        }</h2>
                        <p class="text-gray-400 mt-1">by ${
                          course.author.name
                        }</p>
                    </div>
                </div>

                ${course.sections
                  .map(
                    (section) => `
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                            <span class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                ${section.order || "•"}
                            </span>
                            ${section.name}
                        </h3>
                        <div class="space-y-2">
                            ${section.lessons
                              .map(
                                (lesson, index) => `
                                <div class="group flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                                    <div class="flex items-center gap-4">
                                        <div class="relative w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                                            ${
                                              lesson.completed
                                                ? `<svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                                   </svg>`
                                                : `<span class="text-gray-400">${
                                                    index + 1
                                                  }</span>`
                                            }
                                        </div>
                                        <div>
                                            <h4 class="text-white font-medium group-hover:text-indigo-400 transition-colors">
                                                ${
                                                  lesson.title ||
                                                  `Lesson ${index + 1}`
                                                }
                                            </h4>
                                            ${
                                              lesson.duration
                                                ? `
                                                <p class="text-sm text-gray-500">${lesson.duration}</p>
                                            `
                                                : ""
                                            }
                                        </div>
                                    </div>
                                    <button onclick="window.startLesson('${
                                      section.courseId
                                    }', '${section.id}', '${lesson.id}')"
                                            class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                                                   transition-colors flex items-center gap-2">
                                        ${lesson.completed ? "Review" : "Start"}
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                        </svg>
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
        `;
  }
}

// Initialize Course Service and UI
const courseService = new CourseService();

// Global UI handlers
window.showCourseContent = (encodedData) => {
  try {
    const jsonStr = decodeURIComponent(escape(atob(encodedData)));
    const course = JSON.parse(jsonStr);

    const modal = document.getElementById("modal-container");
    const content = document.getElementById("modal-content");

    modal.classList.remove("hidden");
    content.innerHTML = CourseContentModal.render(course);
  } catch (error) {
    console.error("Error showing course content:", error);
    Toastify({
      text: "Failed to load course content",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #ef4444, #dc2626)" },
    }).showToast();
  }
};



window.startLesson = (courseId, sectionId, lessonId) => {
  window.location.href = `lesson.html?course=${courseId}&section=${sectionId}&lesson=${lessonId}`;
};

// Setup auth listener
onAuthStateChanged(auth, (user) => {
  const container = document.getElementById("course-container");
  const loadingScreen = document.getElementById("loadingScreen");

  if (!user) {
    loadingScreen.classList.add("hidden");
    container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center min-h-[60vh]">
                <div class="text-center space-y-4">
                    <svg class="w-20 h-20 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-400">Please Log In</h2>
                    <p class="text-gray-500 max-w-md">Sign in to access your courses and continue your learning journey</p>
                    <button onclick="window.location.href='account.html'" 
                            class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Sign In
                    </button>
                </div>
            </div>
        `;
    return;
  }

  courseService.subscribe((courses) => {
    loadingScreen.classList.add("hidden");

    if (courses.length === 0) {
      container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center min-h-[60vh]">
                    <div class="text-center space-y-4">
                        <div class="relative">
                            <svg class="w-24 h-24 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-400">No Courses Yet</h2>
                        <p class="text-gray-500 max-w-md">Start your learning journey by exploring our course catalog</p>
                        <button onclick="window.location.href='courses.html'" 
                                class="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg 
                                       hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                            Browse Courses
                        </button>
                    </div>
                </div>
            `;
      return;
    }

    container.innerHTML = courses
      .map((course) => CourseCard.render(course))
      .join("");
  });

  courseService.initialize(user.uid);
});
