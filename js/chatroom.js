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
  updateDoc,
  serverTimestamp,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  off,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtaftgrL4p4wqNC2w211mUi8amkjw2kzM",
  authDomain: "profstudymate-6d0fc.firebaseapp.com",
  projectId: "profstudymate",
  storageBucket: "profstudymate.appspot.com",
  messagingSenderId: "141453158869",
  appId: "1:141453158869:web:d4ded426a90e9937e2f55c",
  databaseURL: "https://profstudymate-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// Global variables
let currentUser = null;
let currentClassroom = null;
let classroomId = null;
let isAdmin = false;
let isProfessor = false;
let messages = [];
let typingUsers = new Set();
let onlineUsers = new Map();
let allMembers = new Map(); // Store all classroom members
let messageListener = null;
let typingListener = null;
let presenceListener = null;
let privateMessageListener = null; // Add missing private message listener
let lastMessageDate = null;
let bannedUsers = new Set();
let privateMessageCounts = new Map(); // Track unread private messages per user
let lastPrivateMessageCheck = null;
let currentChatMode = 'public';
let privateChatWith = null;
let profileImageCache = new Map(); // Cache for profile images

// DOM elements
const elements = {
  classroomName: document.getElementById('classroom-name'),
  classroomSubject: document.getElementById('classroom-subject'),
  classroomDescription: document.getElementById('classroom-description'),
  classroomCreator: document.getElementById('classroom-creator'),
  memberCount: document.getElementById('member-count'),
  onlineCountNumber: document.getElementById('online-count-number'),
  membersList: document.getElementById('members-list'),
  refreshStatus: document.getElementById('refresh-status'),
  messagesContainer: document.getElementById('messages-container'),
  typingIndicator: document.getElementById('typing-indicator'),
  messageForm: document.getElementById('message-form'),
  messageInput: document.getElementById('message-input'),
  sendBtn: document.getElementById('send-btn'),
  emojiBtn: document.getElementById('emoji-btn'),
  emojiPicker: document.getElementById('emoji-picker'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  backBtn: document.getElementById('back-btn'),
  userInfo: document.getElementById('user-info'),
  deleteModal: document.getElementById('delete-modal'),
  confirmDelete: document.getElementById('confirm-delete'),
  cancelDelete: document.getElementById('cancel-delete'),
  banModal: document.getElementById('ban-modal'),
  confirmBan: document.getElementById('confirm-ban'),
  cancelBan: document.getElementById('cancel-ban'),
  banReason: document.getElementById('ban-reason'),
  banUserInfo: document.getElementById('ban-user-info'),
  privateChatModal: document.getElementById('private-chat-modal'),
  privateChatTitle: document.getElementById('private-chat-title'),
  privateChatSubtitle: document.getElementById('private-chat-subtitle'),
  privateMessagesContainer: document.getElementById('private-messages-container'),
  privateMessageForm: document.getElementById('private-message-form'),
  privateMessageInput: document.getElementById('private-message-input'),
  privateSendBtn: document.getElementById('private-send-btn'),
  closePrivateChat: document.getElementById('close-private-chat')
};

// Emoji list
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

// Initialize the chat room
document.addEventListener('DOMContentLoaded', () => {
  initializeChat();
});

// Initialize chat room
async function initializeChat() {
  // Get classroom ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  classroomId = urlParams.get('id') || localStorage.getItem('currentClassroomId');
  
  if (!classroomId) {
    showToast('No classroom ID provided', 'error');
    window.location.href = 'classrooms.html';
    return;
  }

  // Initialize authentication
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      displayUserInfo(user);
      await checkUserRole(user.uid);
      await loadClassroom();
      await loadBannedUsers();
      setupEventListeners();
      setupRealTimeListeners();
      setupPresence();
    } else {
      window.location.href = 'index.html';
    }
  });
}

// Display user information
function displayUserInfo(user) {
  const email = user.email;
  const displayName = email.split('@')[0];
  elements.userInfo.textContent = `Welcome, ${displayName}`;
}

// Check user role for admin privileges
async function checkUserRole(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      isAdmin = userData.role && (userData.role.includes('admin') || userData.role.includes('author'));
    }
    
    // Check if user is the professor of this classroom
    if (currentClassroom && currentClassroom.createdBy === currentUser.email) {
      isProfessor = true;
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

// Load classroom information
async function loadClassroom() {
  try {
    const classroomDoc = await getDoc(doc(db, 'classrooms', classroomId));
    if (!classroomDoc.exists()) {
      showToast('Classroom not found', 'error');
      window.location.href = 'classrooms.html';
      return;
    }

    currentClassroom = { id: classroomDoc.id, ...classroomDoc.data() };
    
    // Update UI
    elements.classroomName.textContent = currentClassroom.name;
    elements.classroomSubject.textContent = currentClassroom.subject;
    elements.classroomDescription.textContent = currentClassroom.description;
    // Set creator with indicator
    const creatorName = currentClassroom.createdBy || 'Unknown';
    elements.classroomCreator.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-medium">${creatorName.split('@')[0]}</span>
        <span class="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs rounded-full font-medium border border-amber-500/30 flex items-center gap-1">
          <i class="fas fa-crown text-xs"></i>
          Professor
        </span>
      </div>
    `;
    elements.memberCount.textContent = currentClassroom.memberCount || 0;

    // Update profile image
    updateClassroomProfileImage();

    // Add user to classroom members if not already a member
    if (!currentClassroom.members || !currentClassroom.members.includes(currentUser.uid)) {
      await addUserToClassroom();
    }

      // Load all classroom members
  await loadAllMembers();
  
  // Start checking for private messages
  await checkPrivateMessages();
  setInterval(checkPrivateMessages, 10000); // Check every 10 seconds

  } catch (error) {
    console.error('Error loading classroom:', error);
    showToast('Error loading classroom', 'error');
  }
}

// Update classroom profile image
function updateClassroomProfileImage() {
  const profileImageElement = document.getElementById('classroom-profile-image');
  if (!profileImageElement) return;

  if (currentClassroom.profileImageUrl) {
    profileImageElement.innerHTML = `<img src="${currentClassroom.profileImageUrl}" alt="${currentClassroom.name}" class="w-full h-full rounded-lg object-cover">`;
  } else {
    profileImageElement.innerHTML = `<i class="fas fa-chalkboard-teacher text-white text-xl"></i>`;
  }
}

// Add user to classroom members
async function addUserToClassroom() {
  try {
    const members = currentClassroom.members || [];
    if (!members.includes(currentUser.uid)) {
      members.push(currentUser.uid);
      await updateDoc(doc(db, 'classrooms', classroomId), {
        members: members,
        memberCount: members.length
      });
    }
  } catch (error) {
    console.error('Error adding user to classroom:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Message form submission
  elements.messageForm.addEventListener('submit', handleSendMessage);
  
  // Emoji picker
  elements.emojiBtn.addEventListener('click', toggleEmojiPicker);
  setupEmojiPicker();
  
  // Typing indicator
  let typingTimeout;
  elements.messageInput.addEventListener('input', () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set typing status
    setTypingStatus(true);
    
    // Clear typing status after 3 seconds of no input
    typingTimeout = setTimeout(() => {
      setTypingStatus(false);
    }, 3000);
  });
  
  // Auto-resize textarea
  elements.messageInput.addEventListener('input', autoResizeTextarea);
  
  // Sidebar toggle
  elements.sidebarToggle.addEventListener('click', toggleSidebar);
  
  // Mobile actions button
  const mobileActionsBtn = document.getElementById('mobile-actions-btn');
  if (mobileActionsBtn) {
    mobileActionsBtn.addEventListener('click', toggleSidebar);
  }
  
  // Back button
  elements.backBtn.addEventListener('click', () => {
    window.location.href = 'classrooms.html';
  });
  
  // Delete modal
  elements.confirmDelete.addEventListener('click', confirmDeleteMessage);
  elements.cancelDelete.addEventListener('click', closeDeleteModal);
  
  // Ban modal
  if (elements.confirmBan) {
    elements.confirmBan.addEventListener('click', confirmBanUser);
  }
  if (elements.cancelBan) {
    elements.cancelBan.addEventListener('click', closeBanModal);
  }
  
  // Private chat modal
  if (elements.privateMessageForm) {
    elements.privateMessageForm.addEventListener('submit', handlePrivateMessageSubmit);
  }
  if (elements.closePrivateChat) {
    elements.closePrivateChat.addEventListener('click', closePrivateChat);
  }
  if (elements.privateMessageInput) {
    elements.privateMessageInput.addEventListener('input', autoResizePrivateTextarea);
  }
  
  // Refresh status button
  if (elements.refreshStatus) {
    elements.refreshStatus.addEventListener('click', async () => {
      console.log('Manual refresh triggered');
      console.log('Current online users:', onlineUsers);
      console.log('Current user:', currentUser.uid);
      console.log('Current user role - isAdmin:', isAdmin, 'isProfessor:', isProfessor);
      
      // Force set current user as online
      const presenceRef = ref(rtdb, `classrooms/${classroomId}/presence/${currentUser.uid}`);
      const now = Date.now();
      set(presenceRef, {
        online: true,
        lastSeen: now,
        name: currentUser.email,
        joinedAt: now
      });
      
      await updateMembersList();
      showToast('Status refreshed', 'info');
    });
  }
  
  // Close emoji picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!elements.emojiBtn.contains(e.target) && !elements.emojiPicker.contains(e.target)) {
      elements.emojiPicker.classList.remove('show');
    }
  });
}

// Setup real-time listeners
function setupRealTimeListeners() {
  // Listen to messages
  const messagesRef = collection(db, 'classrooms', classroomId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
  
  messageListener = onSnapshot(messagesQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const message = { id: change.doc.id, ...change.doc.data() };
        addMessageToUI(message);
      }
    });
  });
  
  // Listen to typing indicators
  const typingRef = ref(rtdb, `classrooms/${classroomId}/typing`);
  typingListener = onValue(typingRef, (snapshot) => {
    const typingData = snapshot.val();
    if (typingData) {
      typingUsers.clear();
      Object.keys(typingData).forEach(userId => {
        if (userId !== currentUser.uid && typingData[userId]) {
          typingUsers.add(userId);
        }
      });
      updateTypingIndicator();
    } else {
      typingUsers.clear();
      updateTypingIndicator();
    }
  });
}

// Setup presence tracking
async function setupPresence() {
  const presenceRef = ref(rtdb, `classrooms/${classroomId}/presence/${currentUser.uid}`);
  
  // Set user as online
  const now = Date.now();
  set(presenceRef, {
    online: true,
    lastSeen: now,
    name: currentUser.email,
    joinedAt: now
  });
  
  console.log('Setting user as online:', currentUser.uid);
  
  // Listen to presence changes
  const presenceQuery = ref(rtdb, `classrooms/${classroomId}/presence`);
  presenceListener = onValue(presenceQuery, async (snapshot) => {
    const presenceData = snapshot.val();
    console.log('Presence data received:', presenceData);
    
    if (presenceData) {
      onlineUsers.clear();
      Object.keys(presenceData).forEach(userId => {
        const userData = presenceData[userId];
        console.log('User data:', userId, userData);
        if (userData && userData.online === true) {
          onlineUsers.set(userId, userData);
          console.log('Added user to online list:', userId);
        }
      });
      console.log('Online users count:', onlineUsers.size);
      // Only update members list if it hasn't been updated recently
      if (!window.lastMembersUpdate || Date.now() - window.lastMembersUpdate > 5000) {
        await updateMembersList();
        window.lastMembersUpdate = Date.now();
      }
    } else {
      onlineUsers.clear();
      // Only update members list if it hasn't been updated recently
      if (!window.lastMembersUpdate || Date.now() - window.lastMembersUpdate > 5000) {
        await updateMembersList();
        window.lastMembersUpdate = Date.now();
      }
    }
  });
  
  // Update presence periodically to show user is still active
  const presenceInterval = setInterval(() => {
    if (currentUser) {
      const now = Date.now();
      set(presenceRef, {
        online: true,
        lastSeen: now,
        name: currentUser.email,
        joinedAt: now
      });
      console.log('Updated presence - still online');
    }
  }, 30000); // Update every 30 seconds
  
  // Handle page unload
  window.addEventListener('beforeunload', () => {
    const now = Date.now();
    set(presenceRef, {
      online: false,
      lastSeen: now,
      name: currentUser.email
    });
    clearInterval(presenceInterval);
  });
  
  // Handle page visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    const now = Date.now();
    if (document.hidden) {
      set(presenceRef, {
        online: false,
        lastSeen: now,
        name: currentUser.email
      });
      console.log('User went offline (tab hidden)');
    } else {
      set(presenceRef, {
        online: true,
        lastSeen: now,
        name: currentUser.email,
        joinedAt: now
      });
      console.log('User came back online (tab visible)');
    }
  });
  
  // Debug function to check online status
  console.log('Current user ID:', currentUser.uid);
  console.log('Classroom ID:', classroomId);
  console.log('Online users map:', onlineUsers);
  
  // Force immediate update only once
  setTimeout(async () => {
    if (!window.lastMembersUpdate) {
      await updateMembersList();
      window.lastMembersUpdate = Date.now();
    }
  }, 1000);
}



// Add message to UI
async function addMessageToUI(message) {
  const messageElement = await createMessageElement(message);
  elements.messagesContainer.appendChild(messageElement);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    elements.messagesContainer.scrollTo({
      top: elements.messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
  
  // Add date divider if needed
  addDateDivider(message.timestamp);
}

// Create message element
async function createMessageElement(message) {
  const messageDiv = document.createElement('div');
  const isOwnMessage = message.senderId === currentUser.uid;
  const messageDate = message.timestamp ? new Date(message.timestamp.toDate()) : new Date();
  const displayName = message.senderName ? message.senderName.split('@')[0] : 'Unknown';
  
  // Check if sender is the classroom creator
  const isCreator = currentClassroom && currentClassroom.createdBy === message.senderName;
  const isCurrentUser = message.senderId === currentUser.uid;
  const canBan = (isAdmin || isProfessor) && !isCurrentUser && !isCreator;
  
  // Check if message sender is an admin
  const isSenderAdmin = await isUserAdmin(message.senderId);
  
  // Allow private messaging if:
  // 1. Not messaging yourself AND
  // 2. Either you are admin/professor OR the message sender is admin/professor/creator
  const canMessage = !isCurrentUser && (
    (isAdmin || isProfessor) || // Current user is admin/professor
    (isCreator || isSenderAdmin || isProfessor) // Message sender is admin/professor/creator
  );
  
  // Debug logging
  console.log('Message debug:', {
    senderId: message.senderId,
    senderName: message.senderName,
    currentUser: currentUser.uid,
    isCreator,
    isSenderAdmin,
    isAdmin,
    isProfessor,
    canMessage,
    classroomCreator: currentClassroom?.createdBy
  });
  
  messageDiv.className = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'} fade-in group`;
  
  // Get profile image
  const profileImageUrl = await getUserProfileImage(message.senderId);
  
  messageDiv.innerHTML = `
    <div class="message-bubble ${isOwnMessage ? 'own' : 'other'} px-4 py-3 max-w-xs lg:max-w-md relative">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          ${profileImageUrl ? `
            <img src="${profileImageUrl}" alt="${displayName}" class="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover border-2 ${isOwnMessage ? 'border-blue-400/30' : 'border-gray-500/30'}">
          ` : createProfileImageElement(message.senderId, displayName, isOwnMessage, 'w-8 h-8')}
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium ${isOwnMessage ? 'text-blue-100' : 'text-gray-300'}">
              ${displayName}
            </span>
            ${isCreator ? `
              <span class="px-1.5 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs rounded-full font-medium border border-amber-500/30 flex items-center gap-1">
                <i class="fas fa-crown text-xs"></i>
                Professor
              </span>
            ` : ''}
          </div>
        </div>
        <span class="text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}">
          <i class="fas fa-clock mr-1"></i>${formatTime(messageDate)}
        </span>
      </div>
      <div class="text-sm leading-relaxed">
        ${escapeHtml(message.text)}
      </div>
      
      <!-- Message Actions -->
      <div class="message-actions absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        ${canMessage ? `
          <button class="private-message-btn p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-600/20 rounded transition-colors relative" 
                  data-user-id="${message.senderId}" data-user-name="${message.senderName}" title="Send private message">
            <i class="fas fa-comment-dots text-xs"></i>
            ${privateMessageCounts.get(message.senderId) > 0 ? `
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                ${privateMessageCounts.get(message.senderId) > 9 ? '9+' : privateMessageCounts.get(message.senderId)}
              </span>
            ` : ''}
          </button>
        ` : ''}
        ${canBan ? `
          <button class="ban-user-btn p-1.5 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors" 
                  data-user-id="${message.senderId}" data-user-name="${message.senderName}" title="Ban user">
            <i class="fas fa-ban text-xs"></i>
          </button>
        ` : ''}
        ${isAdmin ? `
          <button class="delete-message-btn p-1.5 text-red-300 hover:text-red-100 rounded transition-colors" 
                  data-message-id="${message.id}" title="Delete message">
            <i class="fas fa-trash text-xs"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `;
  
  // Add event listeners for message actions
  const privateMessageBtn = messageDiv.querySelector('.private-message-btn');
  const banUserBtn = messageDiv.querySelector('.ban-user-btn');
  const deleteBtn = messageDiv.querySelector('.delete-message-btn');
  
  if (privateMessageBtn) {
    privateMessageBtn.addEventListener('click', async () => {
      const userId = privateMessageBtn.dataset.userId;
      const userName = privateMessageBtn.dataset.userName;
      
      // Clear notification count for this user
      privateMessageCounts.set(userId, 0);
      await updateMembersList();
      
      startPrivateChat(userId, userName);
    });
  }
  
  if (banUserBtn) {
    banUserBtn.addEventListener('click', () => {
      const userId = banUserBtn.dataset.userId;
      const userName = banUserBtn.dataset.userName;
      showBanModal(userId, userName);
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showDeleteModal(message.id);
    });
  }
  
    return messageDiv;
}

// Add date divider
function addDateDivider(timestamp) {
  const messageDate = timestamp ? new Date(timestamp.toDate()) : new Date();
  const dateString = messageDate.toDateString();
  
  if (lastMessageDate !== dateString) {
    lastMessageDate = dateString;
    
    const divider = document.createElement('div');
    divider.className = 'message-date-divider';
    divider.innerHTML = `<span>${formatDate(messageDate)}</span>`;
    
    elements.messagesContainer.appendChild(divider);
  }
}

// Set typing status
function setTypingStatus(isTyping) {
  const typingRef = ref(rtdb, `classrooms/${classroomId}/typing/${currentUser.uid}`);
  set(typingRef, isTyping);
}

// Update typing indicator
function updateTypingIndicator() {
  if (typingUsers.size > 0) {
    const typingNames = Array.from(typingUsers).map(userId => {
      const user = onlineUsers.get(userId);
      return user ? user.name.split('@')[0] : 'Someone';
    });
    
    const typingText = typingNames.length === 1 ? 
      `${typingNames[0]} is typing` : 
      `${typingNames.slice(0, 2).join(', ')}${typingNames.length > 2 ? ' and others' : ''} are typing`;
    
    elements.typingIndicator.querySelector('span').textContent = typingText;
    elements.typingIndicator.classList.remove('hidden');
  } else {
    elements.typingIndicator.classList.add('hidden');
  }
}

// Check for new private messages
async function checkPrivateMessages() {
  try {
    if (!currentUser) return;
    
    const privateMessagesQuery = query(
      collection(db, 'classrooms', classroomId, 'privateMessages'),
      where('participants', 'array-contains', currentUser.uid),
      where('senderId', '!=', currentUser.uid), // Only messages from others
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(privateMessagesQuery);
    const newMessages = [];
    
    snapshot.forEach(doc => {
      const message = doc.data();
      const messageTime = message.timestamp ? message.timestamp.toDate() : new Date();
      
      // Check if this is a new message since last check
      if (!lastPrivateMessageCheck || messageTime > lastPrivateMessageCheck) {
        const senderId = message.senderId;
        const currentCount = privateMessageCounts.get(senderId) || 0;
        privateMessageCounts.set(senderId, currentCount + 1);
        newMessages.push(message);
      }
    });
    
    // Update last check time
    lastPrivateMessageCheck = new Date();
    
    // Update UI if there are new messages
    if (newMessages.length > 0) {
      await updateMembersList();
      showPrivateMessageNotification(newMessages);
    }
    
  } catch (error) {
    console.error('Error checking private messages:', error);
  }
}

// Show private message notification
function showPrivateMessageNotification(messages) {
  // Play notification sound
  const notificationSound = document.getElementById('notification-sound');
  if (notificationSound) {
    notificationSound.play().catch(e => console.log('Could not play notification sound:', e));
  }
  
  if (messages.length === 1) {
    const senderName = messages[0].senderName ? messages[0].senderName.split('@')[0] : 'Someone';
    showToast(`New private message from ${senderName}`, 'info');
  } else if (messages.length > 1) {
    showToast(`${messages.length} new private messages`, 'info');
  }
}

// Load all classroom members
async function loadAllMembers() {
  try {
    if (!currentClassroom.members || currentClassroom.members.length === 0) {
      allMembers.clear();
      return;
    }
    
    // Debug: Check for duplicates in classroom members array
    const classroomMemberIds = new Set();
    const uniqueMemberIds = [];
    currentClassroom.members.forEach(memberId => {
      if (classroomMemberIds.has(memberId)) {
        console.log('Duplicate member ID in classroom:', memberId);
      } else {
        classroomMemberIds.add(memberId);
        uniqueMemberIds.push(memberId);
      }
    });
    
    console.log('Classroom members array length:', currentClassroom.members.length);
    console.log('Unique member IDs:', uniqueMemberIds.length);
    
    // Use unique member IDs instead of the original array
    const membersToLoad = uniqueMemberIds;

    // Get user data for all members
    const memberPromises = membersToLoad.map(async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: userId,
            name: userData.email || 'Unknown',
            role: userData.role || 'student'
          };
        } else {
          // If user document doesn't exist, create a basic entry
          return {
            id: userId,
            name: 'Unknown User',
            role: 'student'
          };
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        return {
          id: userId,
          name: 'Unknown User',
          role: 'student'
        };
      }
    });

    const memberResults = await Promise.all(memberPromises);
    allMembers.clear();
    
    // Debug: Check for duplicates in member results
    const resultMemberIds = new Set();
    const uniqueMembers = [];
    
    memberResults.forEach(member => {
      if (resultMemberIds.has(member.id)) {
        console.log('Duplicate member found in results:', member.id, member.name);
      } else {
        resultMemberIds.add(member.id);
        uniqueMembers.push(member);
        allMembers.set(member.id, member);
      }
    });
    
    console.log('Total members loaded:', allMembers.size);
    console.log('Unique members:', uniqueMembers.length);

    // Update the members list
    await updateMembersList();
    
  } catch (error) {
    console.error('Error loading all members:', error);
  }
}

// Update members list
async function updateMembersList() {
  // Clear the members list first
  elements.membersList.innerHTML = '';
  
  // Create a sorted list of members (professors first, then online users, then away users, then offline users)
  const sortedMembers = Array.from(allMembers.values()).sort((a, b) => {
    const aIsCreator = currentClassroom && currentClassroom.createdBy === a.name;
    const bIsCreator = currentClassroom && currentClassroom.createdBy === b.name;
    const aStatus = getUserStatus(a.id);
    const bStatus = getUserStatus(b.id);
    
    // Professors first
    if (aIsCreator && !bIsCreator) return -1;
    if (!aIsCreator && bIsCreator) return 1;
    
    // Then by status: online > away > offline
    const statusOrder = { 'online': 3, 'away': 2, 'offline': 1 };
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[bStatus] - statusOrder[aStatus];
    }
    
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });
  
  // Track added members to prevent duplicates
  const addedMemberIds = new Set();
  
  for (const member of sortedMembers) {
    // Skip if we've already added this member
    if (addedMemberIds.has(member.id)) {
      console.log('Skipping duplicate member:', member.id);
      continue;
    }
    
    addedMemberIds.add(member.id);
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-card rounded-lg p-3 text-sm fade-in';
    memberDiv.setAttribute('data-member-id', member.id); // Add data attribute for identification
    
    const displayName = member.name.split('@')[0];
    const isCreator = currentClassroom && currentClassroom.createdBy === member.name;
    const isCurrentUser = member.id === currentUser.uid;
    const userStatus = getUserStatus(member.id);
    const isOnline = userStatus === 'online';
    const isAway = userStatus === 'away';
    const canBan = (isAdmin || isProfessor) && !isCurrentUser && !isCreator;
    
    // Check if member is an admin
    const isMemberAdmin = await isUserAdmin(member.id);
    
    // Allow private messaging if:
    // 1. Not messaging yourself AND
    // 2. Either you are admin/professor OR the member is admin/professor/creator
    const canMessage = !isCurrentUser && (
      (isAdmin || isProfessor) || // Current user is admin/professor
      (isCreator || isMemberAdmin || isProfessor) // Member is admin/professor/creator
    );
    
    // Get profile image
    const profileImageUrl = await getUserProfileImage(member.id);
    
    // Get status indicator
    let statusIndicator = '';
    let statusText = '';
    let textColor = 'text-gray-400';
    
    if (userStatus === 'online') {
      statusIndicator = '<span class="online-indicator"></span>';
      statusText = 'Online now';
      textColor = 'text-white';
    } else if (userStatus === 'away') {
      statusIndicator = '<span class="away-indicator"></span>';
      statusText = 'Away';
      textColor = 'text-yellow-400';
    } else {
      statusIndicator = '<span class="offline-indicator"></span>';
      statusText = getLastSeenText(member.id);
    }
    
    memberDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          ${profileImageUrl ? `
            <img src="${profileImageUrl}" alt="${displayName}" class="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover border-2 ${userStatus === 'online' ? 'border-blue-400/30' : userStatus === 'away' ? 'border-yellow-400/30' : 'border-gray-500/30'}">
          ` : createProfileImageElement(member.id, displayName, false, 'w-8 h-8')}
          <div>
            <div class="flex items-center gap-2">
              ${statusIndicator}
              <span class="font-medium ${textColor}">${displayName}</span>
              ${isCreator ? `
                <span class="px-1.5 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs rounded-full font-medium border border-amber-500/30 flex items-center gap-1">
                  <i class="fas fa-crown text-xs"></i>
                  Professor
                </span>
              ` : ''}
            </div>
            <span class="text-xs text-gray-400">
              ${statusText}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${canMessage ? `
            <button class="private-message-btn p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-600/20 rounded transition-colors relative" 
                    data-user-id="${member.id}" data-user-name="${member.name}" title="Send private message">
              <i class="fas fa-comment-dots text-xs"></i>
              ${privateMessageCounts.get(member.id) > 0 ? `
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  ${privateMessageCounts.get(member.id) > 9 ? '9+' : privateMessageCounts.get(member.id)}
                </span>
              ` : ''}
            </button>
          ` : ''}
          ${canBan ? `
            <button class="ban-user-btn p-1.5 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors" 
                    data-user-id="${member.id}" data-user-name="${member.name}" title="Ban user">
              <i class="fas fa-ban text-xs"></i>
            </button>
          ` : ''}
          <div class="text-xs text-gray-400">
            <i class="fas fa-circle ${isOnline ? 'text-green-400' : 'text-gray-500'}"></i>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const privateMessageBtn = memberDiv.querySelector('.private-message-btn');
    const banUserBtn = memberDiv.querySelector('.ban-user-btn');
    
    if (privateMessageBtn) {
      privateMessageBtn.addEventListener('click', async () => {
        const userId = privateMessageBtn.dataset.userId;
        const userName = privateMessageBtn.dataset.userName;
        
        // Clear notification count for this user
        privateMessageCounts.set(userId, 0);
        await updateMembersList();
        
        startPrivateChat(userId, userName);
      });
    }
    
    if (banUserBtn) {
      banUserBtn.addEventListener('click', () => {
        const userId = banUserBtn.dataset.userId;
        const userName = banUserBtn.dataset.userName;
        showBanModal(userId, userName);
      });
    }
    
    elements.membersList.appendChild(memberDiv);
  }
  
  elements.memberCount.textContent = allMembers.size;
  elements.onlineCountNumber.textContent = onlineUsers.size;
}

// Setup emoji picker
function setupEmojiPicker() {
  elements.emojiPicker.innerHTML = '';
  
  emojis.forEach(emoji => {
    const emojiBtn = document.createElement('button');
    emojiBtn.className = 'emoji-btn text-lg';
    emojiBtn.textContent = emoji;
    emojiBtn.addEventListener('click', () => {
      insertEmoji(emoji);
    });
    elements.emojiPicker.appendChild(emojiBtn);
  });
}

// Toggle emoji picker
function toggleEmojiPicker() {
  elements.emojiPicker.classList.toggle('show');
}

// Insert emoji into input
function insertEmoji(emoji) {
  const input = elements.messageInput;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const text = input.value;
  
  input.value = text.substring(0, start) + emoji + text.substring(end);
  input.selectionStart = input.selectionEnd = start + emoji.length;
  input.focus();
  
  elements.emojiPicker.classList.remove('show');
}

// Auto-resize textarea
function autoResizeTextarea() {
  const textarea = elements.messageInput;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = elements.sidebar;
  const overlay = elements.sidebarOverlay;
  
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  
  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// Show delete modal
function showDeleteModal(messageId) {
  elements.deleteModal.classList.remove('hidden');
  elements.deleteModal.classList.add('flex');
  elements.confirmDelete.dataset.messageId = messageId;
}

// Close delete modal
function closeDeleteModal() {
  elements.deleteModal.classList.add('hidden');
  elements.deleteModal.classList.remove('flex');
}

// Confirm delete message
async function confirmDeleteMessage() {
  const messageId = elements.confirmDelete.dataset.messageId;
  
  try {
    await deleteDoc(doc(db, 'classrooms', classroomId, 'messages', messageId));
    showToast('Message deleted successfully', 'success');
  } catch (error) {
    console.error('Error deleting message:', error);
    showToast('Error deleting message', 'error');
  }
  
  closeDeleteModal();
}

// Utility functions
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (messageListener) messageListener();
  if (typingListener) off(ref(rtdb, `classrooms/${classroomId}/typing`));
  if (presenceListener) off(ref(rtdb, `classrooms/${classroomId}/presence`));
  if (privateMessageListener) privateMessageListener();
});

// Private Messaging Functions
async function startPrivateChat(userId, userName) {
  // Set up private chat modal
  currentChatMode = 'private';
  privateChatWith = { id: userId, name: userName };
  
  // Update modal UI
  elements.privateChatTitle.textContent = 'Private Chat';
  elements.privateChatSubtitle.textContent = `with ${userName.split('@')[0]}`;
  
  // Show modal
  elements.privateChatModal.classList.remove('hidden');
  elements.privateChatModal.classList.add('flex');
  
  // Load private messages
  await loadPrivateMessages(userId);
  
  // Setup private message listener
  setupPrivateMessageListener(userId);
  
  // Focus on input
  setTimeout(() => {
    elements.privateMessageInput.focus();
  }, 100);
  
  showToast(`Started private chat with ${userName.split('@')[0]}`, 'info');
}

async function loadPrivateMessages(userId) {
  try {
    // Show loading state
    elements.privateMessagesContainer.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Loading messages...</p>
      </div>
    `;
    
    // Query for private messages
    const privateMessagesQuery = query(
      collection(db, 'classrooms', classroomId, 'privateMessages'),
      where('participants', 'array-contains', currentUser.uid)
    );
    
    const snapshot = await getDocs(privateMessagesQuery);
    const relevantMessages = [];
    
    // Filter and sort messages manually
    snapshot.forEach(doc => {
      const message = { id: doc.id, ...doc.data() };
      if (message.participants && message.participants.includes(userId)) {
        relevantMessages.push(message);
      }
    });
    
    // Sort messages by timestamp
    relevantMessages.sort((a, b) => {
      const timeA = a.timestamp ? a.timestamp.toDate() : new Date(0);
      const timeB = b.timestamp ? b.timestamp.toDate() : new Date(0);
      return timeA - timeB;
    });
    
    // Clear container and add messages
    elements.privateMessagesContainer.innerHTML = '';
    for (const message of relevantMessages) {
      await addPrivateMessageToUI(message);
    }
    
    console.log(`Loaded ${relevantMessages.length} private messages`);
    
  } catch (error) {
    console.error('Error loading private messages:', error);
    elements.privateMessagesContainer.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <i class="fas fa-exclamation-triangle text-2xl mb-4"></i>
        <p>Error loading messages. Please try again.</p>
      </div>
    `;
  }
}

function setupPrivateMessageListener(userId) {
  try {
    console.log('Setting up private message listener for user:', userId);
    
    const privateMessagesQuery = query(
      collection(db, 'classrooms', classroomId, 'privateMessages'),
      where('participants', 'array-contains', currentUser.uid)
    );
    
    // Remove existing listener if any
    if (privateMessageListener) {
      console.log('Removing existing private message listener');
      privateMessageListener();
      privateMessageListener = null;
    }
    
    privateMessageListener = onSnapshot(privateMessagesQuery, async (snapshot) => {
      console.log('Private message snapshot received:', snapshot.docChanges().length, 'changes');
      
      for (const change of snapshot.docChanges()) {
        console.log('Private message change:', change.type, change.doc.id);
        
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() };
          console.log('New private message:', message);
          
          if (message.participants && message.participants.includes(userId)) {
            // Check if message already exists to avoid duplicates
            const exists = document.querySelector(`[data-message-id="${message.id}"]`);
            if (!exists) {
              console.log('Adding new private message to UI:', message.id);
              await addPrivateMessageToUI(message);
            } else {
              console.log('Private message already exists in UI:', message.id);
            }
          } else {
            console.log('Message not for current private chat:', message.participants, 'vs', userId);
          }
        }
      }
    }, (error) => {
      console.error('Error in private message listener:', error);
    });
    
    console.log('Private message listener set up successfully');
  } catch (error) {
    console.error('Error setting up private message listener:', error);
  }
}

async function addPrivateMessageToUI(message) {
  console.log('Adding private message to UI:', message.id, message.text);
  
  // Check if private chat modal is visible
  if (elements.privateChatModal.classList.contains('hidden')) {
    console.log('Private chat modal is hidden, not adding message to UI');
    return;
  }
  
  const messageElement = await createPrivateMessageElement(message);
  elements.privateMessagesContainer.appendChild(messageElement);
  
  console.log('Private message element added to container');
  
  // Smooth scroll to bottom
  setTimeout(() => {
    elements.privateMessagesContainer.scrollTo({
      top: elements.privateMessagesContainer.scrollHeight,
      behavior: 'smooth'
    });
    console.log('Scrolled to bottom of private messages');
  }, 100);
}

async function createPrivateMessageElement(message) {
  const messageDiv = document.createElement('div');
  const isOwnMessage = message.senderId === currentUser.uid;
  const messageDate = message.timestamp ? new Date(message.timestamp.toDate()) : new Date();
  const displayName = message.senderName ? message.senderName.split('@')[0] : 'Unknown';
  
  messageDiv.className = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'} fade-in`;
  messageDiv.setAttribute('data-message-id', message.id);
  
  // Get profile image
  const profileImageUrl = await getUserProfileImage(message.senderId);
  
  messageDiv.innerHTML = `
    <div class="message-bubble ${isOwnMessage ? 'own' : 'other'} px-4 py-3 max-w-xs lg:max-w-md">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          ${profileImageUrl ? `
            <img src="${profileImageUrl}" alt="${displayName}" class="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover border-2 ${isOwnMessage ? 'border-purple-400/30' : 'border-gray-500/30'}">
          ` : createProfileImageElement(message.senderId, displayName, isOwnMessage, 'w-8 h-8')}
          <span class="text-xs font-medium ${isOwnMessage ? 'text-purple-100' : 'text-gray-300'}">
            ${displayName}
          </span>
        </div>
        <span class="text-xs ${isOwnMessage ? 'text-purple-100' : 'text-gray-400'}">
          <i class="fas fa-clock mr-1"></i>${formatTime(messageDate)}
        </span>
      </div>
      <div class="text-sm leading-relaxed">
        ${escapeHtml(message.text)}
      </div>
    </div>
  `;
  
  return messageDiv;
}

async function sendPrivateMessage(text, recipientId) {
  try {
    console.log('Sending private message to:', recipientId, 'Text:', text);
    
    const messageData = {
      text: text,
      senderId: currentUser.uid,
      senderName: currentUser.email,
      recipientId: recipientId,
      participants: [currentUser.uid, recipientId].sort(),
      timestamp: serverTimestamp(),
      type: 'private'
    };
    
    console.log('Message data:', messageData);
    
    const docRef = await addDoc(collection(db, 'classrooms', classroomId, 'privateMessages'), messageData);
    console.log('Private message sent successfully with ID:', docRef.id);
    
    // Show success feedback
    showToast('Message sent', 'success');
    
  } catch (error) {
    console.error('Error sending private message:', error);
    showToast('Error sending private message', 'error');
  }
}

function closePrivateChat() {
  currentChatMode = 'public';
  privateChatWith = null;
  
  // Hide modal
  elements.privateChatModal.classList.add('hidden');
  elements.privateChatModal.classList.remove('flex');
  
  // Clear messages
  elements.privateMessagesContainer.innerHTML = '';
  
  // Remove private message listener
  if (privateMessageListener) {
    privateMessageListener();
    privateMessageListener = null;
  }
  
  // Clear input
  elements.privateMessageInput.value = '';
  
  showToast('Closed private chat', 'info');
}

// Handle private message submission
async function handlePrivateMessageSubmit(event) {
  event.preventDefault();
  
  const text = elements.privateMessageInput.value.trim();
  if (!text || !privateChatWith) return;
  
  try {
    // Disable send button
    elements.privateSendBtn.disabled = true;
    
    await sendPrivateMessage(text, privateChatWith.id);
    
    // Clear input
    elements.privateMessageInput.value = '';
    autoResizePrivateTextarea();
    
  } catch (error) {
    console.error('Error sending private message:', error);
    showToast('Error sending message', 'error');
  } finally {
    elements.privateSendBtn.disabled = false;
  }
}

// Auto-resize private message textarea
function autoResizePrivateTextarea() {
  const textarea = elements.privateMessageInput;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Get user profile image
async function getUserProfileImage(userId) {
  try {
    // Check cache first
    if (profileImageCache.has(userId)) {
      return profileImageCache.get(userId);
    }
    
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const photoURL = userData.photoURL || null;
      
      // Cache the result
      profileImageCache.set(userId, photoURL);
      return photoURL;
    }
    
    // If user document doesn't exist, cache null
    profileImageCache.set(userId, null);
    return null;
    
  } catch (error) {
    console.error('Error getting user profile image:', error);
    // If error occurs, cache null
    profileImageCache.set(userId, null);
    return null;
  }
}

// Create profile image element
function createProfileImageElement(userId, displayName, isOwnMessage = false, size = 'w-8 h-8') {
  const initials = displayName.substring(0, 2).toUpperCase();
  
  return `
    <div class="profile-image-container ${size} rounded-full overflow-hidden mr-3 flex-shrink-0" data-user-id="${userId}">
      <div class="w-full h-full bg-gradient-to-br ${isOwnMessage ? 'from-blue-500 to-blue-600' : 'from-gray-600 to-gray-700'} flex items-center justify-center">
        <span class="text-xs font-medium text-white">${initials}</span>
      </div>
    </div>
  `;
}

// Get last seen text for offline users
function getLastSeenText(userId) {
  try {
    // Try to get last seen from onlineUsers data (for recently offline users)
    const userData = onlineUsers.get(userId);
    if (userData && userData.lastSeen) {
      // Handle both timestamp formats (number and Firestore timestamp)
      let lastSeen;
      if (typeof userData.lastSeen === 'number') {
        lastSeen = new Date(userData.lastSeen);
      } else if (userData.lastSeen && userData.lastSeen.toDate) {
        lastSeen = userData.lastSeen.toDate();
      } else {
        lastSeen = new Date(userData.lastSeen);
      }
      
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return 'Last seen a while ago';
    }
    
    return 'Offline';
  } catch (error) {
    console.error('Error getting last seen text:', error);
    return 'Offline';
  }
}

// Check if user is away (inactive for more than 5 minutes)
function isUserAway(userId) {
  try {
    const userData = onlineUsers.get(userId);
    if (userData && userData.lastSeen) {
      // Handle both timestamp formats (number and Firestore timestamp)
      let lastSeen;
      if (typeof userData.lastSeen === 'number') {
        lastSeen = new Date(userData.lastSeen);
      } else if (userData.lastSeen && userData.lastSeen.toDate) {
        lastSeen = userData.lastSeen.toDate();
      } else {
        lastSeen = new Date(userData.lastSeen);
      }
      
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      return diffMins > 5; // Away if inactive for more than 5 minutes
    }
    return false;
  } catch (error) {
    console.error('Error checking if user is away:', error);
    return false;
  }
}

// Get user status (online, away, offline)
function getUserStatus(userId) {
  if (onlineUsers.has(userId)) {
    if (isUserAway(userId)) {
      return 'away';
    }
    return 'online';
  }
  return 'offline';
}

// Check if a specific user is an admin
async function isUserAdmin(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role && (userData.role.includes('admin') || userData.role.includes('author'));
    }
    return false;
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
}



// Ban/Unban Functions
async function banUser(userId, userName, reason = '') {
  try {
    const banData = {
      userId: userId,
      userName: userName,
      bannedBy: currentUser.uid,
      bannedByEmail: currentUser.email,
      reason: reason,
      timestamp: serverTimestamp(),
      classroomId: classroomId
    };
    
    await addDoc(collection(db, 'classrooms', classroomId, 'bans'), banData);
    
    // Remove user from classroom members
    const members = currentClassroom.members || [];
    const updatedMembers = members.filter(memberId => memberId !== userId);
    
    await updateDoc(doc(db, 'classrooms', classroomId), {
      members: updatedMembers,
      memberCount: updatedMembers.length
    });
    
    bannedUsers.add(userId);
    showToast(`${userName.split('@')[0]} has been banned`, 'success');
    
    // Reload all members to reflect the change
    await loadAllMembers();
    
  } catch (error) {
    console.error('Error banning user:', error);
    showToast('Error banning user', 'error');
  }
}

async function unbanUser(userId, userName) {
  try {
    // Remove ban record
    const bansQuery = query(
      collection(db, 'classrooms', classroomId, 'bans'),
      where('userId', '==', userId)
    );
    const banSnapshot = await getDocs(bansQuery);
    
    banSnapshot.forEach(async (banDoc) => {
      await deleteDoc(banDoc.ref);
    });
    
    // Add user back to classroom members
    const members = currentClassroom.members || [];
    if (!members.includes(userId)) {
      members.push(userId);
      await updateDoc(doc(db, 'classrooms', classroomId), {
        members: members,
        memberCount: members.length
      });
    }
    
    bannedUsers.delete(userId);
    showToast(`${userName.split('@')[0]} has been unbanned`, 'success');
    
    // Reload all members to reflect the change
    await loadAllMembers();
    
  } catch (error) {
    console.error('Error unbanning user:', error);
    showToast('Error unbanning user', 'error');
  }
}

async function loadBannedUsers() {
  try {
    const bansQuery = query(collection(db, 'classrooms', classroomId, 'bans'));
    const snapshot = await getDocs(bansQuery);
    
    bannedUsers.clear();
    snapshot.forEach(doc => {
      const banData = doc.data();
      bannedUsers.add(banData.userId);
    });
  } catch (error) {
    console.error('Error loading banned users:', error);
  }
}

function showBanModal(userId, userName) {
  if (elements.banModal) {
    elements.banUserInfo.textContent = userName.split('@')[0];
    elements.confirmBan.dataset.userId = userId;
    elements.confirmBan.dataset.userName = userName;
    elements.banModal.classList.remove('hidden');
    elements.banModal.classList.add('flex');
  }
}

function closeBanModal() {
  if (elements.banModal) {
    elements.banModal.classList.add('hidden');
    elements.banModal.classList.remove('flex');
    elements.banReason.value = '';
  }
}

async function confirmBanUser() {
  const userId = elements.confirmBan.dataset.userId;
  const userName = elements.confirmBan.dataset.userName;
  const reason = elements.banReason.value.trim();
  
  await banUser(userId, userName, reason);
  closeBanModal();
}

// Handle send message
async function handleSendMessage(event) {
  event.preventDefault();
  
  const text = elements.messageInput.value.trim();
  if (!text) return;
  
  // Check if user is banned
  if (bannedUsers.has(currentUser.uid)) {
    showToast('You are banned from this classroom', 'error');
    return;
  }
  
  try {
    // Disable send button
    elements.sendBtn.disabled = true;
    
    const messageData = {
      text: text,
      senderId: currentUser.uid,
      senderName: currentUser.email,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, 'classrooms', classroomId, 'messages'), messageData);
    
    // Clear input and reset typing status
    elements.messageInput.value = '';
    setTypingStatus(false);
    autoResizeTextarea();
    
  } catch (error) {
    console.error('Error sending message:', error);
    showToast('Error sending message', 'error');
  } finally {
    elements.sendBtn.disabled = false;
  }
} 