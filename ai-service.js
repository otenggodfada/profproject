// AI Service for ProfStudyMate Chatbot
class AIService {
  constructor() {
    this.apiKey = null;
    this.baseURL = 'https://api-inference.huggingface.co/models/gpt2';
    this.model = 'gpt2';
    this.maxLength = 1000;
    this.temperature = 0.7;
    this.context = [];
    this.maxContextLength = 10; // Keep last 10 messages for context
    this.useHuggingFace = true; // Use Hugging Face instead of OpenAI
  }

  // Initialize with API key
  init(apiKey) {
    this.apiKey = apiKey;
    console.log('AI Service initialized');
  }

  // Add message to context
  addToContext(role, content) {
    this.context.push({ role, content });
    
    // Keep only the last N messages to manage context length
    if (this.context.length > this.maxContextLength) {
      this.context = this.context.slice(-this.maxContextLength);
    }
  }

  // Clear context
  clearContext() {
    this.context = [];
  }

  // Generate AI response
  async generateResponse(userMessage, systemPrompt = null) {
    // Always use local AI for now (more reliable and free)
    console.log('Using local AI for reliable responses');
    return this.generateLocalResponse(userMessage);
  }

  // Generate response with specific context
  async generateContextualResponse(userMessage, context = {}) {
    let systemPrompt = null;
    
    // Customize system prompt based on context
    if (context.subject === 'profstudymate_platform') {
      systemPrompt = `You are an AI Study Assistant for ProfStudyMate. Focus on providing accurate information about ProfStudyMate's courses, services, and contact details. Be helpful and professional.`;
    } else if (context.subject === 'math') {
      systemPrompt = `You are a math tutor helping students with mathematical concepts. Provide clear explanations, step-by-step solutions, and helpful examples.`;
    } else if (context.subject === 'study_tips') {
      systemPrompt = `You are an educational expert providing study tips and learning strategies. Share practical, evidence-based advice for effective studying.`;
    }

    return this.generateResponse(userMessage, systemPrompt);
  }

  // Check if AI service is available
  isAvailable() {
    return !!this.apiKey || this.useLocalAI;
  }

  // Enable local AI fallback (no API needed)
  enableLocalAI() {
    this.useLocalAI = true;
    console.log('Local AI fallback enabled');
  }

  // Generate local AI response (no API needed)
  async generateLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for common queries
    const responses = {
      greeting: [
        "Hello! I'm your AI study assistant. How can I help you with your studies today?",
        "Hi there! Ready to help you with ProfStudyMate courses and learning strategies!",
        "Welcome! I'm here to assist you with your educational journey."
      ],
      profstudymate: [
        "ProfStudyMate is Ghana's premier professional education platform. We specialize in ICAG, CITG, and business growth strategies with a 95% success rate!",
        "ProfStudyMate offers expert-led professional education in Tema, Ghana. We've trained over 2000+ students successfully.",
        "At ProfStudyMate, we transform careers through professional education. Our courses include ICAG, CITG, and corporate training."
      ],
      contact: [
        "You can contact ProfStudyMate at:\n📞 Phone: +233 243 44 39 34\n📧 Email: Profstraining52@gmail.com\n📍 Location: Fefeti Drive, Spintex Road, Tema",
        "Contact ProfStudyMate:\n📱 +233 244 990 773\n📧 profsa35@gmail.com\n⏰ Business Hours: Mon-Fri 9am-5pm",
        "Reach ProfStudyMate:\n📞 +233 246 752 130\n📧 Profstraining52@gmail.com\n📍 Tema, Greater Accra, Ghana"
      ],
      courses: [
        "ProfStudyMate offers:\n• ICAG (Institute of Chartered Accountants Ghana)\n• CITG (Chartered Institute of Taxation Ghana)\n• Corporate Training\n• Digital Marketing\n• Business Growth Strategies",
        "Our courses include ICAG, CITG, and professional development programs. All courses are led by industry experts with practical learning experiences.",
        "ProfStudyMate specializes in ICAG and CITG certifications, plus corporate training and business growth programs."
      ],
      study: [
        "Here are some study tips:\n• Create a study schedule\n• Use active learning techniques\n• Take regular breaks\n• Practice with past questions\n• Join study groups",
        "Effective study strategies:\n• Set clear goals\n• Use the Pomodoro technique\n• Review regularly\n• Stay organized\n• Get enough sleep",
        "Study tips for success:\n• Find your learning style\n• Use mind maps\n• Practice regularly\n• Stay motivated\n• Ask for help when needed"
      ],
      math: [
        "I can help with math problems! Please share the specific equation or concept you're working on.",
        "Math assistance available! What type of problem are you solving?",
        "Let's tackle that math problem together. What do you need help with?"
      ],
      default: [
        "I'm here to help with your studies! What would you like to know about ProfStudyMate or your courses?",
        "How can I assist you with your learning journey today?",
        "I'm ready to help with study tips, course information, or any questions about ProfStudyMate!"
      ]
    };

    // Determine response category
    let category = 'default';
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      category = 'greeting';
    } else if (lowerMessage.includes('profstudymate') || lowerMessage.includes('platform')) {
      category = 'profstudymate';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('location')) {
      category = 'contact';
    } else if (lowerMessage.includes('course') || lowerMessage.includes('icag') || lowerMessage.includes('citg')) {
      category = 'courses';
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tip')) {
      category = 'study';
    } else if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('problem')) {
      category = 'math';
    }

    // Get random response from category
    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    // Add some contextual variation
    const contextualResponse = this.addContextToResponse(randomResponse, userMessage);
    
    return {
      text: contextualResponse,
      type: 'local_ai_response',
      subject: category,
      usage: { total_tokens: contextualResponse.length }
    };
  }

  // Add context to local responses
  addContextToResponse(response, userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Add follow-up suggestions based on user input
    if (lowerMessage.includes('contact')) {
      return response + "\n\nWould you like to know about our business hours or specific course information?";
    } else if (lowerMessage.includes('course')) {
      return response + "\n\nWould you like to know about our success rate or contact details?";
    } else if (lowerMessage.includes('study')) {
      return response + "\n\nWould you like specific tips for ICAG or CITG preparation?";
    }
    
    return response;
  }

  // Get service status
  getStatus() {
    return {
      available: this.isAvailable(),
      model: this.model,
      contextLength: this.context.length,
      maxContextLength: this.maxContextLength
    };
  }
}

// Export for use in other files
window.AIService = AIService; 