// NLUX Integration for ProfStudyMate AI Study Assistant
class NLUXIntegration {
  constructor() {
    this.aiService = null;
    this.chatContainer = null;
    this.isInitialized = false;
    this.initAIService();
  }

  initAIService() {
    // Initialize the existing AI service
    if (typeof AIService !== 'undefined') {
      this.aiService = new AIService();
      this.aiService.enableLocalAI();
      console.log('NLUX: AI Service initialized');
    }
  }

  async init() {
    if (this.isInitialized) return;
    
    // Create chat container
    this.createChatContainer();
    
    // Initialize chat interface
    this.initializeChat();
    
    this.isInitialized = true;
    console.log('NLUX Integration: Initialized successfully');
  }

  createChatContainer() {
    // Remove existing chat container if any
    const existing = document.getElementById('nlux-chat-container');
    if (existing) existing.remove();

    // Create new container
    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'nlux-chat-container';
    this.chatContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      z-index: 10000;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      display: none;
      overflow: hidden;
    `;

    document.body.appendChild(this.chatContainer);
  }

  initializeChat() {
    // Create a modern chat interface
    this.chatContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">🤖 ProfStudyMate AI</h3>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Your AI Study Assistant</p>
            </div>
            <button id="close-nlux-chat" style="
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
        </div>
        
        <!-- Messages Area -->
        <div id="nlux-messages" style="flex: 1; padding: 20px; overflow-y: auto; background: #f8fafc;">
          <div style="
            background: white;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
          ">
            <p style="margin: 0; color: #1e293b; line-height: 1.5;">
              👋 Hello! I'm your ProfStudyMate AI assistant. I'm here to help you with:
            </p>
            <div style="margin-top: 10px; color: #64748b; font-size: 14px;">
              📚 <strong>Study Assistance:</strong> ICAG, CITG courses, study tips, math help<br>
              🏢 <strong>ProfStudyMate Info:</strong> Course details, contact info, success stories<br>
              💡 <strong>General Support:</strong> Educational guidance, career advice
            </div>
            <p style="margin: 10px 0 0 0; color: #1e293b;">
              How can I help you today?
            </p>
          </div>
        </div>
        
        <!-- Input Area -->
        <div style="padding: 20px; border-top: 1px solid #e2e8f0; background: white;">
          <form id="nlux-chat-form" style="display: flex; gap: 10px;">
            <input type="text" id="nlux-chat-input" placeholder="Type your message..." style="
              flex: 1;
              padding: 12px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 25px;
              outline: none;
              font-size: 14px;
              transition: all 0.3s ease;
            ">
            <button type="submit" id="nlux-send-btn" style="
              padding: 12px 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 25px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 5px;
            ">
              <span>Send</span>
              <i class="fas fa-paper-plane" style="font-size: 12px;"></i>
            </button>
          </form>
        </div>
      </div>
    `;

    // Add event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = document.getElementById('close-nlux-chat');
    const chatForm = document.getElementById('nlux-chat-form');
    const chatInput = document.getElementById('nlux-chat-input');

    // Close button
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
      };
    }

    // Chat form submission
    if (chatForm) {
      chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
          // Add user message
          this.addMessage(message, 'user');
          chatInput.value = '';
          
          // Get AI response
          await this.getAIResponse(message);
        }
      };
    }

    // Input focus effects
    if (chatInput) {
      chatInput.addEventListener('focus', () => {
        chatInput.style.borderColor = '#667eea';
        chatInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      });
      
      chatInput.addEventListener('blur', () => {
        chatInput.style.borderColor = '#e2e8f0';
        chatInput.style.boxShadow = 'none';
      });
    }

    // Focus input when chat opens
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 100);
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('nlux-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin-bottom: 15px;
      display: flex;
      justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
      animation: slideIn 0.3s ease;
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
      line-height: 1.5;
      border-left: ${sender === 'assistant' ? '4px solid #667eea' : 'none'};
    `;
    messageBubble.textContent = text;

    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async getAIResponse(userMessage) {
    try {
      // Show typing indicator
      this.addTypingIndicator();

      // Get response from AI service
      let responseText = '';
      
      if (this.aiService) {
        const response = await this.aiService.generateResponse(userMessage);
        responseText = response.text;
      } else {
        // Fallback response
        responseText = this.getFallbackResponse(userMessage);
      }

      // Remove typing indicator
      this.removeTypingIndicator();

      // Add AI response with delay for natural feel
      setTimeout(() => {
        this.addMessage(responseText, 'assistant');
      }, 500);

    } catch (error) {
      console.error('Error getting AI response:', error);
      this.removeTypingIndicator();
      this.addMessage("I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.", 'assistant');
    }
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AI study assistant. How can I help you with your studies today?";
    } else if (lowerMessage.includes('profstudymate')) {
      return "ProfStudyMate is Ghana's premier professional education platform. We specialize in ICAG, CITG, and business growth strategies with a 95% success rate!";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return "You can contact ProfStudyMate at:\n📞 Phone: +233 243 44 39 34\n📧 Email: Profstraining52@gmail.com\n📍 Location: Fefeti Drive, Spintex Road, Tema";
    } else if (lowerMessage.includes('course') || lowerMessage.includes('icag') || lowerMessage.includes('citg')) {
      return "ProfStudyMate offers:\n• ICAG (Institute of Chartered Accountants Ghana)\n• CITG (Chartered Institute of Taxation Ghana)\n• Corporate Training\n• Digital Marketing\n• Business Growth Strategies";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tip')) {
      return "Here are some study tips:\n• Create a study schedule\n• Use active learning techniques\n• Take regular breaks\n• Practice with past questions\n• Join study groups";
    } else if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('problem')) {
      return "I can help with math problems! Please share the specific equation or concept you're working on.";
    } else {
      return "I'm here to help with your studies! What would you like to know about ProfStudyMate or your courses?";
    }
  }

  addTypingIndicator() {
    const messagesContainer = document.getElementById('nlux-messages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      margin-bottom: 15px;
      display: flex;
      justify-content: flex-start;
    `;

    const typingBubble = document.createElement('div');
    typingBubble.style.cssText = `
      padding: 12px 16px;
      border-radius: 18px;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
      display: flex;
      align-items: center;
      gap: 5px;
    `;
    typingBubble.innerHTML = `
      <div style="display: flex; gap: 3px;">
        <div style="width: 8px; height: 8px; background: #667eea; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
        <div style="width: 8px; height: 8px; background: #667eea; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
        <div style="width: 8px; height: 8px; background: #667eea; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
      </div>
      <span style="color: #64748b; font-size: 14px;">AI is typing...</span>
    `;

    typingDiv.appendChild(typingBubble);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  show() {
    if (this.chatContainer) {
      this.chatContainer.style.display = 'block';
      // Focus input when shown
      setTimeout(() => {
        const input = document.getElementById('nlux-chat-input');
        if (input) input.focus();
      }, 100);
    }
  }

  hide() {
    if (this.chatContainer) {
      this.chatContainer.style.display = 'none';
    }
  }

  toggle() {
    if (this.chatContainer.style.display === 'none' || !this.chatContainer.style.display) {
      this.show();
    } else {
      this.hide();
    }
  }

  sendMessage(message) {
    if (message && this.isInitialized) {
      this.addMessage(message, 'user');
      this.getAIResponse(message);
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);

// Create global instance
window.nluxIntegration = new NLUXIntegration();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('NLUX Integration: Auto-initializing...');
  window.nluxIntegration.init();
});

// Export for use in other files
window.NLUXIntegration = NLUXIntegration; 