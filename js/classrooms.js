// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
let app, db, auth, storage;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Category definitions
const CATEGORIES = {
  'CITG Program': {
    name: 'CITG Program',
    fullName: 'Chartered Institute of Taxation Ghana',
    icon: 'fas fa-calculator',
    color: 'from-blue-500 to-blue-600'
  },
  'ICAGH Program': {
    name: 'ICAGH Program',
    fullName: 'Institute of Chartered Accountants Ghana',
    icon: 'fas fa-chart-line',
    color: 'from-green-500 to-green-600'
  },
  'Digital Marketing': {
    name: 'Digital Marketing',
    fullName: 'Grow your business (Digital marketing) - Master digital marketing strategies to grow your business',
    icon: 'fas fa-bullhorn',
    color: 'from-purple-500 to-purple-600'
  },
  'ADIT Program': {
    name: 'ADIT Program',
    fullName: 'Advanced Diploma in International Taxation program',
    icon: 'fas fa-globe',
    color: 'from-red-500 to-red-600'
  },
  'PMP Professional': {
    name: 'PMP Professional',
    fullName: 'Project Management Professional certification training',
    icon: 'fas fa-tasks',
    color: 'from-yellow-500 to-yellow-600'
  },
  'Alumni Training': {
    name: 'Alumni Training',
    fullName: 'ALUMNI TRAINING PROGRAMS - Exclusive training for our alumni members',
    icon: 'fas fa-graduation-cap',
    color: 'from-indigo-500 to-indigo-600'
  }
};

// Global variables
let currentUser = null;
let classrooms = [];
let filteredClassrooms = [];
let subjects = new Set();
let categories = new Set();
let selectedCategory = '';
let isAdmin = false;

// DOM elements
const elements = {
  userInfo: document.getElementById('user-info'),
  signOutBtn: document.getElementById('signOut'),
  adminControls: document.getElementById('admin-controls'),
  createForm: document.getElementById('create-classroom-form'),
  modalCreateForm: document.getElementById('modal-create-form'),
  createModal: document.getElementById('create-modal'),
  closeModal: document.getElementById('close-modal'),
  cancelCreate: document.getElementById('cancel-create'),
  searchInput: document.getElementById('search-classrooms'),
  filterSubject: document.getElementById('filter-subject'),
  filterCategory: document.getElementById('filter-category'),
  categoryFilters: document.getElementById('category-filters'),
  refreshBtn: document.getElementById('refresh-btn'),
  loadingState: document.getElementById('loading-state'),
  classroomsGrid: document.getElementById('classrooms-grid'),
  emptyState: document.getElementById('empty-state'),
  clearFilters: document.getElementById('clear-filters'),
  deleteClassroomModal: document.getElementById('delete-classroom-modal'),
  confirmDeleteClassroom: document.getElementById('confirm-delete-classroom'),
  cancelDeleteClassroom: document.getElementById('cancel-delete-classroom'),
  deleteClassroomName: document.getElementById('delete-classroom-name'),
  deleteClassroomSubject: document.getElementById('delete-classroom-subject')
};

// Check if all required elements exist
function validateElements() {
  const requiredElements = [
    'user-info', 'signOut', 'admin-controls', 'create-classroom-form',
    'modal-create-form', 'create-modal', 'close-modal', 'cancel-create',
    'search-classrooms', 'filter-subject', 'filter-category', 'category-filters', 'refresh-btn', 'loading-state',
    'classrooms-grid', 'empty-state', 'clear-filters', 'delete-classroom-modal', 'confirm-delete-classroom', 'cancel-delete-classroom'
  ];
  
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  if (missingElements.length > 0) {
    console.error('Missing DOM elements:', missingElements);
    return false;
  }
  return true;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, validating elements...');
  if (!validateElements()) {
    console.error('Some required elements are missing. Check the HTML structure.');
    return;
  }
  
  // Check if Firebase is initialized
  if (!auth) {
    console.error('Firebase not initialized properly');
    return;
  }
  
  console.log('All elements found, initializing...');
  initializeAuth();
  setupEventListeners();
});

// Authentication setup
function initializeAuth() {
  console.log('Initializing authentication...');
  // Show loading state while checking auth
  showLoading(true);
  
  // Check if user is already authenticated
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log('User already authenticated:', currentUser.email);
    handleAuthenticatedUser(currentUser);
    return;
  }
  
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    if (user) {
      console.log('User authenticated:', user.email);
      handleAuthenticatedUser(user);
    } else {
      console.log('No user authenticated, showing login prompt...');
      showLoginPrompt();
    }
  });
}

// Handle authenticated user
function handleAuthenticatedUser(user) {
  currentUser = user;
  displayUserInfo(user);
  checkUserRole(user.uid);
  // Load classrooms after authentication is confirmed
  loadClassrooms();
}

// Show login prompt for unauthenticated users
function showLoginPrompt() {
  showLoading(false);
  
  // Hide the main content
  const mainContent = document.querySelector('.max-w-7xl');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-lock text-6xl text-gray-500 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">Authentication Required</h3>
        <p class="text-gray-400 mb-6">Please sign in to access the classrooms.</p>
        <a href="account.html" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <i class="fas fa-sign-in-alt mr-2"></i>Sign In
        </a>
      </div>
    `;
  }
  
  // Hide the sign out button
  if (elements.signOutBtn) {
    elements.signOutBtn.style.display = 'none';
  }
}

// Display user information
function displayUserInfo(user) {
  const email = user.email;
  const displayName = email.split('@')[0];
  if (elements.userInfo) {
    elements.userInfo.textContent = `Welcome, ${displayName}`;
  }
}

// Check user role for admin privileges
async function checkUserRole(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      isAdmin = userData.role && (userData.role.includes('admin') || userData.role.includes('author'));
      if (isAdmin) {
        if (elements.adminControls) {
          elements.adminControls.classList.remove('hidden');
        }
      }
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Sign out
  if (elements.signOutBtn) {
    elements.signOutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = 'index.html';
      }).catch((error) => {
        showToast('Error signing out', 'error');
      });
    });
  }

  // Create classroom form
  if (elements.createForm) {
    elements.createForm.addEventListener('submit', handleCreateClassroom);
  }
  if (elements.modalCreateForm) {
    elements.modalCreateForm.addEventListener('submit', handleCreateClassroom);
  }

  // Modal controls
  if (elements.closeModal) {
    elements.closeModal.addEventListener('click', closeCreateModal);
  }
  if (elements.cancelCreate) {
    elements.cancelCreate.addEventListener('click', closeCreateModal);
  }
  
  // Delete classroom modal controls
  if (elements.confirmDeleteClassroom) {
    elements.confirmDeleteClassroom.addEventListener('click', () => {
      const classroomId = elements.confirmDeleteClassroom.dataset.classroomId;
      if (classroomId) {
        deleteClassroom(classroomId);
      }
    });
  }
  if (elements.cancelDeleteClassroom) {
    elements.cancelDeleteClassroom.addEventListener('click', closeDeleteClassroomModal);
  }

  // Search and filter
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', filterClassrooms);
  }
  if (elements.filterSubject) {
    elements.filterSubject.addEventListener('change', filterClassrooms);
  }
  if (elements.filterCategory) {
    elements.filterCategory.addEventListener('change', filterClassrooms);
  }
  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener('click', async () => {
      await loadClassrooms();
    });
  }
  if (elements.clearFilters) {
    elements.clearFilters.addEventListener('click', clearFilters);
  }
}

// Load classrooms from Firebase
async function loadClassrooms() {
  try {
    showLoading(true);
    
    const classroomsRef = collection(db, 'classrooms');
    const q = query(classroomsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    classrooms = [];
    subjects.clear();
    let totalMembers = 0;
    
    querySnapshot.forEach((doc) => {
      const classroom = {
        id: doc.id,
        ...doc.data()
      };
      classrooms.push(classroom);
      if (classroom.subject) {
        subjects.add(classroom.subject);
      }
      if (classroom.category) {
        categories.add(classroom.category);
      }
      totalMembers += classroom.memberCount || 0;
    });
    
    // Update stats
    await updateStats(classrooms.length, totalMembers);
    
    // Update filter options
    updateSubjectFilter();
    updateCategoryFilter();
    setupCategoryFilters();
    
    // Apply current filters
    filterClassrooms();
    
  } catch (error) {
    console.error('Error loading classrooms:', error);
    showToast('Error loading classrooms', 'error');
  } finally {
    showLoading(false);
  }
}

// Count today's messages across all classrooms
async function countTodayMessages() {
  try {
    let totalMessages = 0;
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For each classroom, count messages from today
    for (const classroom of classrooms) {
      try {
        const messagesRef = collection(db, 'classrooms', classroom.id, 'messages');
        const messagesQuery = query(
          messagesRef,
          where('timestamp', '>=', today),
          orderBy('timestamp', 'desc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        totalMessages += messagesSnapshot.size;
      } catch (error) {
        console.warn(`Error counting messages for classroom ${classroom.id}:`, error);
        // Continue with other classrooms even if one fails
      }
    }
    
    return totalMessages;
  } catch (error) {
    console.error('Error counting today\'s messages:', error);
    return 0;
  }
}

// Update statistics
async function updateStats(classroomCount, totalMembers) {
  const totalClassroomsEl = document.getElementById('total-classrooms');
  const totalStudentsEl = document.getElementById('total-students');
  const totalMessagesEl = document.getElementById('total-messages');
  
  if (totalClassroomsEl) {
    totalClassroomsEl.textContent = classroomCount;
  }
  if (totalStudentsEl) {
    totalStudentsEl.textContent = totalMembers;
  }
  if (totalMessagesEl) {
    // Show loading state while counting messages
    totalMessagesEl.textContent = '...';
    totalMessagesEl.classList.add('stats-loading');
    
    try {
      const todayMessages = await countTodayMessages();
      totalMessagesEl.textContent = todayMessages;
    } catch (error) {
      console.error('Error updating message count:', error);
      totalMessagesEl.textContent = '0';
    } finally {
      totalMessagesEl.classList.remove('stats-loading');
    }
  }
}

// Refresh message count only
async function refreshMessageCount() {
  const totalMessagesEl = document.getElementById('total-messages');
  if (totalMessagesEl) {
    totalMessagesEl.textContent = '...';
    totalMessagesEl.classList.add('stats-loading');
    try {
      const todayMessages = await countTodayMessages();
      totalMessagesEl.textContent = todayMessages;
    } catch (error) {
      console.error('Error refreshing message count:', error);
      totalMessagesEl.textContent = '0';
    } finally {
      totalMessagesEl.classList.remove('stats-loading');
    }
  }
}

// Update subject filter dropdown
function updateSubjectFilter() {
  const filterSelect = elements.filterSubject;
  const currentValue = filterSelect.value;
  
  // Clear existing options except "All Subjects"
  filterSelect.innerHTML = '<option value="">All Subjects</option>';
  
  // Add subject options
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    filterSelect.appendChild(option);
  });
  
  // Restore previous selection if it still exists
  if (currentValue && subjects.has(currentValue)) {
    filterSelect.value = currentValue;
  }
}

// Update category filter dropdown
function updateCategoryFilter() {
  const filterSelect = elements.filterCategory;
  const currentValue = filterSelect.value;
  
  // Clear existing options except "All Categories"
  filterSelect.innerHTML = '<option value="">All Categories</option>';
  
  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
  
  // Restore previous selection if it still exists
  if (currentValue && categories.has(currentValue)) {
    filterSelect.value = currentValue;
  }
}

// Setup category filter buttons
function setupCategoryFilters() {
  const container = elements.categoryFilters;
  if (!container) return;
  
  container.innerHTML = '';
  
  // Add "All Categories" button
  const allButton = document.createElement('button');
  allButton.className = `category-btn px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === '' ? 'active' : ''}`;
  allButton.innerHTML = `
    <i class="fas fa-th-large category-icon mr-2"></i>
    All Categories
  `;
  allButton.addEventListener('click', () => {
    selectedCategory = '';
    updateCategoryButtons();
    filterClassrooms();
  });
  container.appendChild(allButton);
  
  // Add category buttons
  Object.entries(CATEGORIES).forEach(([key, category]) => {
    const button = document.createElement('button');
    button.className = `category-btn px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === key ? 'active' : ''}`;
    button.innerHTML = `
      <i class="${category.icon} category-icon mr-2"></i>
      ${category.name}
    `;
    button.addEventListener('click', () => {
      selectedCategory = selectedCategory === key ? '' : key;
      updateCategoryButtons();
      filterClassrooms();
    });
    container.appendChild(button);
  });
}

// Update category button states
function updateCategoryButtons() {
  const buttons = elements.categoryFilters.querySelectorAll('.category-btn');
  buttons.forEach((button, index) => {
    if (index === 0) {
      // "All Categories" button
      button.classList.toggle('active', selectedCategory === '');
    } else {
      // Category buttons
      const categoryKey = Object.keys(CATEGORIES)[index - 1];
      button.classList.toggle('active', selectedCategory === categoryKey);
    }
  });
}

// Filter classrooms based on search, subject, and category
function filterClassrooms() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const selectedSubject = elements.filterSubject.value;
  const selectedCategory = elements.filterCategory.value;
  
  filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = !searchTerm || 
      classroom.name.toLowerCase().includes(searchTerm) ||
      classroom.subject.toLowerCase().includes(searchTerm) ||
      classroom.description.toLowerCase().includes(searchTerm) ||
      (classroom.category && classroom.category.toLowerCase().includes(searchTerm));
    
    const matchesSubject = !selectedSubject || classroom.subject === selectedSubject;
    const matchesCategory = !selectedCategory || classroom.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesCategory;
  });
  
  displayClassrooms();
}

// Display filtered classrooms
function displayClassrooms() {
  const grid = elements.classroomsGrid;
  grid.innerHTML = '';
  
  if (filteredClassrooms.length === 0) {
    elements.emptyState.classList.remove('hidden');
    elements.classroomsGrid.classList.add('hidden');
    return;
  }
  
  elements.emptyState.classList.add('hidden');
  elements.classroomsGrid.classList.remove('hidden');
  
  filteredClassrooms.forEach(classroom => {
    const card = createClassroomCard(classroom);
    grid.appendChild(card);
  });
}

// Create classroom card element
function createClassroomCard(classroom) {
  const createdAt = classroom.createdAt ? new Date(classroom.createdAt.toDate()).toLocaleDateString() : 'Unknown';
  const memberCount = classroom.memberCount || 0;
  const isNew = classroom.createdAt && (new Date() - classroom.createdAt.toDate()) < (24 * 60 * 60 * 1000); // Less than 24 hours
  
  // Check if user can delete this classroom
  const canDelete = isAdmin || (currentUser && classroom.createdByUid === currentUser.uid);
  
  // Check if user has already joined this classroom
  const hasJoined = currentUser && classroom.members && classroom.members.includes(currentUser.uid);
  
  const card = document.createElement('div');
  card.className = `classroom-card rounded-xl p-6 fade-in relative group ${hasJoined ? 'joined-classroom' : ''}`;
  
  // Profile image HTML
  const profileImageHtml = classroom.profileImageUrl ? 
    `<img src="${classroom.profileImageUrl}" alt="${classroom.name}" class="w-16 h-16 rounded-lg object-cover border-2 border-blue-400/30 shadow-lg classroom-profile-image">` :
    `<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg classroom-profile-image">
      <i class="fas fa-chalkboard-teacher text-white text-2xl"></i>
    </div>`;
  
  card.innerHTML = `
    ${canDelete ? `
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button class="delete-classroom-btn p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200" 
                data-classroom-id="${classroom.id}" title="Delete classroom">
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    ` : ''}
    <div class="flex items-start gap-4 mb-4 cursor-pointer">
      <div class="flex-shrink-0">
        ${profileImageHtml}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-xl font-semibold truncate">${classroom.name}</h3>
          ${isNew ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full animate-pulse flex-shrink-0">NEW</span>' : ''}
          ${hasJoined ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full flex-shrink-0 member-badge"><i class="fas fa-user-check mr-1"></i>Member</span>' : ''}
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
            <i class="fas fa-book mr-1"></i>${classroom.subject}
          </span>
          ${classroom.category ? `
            <span class="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full font-medium">
              <i class="fas fa-tag mr-1"></i>${classroom.category}
            </span>
          ` : ''}
        </div>
        <div class="flex items-center justify-between text-sm text-gray-400">
          <div class="flex items-center">
            <i class="fas fa-users mr-1 text-blue-400"></i>
            <span class="font-medium">${memberCount} members</span>
          </div>
          <div class="text-xs">
            <i class="fas fa-calendar mr-1"></i>${createdAt}
          </div>
        </div>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-2 cursor-pointer">${classroom.description}</p>
          <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-400">
          <div class="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center mr-2">
            <i class="fas fa-user-tie text-blue-400 text-xs"></i>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">${classroom.createdBy ? classroom.createdBy.split('@')[0] : 'Unknown'}</span>
            <span class="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs rounded-full font-medium border border-amber-500/30 flex items-center gap-1">
              <i class="fas fa-crown text-xs"></i>
              Professor
            </span>
          </div>
        </div>
        <button class="join-classroom-btn px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 ${hasJoined ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}">
          <i class="fas ${hasJoined ? 'fa-comments' : 'fa-sign-in-alt'} mr-2"></i>${hasJoined ? 'Enter Chat' : 'Join'}
        </button>
      </div>
  `;
  
  // Add click events
  const joinBtn = card.querySelector('.join-classroom-btn');
  const deleteBtn = card.querySelector('.delete-classroom-btn');
  
  // Join/Enter classroom event
  joinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (hasJoined) {
      // User has already joined, just enter the classroom
      joinClassroom(classroom.id);
    } else {
      // User hasn't joined yet, join first then enter
      joinClassroom(classroom.id);
    }
  });
  
  // Delete classroom event
  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showDeleteClassroomModal(classroom);
    });
  }
  
  // Card click event for joining
  const cardContent = card.querySelector('.flex.items-start.gap-4');
  const description = card.querySelector('p');
  
  [cardContent, description].forEach(element => {
    if (element) {
      element.addEventListener('click', () => {
        joinClassroom(classroom.id);
      });
    }
  });
  
  return card;
}

// Handle classroom creation
async function handleCreateClassroom(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('[id*="classroom-name"]').value.trim();
  const subject = form.querySelector('[id*="classroom-subject"]').value.trim();
  const category = form.querySelector('[id*="classroom-category"]').value.trim();
  const description = form.querySelector('[id*="classroom-description"]').value.trim();
  const imageFile = form.querySelector('[id*="classroom-image"]').files[0];
  
  if (!name || !subject || !category || !description) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  try {
    let profileImageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      showToast('Uploading image...', 'info');
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `classroom-${timestamp}-${imageFile.name}`;
      const storageRef = ref(storage, `classroom-images/${fileName}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, imageFile);
      profileImageUrl = await getDownloadURL(snapshot.ref);
      
      showToast('Image uploaded successfully!', 'success');
    }
    
    const classroomData = {
      name,
      subject,
      category,
      description,
      profileImageUrl,
      createdBy: currentUser.email,
      createdByUid: currentUser.uid,
      createdAt: new Date(),
      memberCount: 1,
      members: [currentUser.uid]
    };
    
    await addDoc(collection(db, 'classrooms'), classroomData);
    
    showToast('Classroom created successfully!', 'success');
    
    // Reset form and image preview
    form.reset();
    const imagePreview = form.querySelector('[id*="image-preview"]');
    if (imagePreview) {
      imagePreview.classList.add('hidden');
    }
    closeCreateModal();
    
    // Reload classrooms
    await loadClassrooms();
    
  } catch (error) {
    console.error('Error creating classroom:', error);
    showToast('Error creating classroom', 'error');
  }
}

// Join classroom
function joinClassroom(classroomId) {
  // Store classroom ID in localStorage for the chat page
  localStorage.setItem('currentClassroomId', classroomId);
  window.location.href = `chatroom.html?id=${classroomId}`;
}

// Show delete classroom modal
function showDeleteClassroomModal(classroom) {
  elements.deleteClassroomName.textContent = classroom.name;
  elements.deleteClassroomSubject.textContent = `${classroom.subject}${classroom.category ? ` • ${classroom.category}` : ''}`;
  
  elements.deleteClassroomModal.classList.remove('hidden');
  elements.deleteClassroomModal.classList.add('flex');
  
  // Store classroom data for deletion
  elements.confirmDeleteClassroom.dataset.classroomId = classroom.id;
}

// Close delete classroom modal
function closeDeleteClassroomModal() {
  elements.deleteClassroomModal.classList.add('hidden');
  elements.deleteClassroomModal.classList.remove('flex');
  delete elements.confirmDeleteClassroom.dataset.classroomId;
}

// Delete classroom
async function deleteClassroom(classroomId) {
  try {
    showToast('Deleting classroom...', 'info');
    
    // Delete the classroom document
    await deleteDoc(doc(db, 'classrooms', classroomId));
    
    showToast('Classroom deleted successfully!', 'success');
    closeDeleteClassroomModal();
    
    // Reload classrooms to update the list
    await loadClassrooms();
    
  } catch (error) {
    console.error('Error deleting classroom:', error);
    showToast('Error deleting classroom', 'error');
  }
}

// Close create modal
function closeCreateModal() {
  elements.createModal.classList.add('hidden');
  elements.createModal.classList.remove('flex');
}

// Clear filters
function clearFilters() {
  elements.searchInput.value = '';
  elements.filterSubject.value = '';
  elements.filterCategory.value = '';
  selectedCategory = '';
  updateCategoryButtons();
  filterClassrooms();
}

// Show/hide loading state
function showLoading(show) {
  if (show) {
    elements.loadingState.classList.remove('hidden');
    elements.classroomsGrid.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
  } else {
    elements.loadingState.classList.add('hidden');
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const backgroundColor = type === 'success' ? '#10b981' : 
                         type === 'error' ? '#ef4444' : '#3b82f6';
  
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor,
    stopOnFocus: true,
  }).showToast();
} 