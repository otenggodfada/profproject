// Simple AI Study Assistant FAB
class ChatbotFAB {
  constructor() {
    this.init();
  }

  init() {
    this.createFAB();
    this.setupEvents();
  }

  createFAB() {
    // Remove existing FAB if any
    const existing = document.getElementById('fab-container');
    if (existing) existing.remove();

    // Create FAB container
    this.fabContainer = document.createElement('div');
    this.fabContainer.id = 'fab-container';
    this.fabContainer.innerHTML = `
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
        }
        
        #fab-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          position: fixed;
          bottom: 100px;
          right: 30px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        
        #fab-button:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }
        
        #fab-button:active {
          transform: scale(0.95);
        }
        
        #quick-actions {
          position: fixed;
          bottom: 180px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 9998;
        }
        
        #quick-actions.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .quick-action-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #667eea;
          color: #667eea;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .quick-action-btn:hover {
          transform: scale(1.1);
          background: #667eea;
          color: white;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .quick-action-btn:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          #fab-button {
            width: 55px;
            height: 55px;
            font-size: 22px;
            bottom: 120px;
            right: 20px;
          }
          
          #quick-actions {
            bottom: 190px;
            right: 20px;
          }
          
          .quick-action-btn {
            width: 45px;
            height: 45px;
            font-size: 16px;
          }
        }
      </style>
      
      <button id="fab-button" title="AI Study Assistant">
        🤖
      </button>
      
      <div id="quick-actions">
        <button class="quick-action-btn" id="open-chat-btn" title="Open Full Chat">
          💬
        </button>
        <button class="quick-action-btn" id="math-help-btn" title="Math Help">
          ➗
        </button>
        <button class="quick-action-btn" id="study-tips-btn" title="Study Tips">
          📚
        </button>
        <button class="quick-action-btn" id="profstudymate-info-btn" title="ProfStudyMate Info">
          ℹ️
        </button>
        <button class="quick-action-btn" id="course-info-btn" title="Course Info">
          🎓
        </button>
        <button class="quick-action-btn" id="contact-info-btn" title="Contact Info">
          📞
        </button>
      </div>
    `;

    document.body.appendChild(this.fabContainer);
  }

  setupEvents() {
    const fabButton = document.getElementById('fab-button');
    const quickActions = document.getElementById('quick-actions');
    
    // Main FAB button click
    fabButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('FAB: Main button clicked');
      this.toggleQuickActions();
    };

    // Quick action buttons
    const openChatBtn = document.getElementById('open-chat-btn');
    const mathHelpBtn = document.getElementById('math-help-btn');
    const studyTipsBtn = document.getElementById('study-tips-btn');
    const profstudymateInfoBtn = document.getElementById('profstudymate-info-btn');
    const courseInfoBtn = document.getElementById('course-info-btn');
    const contactInfoBtn = document.getElementById('contact-info-btn');

    // Open chat button
    if (openChatBtn) {
      openChatBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: Opening chat');
        this.openModal();
        this.closeQuickActions();
      };
    }

    // Math help button
    if (mathHelpBtn) {
      mathHelpBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: Math help requested');
        this.openModal('Can you help me with math problems?');
        this.closeQuickActions();
      };
    }

    // Study tips button
    if (studyTipsBtn) {
      studyTipsBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: Study tips requested');
        this.openModal('What are some effective study tips?');
        this.closeQuickActions();
      };
    }

    // ProfStudyMate info button
    if (profstudymateInfoBtn) {
      profstudymateInfoBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: ProfStudyMate info requested');
        this.openModal('Tell me about ProfStudyMate');
        this.closeQuickActions();
      };
    }

    // Course info button
    if (courseInfoBtn) {
      courseInfoBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: Course info requested');
        this.openModal('What courses do you offer?');
        this.closeQuickActions();
      };
    }

    // Contact info button
    if (contactInfoBtn) {
      contactInfoBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('FAB: Contact info requested');
        this.openModal('How can I contact ProfStudyMate?');
        this.closeQuickActions();
      };
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.fabContainer.contains(e.target)) {
        this.closeQuickActions();
      }
    });
  }

  toggleQuickActions() {
    const quickActions = document.getElementById('quick-actions');
    if (quickActions) {
      const isOpen = quickActions.classList.contains('open');
      if (isOpen) {
        quickActions.classList.remove('open');
      } else {
        quickActions.classList.add('open');
      }
    }
  }

  closeQuickActions() {
    const quickActions = document.getElementById('quick-actions');
    if (quickActions) {
      quickActions.classList.remove('open');
    }
  }

  openModal(initialMessage = null) {
    // Use NLUX integration if available
    if (window.nluxIntegration && window.nluxIntegration.isInitialized) {
      console.log('FAB: Opening NLUX chat');
      window.nluxIntegration.show();
      
      // Send initial message if provided
      if (initialMessage) {
        setTimeout(() => {
          window.nluxIntegration.sendMessage(initialMessage);
        }, 500);
      }
    } else {
      console.log('FAB: NLUX not available, using fallback modal');
      this.openFallbackModal(initialMessage);
    }
  }

  openFallbackModal(initialMessage = null) {
    // Remove existing modal if any
    const existing = document.getElementById('chat-modal');
    if (existing) existing.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'chat-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 500px;
        height: 80%;
        max-height: 600px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <h3 style="margin: 0; font-size: 18px;">🤖 AI Study Assistant</h3>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Ready to help you learn!</p>
          </div>
          <button id="close-modal" style="
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          ">×</button>
        </div>
        
        <div id="chat-messages" style="
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8fafc;
        ">
          <div style="
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          ">
            <p style="margin: 0; color: #1e293b;">👋 Hello! I'm your AI study assistant. How can I help you today?</p>
          </div>
        </div>
        
        <form id="chat-form" style="
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          background: white;
          display: flex;
          gap: 10px;
        ">
          <input type="text" id="chat-input" placeholder="Type your message..." style="
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
            transition: all 0.3s ease;
          ">
          <button type="submit" id="send-btn" style="
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
          ">Send</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup modal events
    const closeBtn = document.getElementById('close-modal');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // Close button
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      };
    }

    // Chat form submission
    if (chatForm) {
      chatForm.onsubmit = (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
          this.addMessage(message, 'user');
          chatInput.value = '';
          this.simulateResponse(message);
        }
      };
    }

    // Send initial message if provided
    if (initialMessage) {
      setTimeout(() => {
        this.addMessage(initialMessage, 'user');
        this.simulateResponse(initialMessage);
      }, 500);
    }

    // Focus input
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 100);
  }

  closeModal() {
    // Close NLUX chat if available
    if (window.nluxIntegration) {
      window.nluxIntegration.hide();
    }
    
    // Close fallback modal
    const modal = document.getElementById('chat-modal');
    if (modal) {
      modal.remove();
    }
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin-bottom: 15px;
      display: flex;
      justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
    `;

    const messageBubble = document.createElement('div');
    messageBubble.style.cssText = `
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      background: ${sender === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
      color: ${sender === 'user' ? 'white' : '#1e293b'};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      word-wrap: break-word;
    `;
    messageBubble.textContent = text;

    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async simulateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    // Simple response logic
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "Hello! I'm your AI study assistant. How can I help you with your studies today?";
    } else if (lowerMessage.includes('profstudymate')) {
      response = "ProfStudyMate is Ghana's premier professional education platform. We specialize in ICAG, CITG, and business growth strategies with a 95% success rate!";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      response = "You can contact ProfStudyMate at:\n📞 Phone: +233 243 44 39 34\n📧 Email: Profstraining52@gmail.com\n📍 Location: Fefeti Drive, Spintex Road, Tema";
    } else if (lowerMessage.includes('course') || lowerMessage.includes('icag') || lowerMessage.includes('citg')) {
      response = "ProfStudyMate offers:\n• ICAG (Institute of Chartered Accountants Ghana)\n• CITG (Chartered Institute of Taxation Ghana)\n• Corporate Training\n• Digital Marketing\n• Business Growth Strategies";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tip')) {
      response = "Here are some study tips:\n• Create a study schedule\n• Use active learning techniques\n• Take regular breaks\n• Practice with past questions\n• Join study groups";
    } else if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('problem')) {
      response = "I can help with math problems! Please share the specific equation or concept you're working on.";
    } else {
      response = "I'm here to help with your studies! What would you like to know about ProfStudyMate or your courses?";
    }

    // Add typing delay
    setTimeout(() => {
      this.addMessage(response, 'assistant');
    }, 1000);
  }
}

// Create global instance
window.chatbotFAB = new ChatbotFAB();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Simple Chatbot FAB: Auto-initializing...');
  if (!window.chatbotFAB) {
    window.chatbotFAB = new ChatbotFAB();
  }
});

// Export for use in other files
window.ChatbotFAB = ChatbotFAB; 