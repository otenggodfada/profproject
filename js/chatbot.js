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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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
let app, db, auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Global variables
let currentUser = null;
let conversationHistory = [];
let currentConversationId = null;
let settings = {
  personality: 'friendly',
  responseLength: 'detailed',
  subjects: ['math', 'science', 'programming', 'accounting', 'business'],
  showTyping: true,
  soundNotifications: false
};

// DOM elements
const elements = {
  userInfo: document.getElementById('user-info'),
  signOutBtn: document.getElementById('signOut'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsPanel: document.getElementById('settings-panel'),
  settingsOverlay: document.getElementById('settings-overlay'),
  closeSettings: document.getElementById('close-settings'),
  messagesContainer: document.getElementById('messages-container'),
  typingIndicator: document.getElementById('typing-indicator'),
  messageForm: document.getElementById('message-form'),
  messageInput: document.getElementById('message-input'),
  sendBtn: document.getElementById('send-btn'),
  emojiBtn: document.getElementById('emoji-btn'),
  conversationHistory: document.getElementById('conversation-history'),
  clearHistory: document.getElementById('clear-history'),
  aiPersonality: document.getElementById('ai-personality'),
  responseLength: document.getElementById('response-length'),
  typingNotifications: document.getElementById('typing-notifications'),
  soundNotifications: document.getElementById('sound-notifications'),
  exportChat: document.getElementById('export-chat'),
  exportNotes: document.getElementById('export-notes')
};

// AI Response System
class AIStudyAssistant {
  constructor() {
    this.knowledgeBase = {};
    this.responsePatterns = {};
    this.loadDataset();
  }

  async loadDataset() {
    try {
      const response = await fetch('enhanced-chatbot-datasets.json');
      const data = await response.json();
      
      this.knowledgeBase = data.datasets;
      this.responsePatterns = data.response_patterns;
      
      console.log('Enhanced dataset loaded successfully:', data.project, 'v' + data.version);
      console.log('Contact information available:', !!this.knowledgeBase.profstudymate_platform?.contact_social);
      console.log('Platform info available:', !!this.knowledgeBase.profstudymate_platform?.company_info);
    } catch (error) {
      console.error('Error loading enhanced dataset:', error);
      // Fallback to basic knowledge base
      this.loadFallbackDataset();
    }
  }

  loadFallbackDataset() {
    // Fallback knowledge base if JSON loading fails
    this.knowledgeBase = {
      profstudymate_platform: {
        company_info: {
          about: {
            question: "What is ProfStudyMate?",
            answer: "ProfStudyMate is Ghana's premier professional education platform that transforms careers with expert-led professional education. We specialize in ICAG, CITG, and business growth strategies with industry experts and practical learning experiences.",
            keywords: ["profstudymate", "ghana", "professional education", "icag", "citg", "business growth", "platform"]
          },
          success_rate: {
            question: "What is ProfStudyMate's success rate?",
            answer: "ProfStudyMate has a 95% success rate with over 2000+ students trained. Our first attempt pass rate is also 95%, demonstrating our commitment to student success.",
            keywords: ["success rate", "95%", "students trained", "first attempt", "pass rate", "achievement"]
          },
          location_contact: {
            question: "Where is ProfStudyMate located and how can I contact them?",
            answer: "ProfStudyMate is located at Fefeti Drive, Spintex Road, Tema, Greater Accra, Ghana. You can contact us at +233 243 44 39 34, +233 244 990 773, or +233 246 752 130, or email us at Profstraining52@gmail.com or profsa35@gmail.com. Business hours are Mon-Fri: 9am-5pm.",
            keywords: ["location", "tema", "ghana", "phone", "email", "contact", "address", "business hours"]
          }
        }
      },
      math: {
        calculus: {
          derivatives: "Derivatives measure how a function changes as its input changes. The derivative of f(x) at point a is the slope of the tangent line at that point. Key concepts include power rule, chain rule, and product rule.",
          integrals: "Integration is the reverse process of differentiation. It finds the area under a curve and is used to solve accumulation problems.",
          limits: "Limits describe the behavior of a function as the input approaches a certain value. They're fundamental to calculus and help define derivatives and continuity."
        },
        algebra: {
          equations: "Algebraic equations involve variables and constants. Solving them requires isolating the variable using inverse operations.",
          functions: "Functions are relationships between inputs and outputs. They can be linear, quadratic, exponential, or more complex forms."
        }
      },
      programming: {
        oop: "Object-Oriented Programming (OOP) organizes code into objects that contain data and code. Key principles include encapsulation, inheritance, polymorphism, and abstraction.",
        algorithms: "Algorithms are step-by-step procedures for solving problems. They can be analyzed for efficiency using Big O notation.",
        dataStructures: "Data structures organize and store data efficiently. Common types include arrays, linked lists, stacks, queues, trees, and graphs."
      },
      accounting: {
        balanceSheets: "A balance sheet shows a company's financial position at a specific point in time. It follows the equation: Assets = Liabilities + Equity.",
        incomeStatements: "Income statements show revenue, expenses, and profit over a period. They help assess profitability and performance.",
        cashFlow: "Cash flow statements track cash inflows and outflows, showing how a company generates and uses cash."
      },
      studyTips: [
        "Use active recall techniques like flashcards and self-quizzing",
        "Practice spaced repetition to strengthen memory",
        "Break complex topics into smaller, manageable chunks",
        "Teach concepts to others to reinforce understanding",
        "Create mind maps to visualize relationships between ideas",
        "Use the Pomodoro Technique for focused study sessions",
        "Review material regularly rather than cramming",
        "Connect new information to what you already know"
      ],
      examPrep: [
        "Start studying early and create a study schedule",
        "Practice with past exams and sample questions",
        "Focus on understanding concepts, not just memorizing",
        "Use different study methods (visual, auditory, kinesthetic)",
        "Get adequate sleep and maintain a healthy diet",
        "Practice time management during exams",
        "Review and revise regularly",
        "Stay calm and confident on exam day"
      ]
    };

    this.responsePatterns = {
      default_responses: [
        "I'm here to help you with your studies and ProfStudyMate platform information! Could you tell me more about what you're working on?",
        "That's an interesting question. Let me help you understand this better. What specific aspect would you like to focus on?",
        "I'd love to help you with that! To give you the best assistance, could you provide a bit more context about your question?",
        "Great question! I can help you with various subjects including math, programming, accounting, study strategies, and ProfStudyMate platform information. What would you like to explore?"
      ],
      keywords: {
        profstudymate: ["profstudymate", "platform", "ghana", "professional education"],
        icag: ["icag", "icagh", "chartered accountants", "accounting certification"],
        citg: ["citg", "citgh", "taxation", "tax certification"],
        courses: ["courses", "training", "programs", "learning"],
        support: ["support", "help", "assistance", "24/7"],
        math: ["math", "mathematics", "equation", "formula", "calculus", "algebra", "geometry"],
        programming: ["programming", "code", "oop", "object-oriented", "algorithm", "data structure"],
        accounting: ["accounting", "balance sheet", "income statement", "cash flow", "financial"],
        study: ["study", "learn", "tip", "exam", "test preparation", "technique"]
      }
    };
  }

  async generateResponse(userMessage, context = {}) {
    // Show typing indicator
    if (settings.showTyping) {
      this.showTypingIndicator();
    }

    // Simulate AI processing time
    await this.delay(1000 + Math.random() * 2000);

    // Hide typing indicator
    this.hideTypingIndicator();

    // Analyze user message and generate appropriate response
    const response = this.analyzeAndRespond(userMessage, context);
    
    return response;
  }

  analyzeAndRespond(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Check for ProfStudyMate platform queries first
    const platformResponse = this.checkProfStudyMateQueries(lowerMessage);
    if (platformResponse) {
      return platformResponse;
    }
    
    // Check for specific educational topics
    if (lowerMessage.includes('derivative') || lowerMessage.includes('calculus')) {
      return this.getMathResponse('calculus', 'derivatives');
    }
    
    if (lowerMessage.includes('integral') || lowerMessage.includes('integration')) {
      return this.getMathResponse('calculus', 'integrals');
    }
    
    if (lowerMessage.includes('balance sheet') || lowerMessage.includes('accounting')) {
      return this.getAccountingResponse('balanceSheets');
    }
    
    if (lowerMessage.includes('oop') || lowerMessage.includes('object-oriented')) {
      return this.getProgrammingResponse('oop');
    }
    
    if (lowerMessage.includes('study tip') || lowerMessage.includes('study technique')) {
      return this.getStudyTipsResponse();
    }
    
    if (lowerMessage.includes('exam') || lowerMessage.includes('test preparation')) {
      return this.getExamPrepResponse();
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
      return this.getGeneralMathResponse();
    }
    
    if (lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      return this.getGeneralProgrammingResponse();
    }
    
    // Default helpful response
    return this.getDefaultResponse(message);
  }

  checkProfStudyMateQueries(lowerMessage) {
    // Check if we have the enhanced dataset loaded
    if (!this.knowledgeBase.profstudymate_platform) {
      return null;
    }

    const platform = this.knowledgeBase.profstudymate_platform;

    // Check for contact/location queries FIRST (before general profstudymate queries)
    if (lowerMessage.includes('contact') || lowerMessage.includes('location') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('tema') || lowerMessage.includes('how can i contact')) {
      console.log('Processing general contact query');
      return {
        text: platform.company_info.location_contact.answer,
        type: 'platform_info',
        subject: 'profstudymate_platform'
      };
    }

    // Check for success rate queries
    if (lowerMessage.includes('success rate') || lowerMessage.includes('95%') || lowerMessage.includes('students trained')) {
      return {
        text: platform.company_info.success_rate.answer,
        type: 'platform_info',
        subject: 'profstudymate_platform'
      };
    }

    // Check for ProfStudyMate company info (general about queries)
    if (lowerMessage.includes('profstudymate') && !lowerMessage.includes('contact') && !lowerMessage.includes('phone') && !lowerMessage.includes('email')) {
      return {
        text: platform.company_info.about.answer,
        type: 'platform_info',
        subject: 'profstudymate_platform'
      };
    }

    // Check for detailed contact queries
    if (platform.contact_social) {
      if (lowerMessage.includes('phone number') || lowerMessage.includes('phone numbers')) {
        return {
          text: platform.contact_social.phone_numbers.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('email address') || lowerMessage.includes('email addresses') || lowerMessage.includes('emails')) {
        return {
          text: platform.contact_social.email_addresses.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('physical address') || lowerMessage.includes('visit') || lowerMessage.includes('where are you located')) {
        return {
          text: platform.contact_social.physical_address.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('business hours') || lowerMessage.includes('working hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
        return {
          text: platform.contact_social.business_hours.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('social media') || lowerMessage.includes('follow') || lowerMessage.includes('social')) {
        return {
          text: platform.contact_social.social_media_presence.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('download app') || lowerMessage.includes('mobile app') || lowerMessage.includes('app store') || lowerMessage.includes('google play')) {
        return {
          text: platform.contact_social.app_download.answer,
          type: 'contact_info',
          subject: 'profstudymate_platform'
        };
      }
    }

    // Check for course queries
    if (platform.courses) {
      if (lowerMessage.includes('icag') || lowerMessage.includes('icagh') || lowerMessage.includes('chartered accountants')) {
        return {
          text: platform.courses.icagh.answer,
          type: 'course_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('citg') || lowerMessage.includes('citgh') || lowerMessage.includes('taxation')) {
        return {
          text: platform.courses.citgh.answer,
          type: 'course_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('corporate training') || lowerMessage.includes('organizational development')) {
        return {
          text: platform.courses.corporate_training.answer,
          type: 'course_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('digital marketing') || lowerMessage.includes('marketing strategies')) {
        return {
          text: platform.courses.digital_marketing.answer,
          type: 'course_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('business growth') || lowerMessage.includes('business expansion')) {
        return {
          text: platform.courses.business_growth.answer,
          type: 'course_info',
          subject: 'profstudymate_platform'
        };
      }
    }

    // Check for platform features
    if (platform.platform_features) {
      if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('24/7')) {
        return {
          text: platform.platform_features.support.answer,
          type: 'platform_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('mobile app') || lowerMessage.includes('app store') || lowerMessage.includes('google play')) {
        return {
          text: platform.platform_features.mobile_app.answer,
          type: 'platform_info',
          subject: 'profstudymate_platform'
        };
      }

      if (lowerMessage.includes('learning features') || lowerMessage.includes('study materials') || lowerMessage.includes('practice questions')) {
        return {
          text: platform.platform_features.learning_features.answer,
          type: 'platform_info',
          subject: 'profstudymate_platform'
        };
      }
    }

    // Check for success stories
    if (platform.success_stories) {
      if (lowerMessage.includes('student') || lowerMessage.includes('testimonial') || lowerMessage.includes('graduate')) {
        const testimonials = Object.values(platform.success_stories);
        const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
        
        return {
          text: randomTestimonial.answer,
          type: 'testimonial',
          subject: 'profstudymate_platform'
        };
      }
    }

    return null;
  }

  getMathResponse(category, topic) {
    const content = this.knowledgeBase.math?.[category]?.[topic];
    if (!content) {
      return this.getDefaultResponse("I don't have specific information about that math topic yet.");
    }
    
    return {
      text: `Here's what you need to know about ${topic}:\n\n${content}\n\nWould you like me to explain any specific aspect in more detail?`,
      type: 'educational',
      subject: 'mathematics'
    };
  }

  getAccountingResponse(topic) {
    const content = this.knowledgeBase.accounting?.[topic];
    if (!content) {
      return this.getDefaultResponse("I don't have specific information about that accounting topic yet.");
    }
    
    return {
      text: `Let me explain ${topic}:\n\n${content}\n\nThis is a fundamental concept in accounting. Would you like me to provide examples or explain related concepts?`,
      type: 'educational',
      subject: 'accounting'
    };
  }

  getProgrammingResponse(topic) {
    const content = this.knowledgeBase.programming?.[topic];
    if (!content) {
      return this.getDefaultResponse("I don't have specific information about that programming topic yet.");
    }
    
    return {
      text: `Here's an explanation of ${topic}:\n\n${content}\n\nWould you like me to provide code examples or explain how to implement these concepts?`,
      type: 'educational',
      subject: 'programming'
    };
  }

  getStudyTipsResponse() {
    const tips = this.knowledgeBase.studyTips;
    if (!tips || !Array.isArray(tips)) {
      return this.getDefaultResponse("I don't have study tips available at the moment.");
    }
    
    const selectedTips = this.shuffleArray(tips).slice(0, 5);
    
    return {
      text: `Here are some effective study tips:\n\n${selectedTips.map((tip, index) => `${index + 1}. ${tip}`).join('\n')}\n\nTry implementing these techniques and see which ones work best for you!`,
      type: 'tips',
      subject: 'study_skills'
    };
  }

  getExamPrepResponse() {
    const tips = this.knowledgeBase.examPrep;
    if (!tips || !Array.isArray(tips)) {
      return this.getDefaultResponse("I don't have exam preparation tips available at the moment.");
    }
    
    const selectedTips = this.shuffleArray(tips).slice(0, 6);
    
    return {
      text: `Here's how to prepare effectively for exams:\n\n${selectedTips.map((tip, index) => `${index + 1}. ${tip}`).join('\n')}\n\nRemember, consistent preparation is key to exam success!`,
      type: 'tips',
      subject: 'exam_preparation'
    };
  }

  getGeneralMathResponse() {
    return {
      text: `I'd be happy to help you with mathematics! I can assist with:\n\n• Calculus (derivatives, integrals, limits)\n• Algebra (equations, functions, systems)\n• Geometry and trigonometry\n• Statistics and probability\n• Linear algebra\n\nWhat specific math topic would you like to explore?`,
      type: 'guidance',
      subject: 'mathematics'
    };
  }

  getGeneralProgrammingResponse() {
    return {
      text: `I can help you with programming concepts! Here are some areas I can assist with:\n\n• Object-Oriented Programming (OOP)\n• Data structures and algorithms\n• Web development (HTML, CSS, JavaScript)\n• Database concepts\n• Software design patterns\n• Debugging and problem-solving\n\nWhat programming topic interests you?`,
      type: 'guidance',
      subject: 'programming'
    };
  }

  getDefaultResponse(message) {
    const responses = this.responsePatterns?.default_responses || [
      "I'm here to help you with your studies and ProfStudyMate platform information! Could you tell me more about what you're working on?",
      "That's an interesting question. Let me help you understand this better. What specific aspect would you like to focus on?",
      "I'd love to help you with that! To give you the best assistance, could you provide a bit more context about your question?",
      "Great question! I can help you with various subjects including math, programming, accounting, study strategies, and ProfStudyMate platform information. What would you like to explore?"
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      type: 'conversational',
      subject: 'general'
    };
  }

  showTypingIndicator() {
    if (elements.typingIndicator) {
      elements.typingIndicator.classList.remove('hidden');
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }
  }

  hideTypingIndicator() {
    if (elements.typingIndicator) {
      elements.typingIndicator.classList.add('hidden');
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize AI Assistant
const aiAssistant = new AIStudyAssistant();

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing chatbot...');
  
  if (!validateElements()) {
    console.error('Some required elements are missing. Check the HTML structure.');
    return;
  }
  
  if (!auth) {
    console.error('Firebase not initialized properly');
    return;
  }
  
  initializeAuth();
  setupEventListeners();
  loadSettings();
  loadConversationHistory();
  
  // Check for quick message from FAB
  checkForQuickMessage();
});

// Check for quick message from floating action button
function checkForQuickMessage() {
  const quickMessage = localStorage.getItem('chatbot-quick-message');
  if (quickMessage) {
    // Clear the stored message
    localStorage.removeItem('chatbot-quick-message');
    
    // Wait a bit for the page to fully load, then send the message
    setTimeout(() => {
      if (elements.messageInput) {
        elements.messageInput.value = quickMessage;
        elements.messageForm.dispatchEvent(new Event('submit'));
      }
    }, 1000);
  }
}

// Check if all required elements exist
function validateElements() {
  const requiredElements = [
    'user-info', 'signOut', 'settings-btn', 'settings-panel', 'close-settings',
    'messages-container', 'typing-indicator', 'message-form', 'message-input',
    'send-btn', 'conversation-history', 'clear-history'
  ];
  
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  if (missingElements.length > 0) {
    console.error('Missing DOM elements:', missingElements);
    return false;
  }
  return true;
}

// Authentication setup
function initializeAuth() {
  console.log('Initializing authentication...');
  
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
  loadUserConversations(user.uid);
}

// Show login prompt for unauthenticated users
function showLoginPrompt() {
  const mainContent = document.querySelector('.max-w-7xl');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-lock text-6xl text-gray-500 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">Authentication Required</h3>
        <p class="text-gray-400 mb-6">Please sign in to access the AI Study Assistant.</p>
        <a href="account.html" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <i class="fas fa-sign-in-alt mr-2"></i>Sign In
        </a>
      </div>
    `;
  }
  
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

  // Settings
  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener('click', openSettings);
  }
  if (elements.closeSettings) {
    elements.closeSettings.addEventListener('click', closeSettings);
  }
  if (elements.settingsOverlay) {
    elements.settingsOverlay.addEventListener('click', closeSettings);
  }

  // Message form
  if (elements.messageForm) {
    elements.messageForm.addEventListener('submit', handleSendMessage);
  }

  // Message input auto-resize
  if (elements.messageInput) {
    elements.messageInput.addEventListener('input', autoResizeTextarea);
    elements.messageInput.addEventListener('keydown', handleKeyDown);
  }

  // Clear history
  if (elements.clearHistory) {
    elements.clearHistory.addEventListener('click', clearConversationHistory);
  }

  // Export buttons
  if (elements.exportChat) {
    elements.exportChat.addEventListener('click', exportChatHistory);
  }
  if (elements.exportNotes) {
    elements.exportNotes.addEventListener('click', exportAsNotes);
  }

  // Settings changes
  if (elements.aiPersonality) {
    elements.aiPersonality.addEventListener('change', updateSettings);
  }
  if (elements.responseLength) {
    elements.responseLength.addEventListener('change', updateSettings);
  }
  if (elements.typingNotifications) {
    elements.typingNotifications.addEventListener('change', updateSettings);
  }
  if (elements.soundNotifications) {
    elements.soundNotifications.addEventListener('change', updateSettings);
  }
}

// Handle send message
async function handleSendMessage(event) {
  event.preventDefault();
  
  const messageInput = elements.messageInput;
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  // Add user message to UI
  addMessageToUI(message, 'user');
  
  // Clear input
  messageInput.value = '';
  autoResizeTextarea();
  
  // Generate AI response
  try {
    const response = await aiAssistant.generateResponse(message, {
      user: currentUser,
      conversationHistory: conversationHistory.slice(-5) // Last 5 messages for context
    });
    
    // Add AI response to UI
    addMessageToUI(response.text, 'bot', response);
    
    // Save conversation to Firebase
    await saveConversation(message, response);
    
  } catch (error) {
    console.error('Error generating response:', error);
    addMessageToUI('I apologize, but I encountered an error. Please try again.', 'bot');
  }
}

// Add message to UI
function addMessageToUI(message, sender, metadata = {}) {
  const messagesContainer = elements.messagesContainer;
  const messageElement = createMessageElement(message, sender, metadata);
  
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add to conversation history
  conversationHistory.push({
    message,
    sender,
    timestamp: new Date(),
    metadata
  });
}

// Create message element
function createMessageElement(message, sender, metadata = {}) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-bubble ${sender}`;
  
  if (sender === 'user') {
    messageDiv.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
        <div class="flex-1">
          <div class="bg-blue-600 rounded-lg p-4">
            <p class="text-white">${escapeHtml(message)}</p>
          </div>
          <div class="text-xs text-gray-400 mt-2">${formatTime(new Date())}</div>
        </div>
      </div>
    `;
  } else {
    // Process AI response for special formatting
    const processedMessage = processAIResponse(message, metadata);
    
    messageDiv.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="ai-avatar w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
          <i class="fas fa-robot text-white text-sm"></i>
        </div>
        <div class="flex-1">
          <div class="bg-gray-700/50 rounded-lg p-4">
            ${processedMessage}
          </div>
          <div class="text-xs text-gray-400 mt-2">${formatTime(new Date())}</div>
        </div>
      </div>
    `;
  }
  
  return messageDiv;
}

// Process AI response for special formatting
function processAIResponse(message, metadata) {
  let processedMessage = escapeHtml(message);
  
  // Add code blocks
  processedMessage = processedMessage.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="code-block mt-3 mb-3"><div class="text-xs text-gray-400 mb-2">${lang || 'code'}</div><pre class="text-green-400">${escapeHtml(code)}</pre></div>`;
  });
  
  // Add math formulas
  processedMessage = processedMessage.replace(/\$([^$]+)\$/g, (match, formula) => {
    return `<div class="math-formula inline-block mx-1">${escapeHtml(formula)}</div>`;
  });
  
  // Add bullet points
  processedMessage = processedMessage.replace(/^•\s+(.+)$/gm, '<li class="ml-4">$1</li>');
  processedMessage = processedMessage.replace(/(<li.*<\/li>)/s, '<ul class="list-disc ml-4 mt-2 mb-2">$1</ul>');
  
  // Add numbered lists
  processedMessage = processedMessage.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4">$1</li>');
  processedMessage = processedMessage.replace(/(<li.*<\/li>)/s, '<ol class="list-decimal ml-4 mt-2 mb-2">$1</ol>');
  
  return processedMessage;
}

// Handle quick message sending
window.sendQuickMessage = function(message) {
  if (elements.messageInput) {
    elements.messageInput.value = message;
    elements.messageForm.dispatchEvent(new Event('submit'));
  }
};

// Auto-resize textarea
function autoResizeTextarea() {
  const textarea = elements.messageInput;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
}

// Handle key down events
function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    elements.messageForm.dispatchEvent(new Event('submit'));
  }
}

// Settings functions
function openSettings() {
  if (elements.settingsPanel) {
    elements.settingsPanel.style.transform = 'translateX(0)';
  }
  if (elements.settingsOverlay) {
    elements.settingsOverlay.classList.remove('hidden');
  }
}

function closeSettings() {
  if (elements.settingsPanel) {
    elements.settingsPanel.style.transform = 'translateX(100%)';
  }
  if (elements.settingsOverlay) {
    elements.settingsOverlay.classList.add('hidden');
  }
}

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem('chatbot-settings');
  if (savedSettings) {
    settings = { ...settings, ...JSON.parse(savedSettings) };
  }
  
  // Apply settings to UI
  if (elements.aiPersonality) {
    elements.aiPersonality.value = settings.personality;
  }
  if (elements.responseLength) {
    elements.responseLength.value = settings.responseLength;
  }
  if (elements.typingNotifications) {
    elements.typingNotifications.checked = settings.showTyping;
  }
  if (elements.soundNotifications) {
    elements.soundNotifications.checked = settings.soundNotifications;
  }
}

// Update settings
function updateSettings() {
  settings.personality = elements.aiPersonality?.value || 'friendly';
  settings.responseLength = elements.responseLength?.value || 'detailed';
  settings.showTyping = elements.typingNotifications?.checked || false;
  settings.soundNotifications = elements.soundNotifications?.checked || false;
  
  localStorage.setItem('chatbot-settings', JSON.stringify(settings));
  showToast('Settings updated', 'success');
}

// Save conversation to Firebase
async function saveConversation(userMessage, aiResponse) {
  if (!currentUser) return;
  
  try {
    const conversationData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userMessage,
      aiResponse: aiResponse.text,
      responseType: aiResponse.type,
      subject: aiResponse.subject,
      timestamp: serverTimestamp(),
      conversationId: currentConversationId || Date.now().toString()
    };
    
    await addDoc(collection(db, 'chatbot-conversations'), conversationData);
    
    if (!currentConversationId) {
      currentConversationId = conversationData.conversationId;
    }
    
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

// Load user conversations
async function loadUserConversations(userId) {
  try {
    const conversationsRef = collection(db, 'chatbot-conversations');
    const q = query(
      conversationsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const conversations = [];
    
    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    updateConversationHistory(conversations);
    
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
}

// Update conversation history sidebar
function updateConversationHistory(conversations) {
  const historyContainer = elements.conversationHistory;
  if (!historyContainer) return;
  
  historyContainer.innerHTML = '';
  
  if (conversations.length === 0) {
    historyContainer.innerHTML = '<p class="text-gray-400 text-sm">No previous conversations</p>';
    return;
  }
  
  // Group conversations by date
  const groupedConversations = groupConversationsByDate(conversations);
  
  Object.entries(groupedConversations).forEach(([date, dayConversations]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'text-xs text-gray-500 font-medium mb-2 mt-4 first:mt-0';
    dateHeader.textContent = formatDate(new Date(date));
    historyContainer.appendChild(dateHeader);
    
    dayConversations.forEach(conversation => {
      const historyItem = createHistoryItem(conversation);
      historyContainer.appendChild(historyItem);
    });
  });
}

// Group conversations by date
function groupConversationsByDate(conversations) {
  const grouped = {};
  
  conversations.forEach(conversation => {
    const date = new Date(conversation.timestamp?.toDate() || conversation.timestamp).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(conversation);
  });
  
  return grouped;
}

// Create history item
function createHistoryItem(conversation) {
  const item = document.createElement('div');
  item.className = 'history-item p-3 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all duration-200';
  
  const message = conversation.userMessage.length > 50 
    ? conversation.userMessage.substring(0, 50) + '...'
    : conversation.userMessage;
  
  item.innerHTML = `
    <p class="text-sm text-white mb-1">${escapeHtml(message)}</p>
    <div class="flex items-center justify-between text-xs text-gray-400">
      <span>${conversation.subject || 'General'}</span>
      <span>${formatTime(new Date(conversation.timestamp?.toDate() || conversation.timestamp))}</span>
    </div>
  `;
  
  item.addEventListener('click', () => {
    loadConversation(conversation);
  });
  
  return item;
}

// Load specific conversation
function loadConversation(conversation) {
  // Clear current conversation
  elements.messagesContainer.innerHTML = '';
  conversationHistory = [];
  
  // Add the conversation messages
  addMessageToUI(conversation.userMessage, 'user');
  addMessageToUI(conversation.aiResponse, 'bot');
  
  currentConversationId = conversation.conversationId;
  
  showToast('Conversation loaded', 'success');
}

// Clear conversation history
async function clearConversationHistory() {
  if (!currentUser) return;
  
  if (confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
    try {
      const conversationsRef = collection(db, 'chatbot-conversations');
      const q = query(conversationsRef, where('userId', '==', currentUser.uid));
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all(deletePromises);
      
      elements.conversationHistory.innerHTML = '<p class="text-gray-400 text-sm">No previous conversations</p>';
      showToast('Conversation history cleared', 'success');
      
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      showToast('Error clearing history', 'error');
    }
  }
}

// Export functions
function exportChatHistory() {
  if (conversationHistory.length === 0) {
    showToast('No conversation to export', 'info');
    return;
  }
  
  const exportData = {
    exportDate: new Date().toISOString(),
    user: currentUser?.email || 'Unknown',
    conversations: conversationHistory
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chatbot-history-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Chat history exported', 'success');
}

function exportAsNotes() {
  if (conversationHistory.length === 0) {
    showToast('No conversation to export', 'info');
    return;
  }
  
  const notes = conversationHistory
    .filter(msg => msg.sender === 'bot')
    .map(msg => msg.message)
    .join('\n\n---\n\n');
  
  const blob = new Blob([notes], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-notes-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Notes exported', 'success');
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