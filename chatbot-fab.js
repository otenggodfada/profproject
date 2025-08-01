// Modern AI Study Assistant FAB
class ChatbotFAB {
  constructor() {
    this.knowledgeBase = {};
    this.responsePatterns = {};
    this.init();
  }

  async init() {
    await this.loadDataset();
    this.createFAB();
    this.setupEvents();
  }

  async loadDataset() {
    try {
      const response = await fetch('enhanced-chatbot-datasets.json');
      const data = await response.json();
      
      this.knowledgeBase = data.datasets;
      this.responsePatterns = data.response_patterns;
      
      console.log('Enhanced dataset loaded successfully for FAB:', data.project, 'v' + data.version);
      console.log('Contact information available:', !!this.knowledgeBase.profstudymate_platform?.contact_social);
      console.log('Platform info available:', !!this.knowledgeBase.profstudymate_platform?.company_info);
    } catch (error) {
      console.error('Error loading enhanced dataset for FAB:', error);
      // Fallback to basic responses
      this.loadFallbackDataset();
    }
  }

  loadFallbackDataset() {
    // Fallback responses if JSON loading fails
    this.knowledgeBase = {
      profstudymate_platform: {
        company_info: {
          about: {
            answer: "ProfStudyMate is Ghana's premier professional education platform that transforms careers with expert-led professional education. We specialize in ICAG, CITG, and business growth strategies with industry experts and practical learning experiences."
          },
          success_rate: {
            answer: "ProfStudyMate has a 95% success rate with over 2000+ students trained. Our first attempt pass rate is also 95%, demonstrating our commitment to student success."
          },
          location_contact: {
            answer: "ProfStudyMate is located at Fefeti Drive, Spintex Road, Tema, Greater Accra, Ghana. You can contact us at +233 243 44 39 34, +233 244 990 773, or +233 246 752 130, or email us at Profstraining52@gmail.com or profsa35@gmail.com. Business hours are Mon-Fri: 9am-5pm."
          }
        },
        courses: {
          icagh: {
            answer: "ICAGH refers to Institute of Chartered Accountants Ghana certification. ProfStudyMate offers 15+ professional accounting courses designed for ICAG certification success, with over 1000+ students enrolled. Our courses provide comprehensive preparation for the ICAG exams."
          },
          citgh: {
            answer: "CITGH refers to Chartered Institute of Taxation Ghana certification. ProfStudyMate offers 12+ comprehensive training courses for CITG certification with over 800+ students. Our programs provide thorough preparation for taxation certification exams."
          }
        },
        platform_features: {
          support: {
            answer: "ProfStudyMate provides 24/7 support with round-the-clock assistance, quick response times, and expert guidance. We have 50+ expert instructors and a dedicated support team available to help students succeed."
          },
          mobile_app: {
            answer: "Yes, ProfStudyMate offers mobile apps available on Google Play and App Store. The apps provide access to courses anytime, anywhere with offline learning and progress tracking features for convenient learning."
          }
        },
        success_stories: {
          martin_asare: {
            answer: "Martin Asare, Accounts Manager and ICAGH Graduate, says: 'Prof has the ability to break down concepts to your levels. I never believed I could pass Corporate Reporting on my first try. The support and guidance were exceptional!'"
          }
        }
      }
    };

    this.responsePatterns = {
      default_responses: [
        "I'm here to help you with your studies and ProfStudyMate platform information! Could you tell me more about what you're working on?",
        "Great question! I can help you with various subjects including math, programming, accounting, study strategies, and ProfStudyMate platform information. What would you like to explore?"
      ]
    };
  }

  createFAB() {
    // Create FAB button
    const fab = document.createElement('div');
    fab.id = 'simple-fab';
    fab.innerHTML = `
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        #fab-button {
          animation: float 3s ease-in-out infinite;
        }
        
        #fab-button:hover {
          animation: pulse 1s ease-in-out infinite;
        }
        
        #fab-button:active {
          animation: none;
          transform: scale(0.95);
        }
        
        .suggested-question {
          animation: fadeInUp 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }
        
        .suggested-question::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }
        
        .suggested-question:hover::before {
          left: 100%;
        }
        
        .suggested-question:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }
        
        .suggested-question:active {
          transform: translateY(-1px) scale(1.01);
        }
        
        .suggested-question:nth-child(1) { animation-delay: 0.1s; }
        .suggested-question:nth-child(2) { animation-delay: 0.2s; }
        .suggested-question:nth-child(3) { animation-delay: 0.3s; }
        .suggested-question:nth-child(4) { animation-delay: 0.4s; }
        .suggested-question:nth-child(5) { animation-delay: 0.5s; }
        
        #welcome-message {
          animation: fadeInUp 0.8s ease-out;
        }
        
        #back-to-questions {
          animation: fadeInUp 0.6s ease-out;
        }
        
        #chat-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
          transform: scale(1.02);
          background: rgba(255, 255, 255, 0.95);
        }
        
        button[type="submit"]:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(102, 126, 234, 0.6);
        }
        
        button[type="submit"]:active {
          transform: translateY(-1px);
        }
        
        #close-modal:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.25));
          transform: scale(1.15);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        #show-questions-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(102, 126, 234, 0.6);
        }
        
        #show-questions-btn:active {
          transform: translateY(-1px);
        }
        
        .message-bubble {
          animation: fadeInUp 0.4s ease-out;
        }
        
        .message-bubble.user {
          animation-delay: 0.1s;
        }
        
        .message-bubble.bot {
          animation-delay: 0.2s;
        }
        
        /* Custom scrollbar for chat messages */
        #chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        #chat-messages::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        
        #chat-messages::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 3px;
        }
        
        #chat-messages::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
      </style>
              <button id="fab-button" style="
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        ">🤖</button>
      
      <div id="fab-menu" style="
        position: fixed;
        bottom: 180px;
        right: 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        padding: 20px;
        display: none;
        z-index: 9998;
        min-width: 280px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transform: translateY(10px) scale(0.95);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        <div style="
          font-weight: 600; 
          margin-bottom: 16px; 
          color: #1f2937; 
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: inline-block;
          "></span>
          AI Study Assistant
        </div>
        <button id="open-chat" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">💬</span>
          <div>
            <div style="font-weight: 600;">Open Chat</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Ask me anything</div>
          </div>
        </button>
        <button id="math-help" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #fbbf24;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #92400e;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">🧮</span>
          <div>
            <div style="font-weight: 600;">Math Help</div>
            <div style="font-size: 12px; color: #a16207; margin-top: 2px;">Equations & formulas</div>
          </div>
        </button>
        <button id="study-tips" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border: 1px solid #60a5fa;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #1e40af;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">📚</span>
          <div>
            <div style="font-weight: 600;">Study Tips</div>
            <div style="font-size: 12px; color: #3b82f6; margin-top: 2px;">Learning strategies</div>
          </div>
        </button>
        <button id="profstudymate-info" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
          border: 1px solid #a855f7;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #581c87;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">🎓</span>
          <div>
            <div style="font-weight: 600;">ProfStudyMate</div>
            <div style="font-size: 12px; color: #7c3aed; margin-top: 2px;">Platform information</div>
          </div>
        </button>
        <button id="course-info" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #10b981;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #065f46;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">📖</span>
          <div>
            <div style="font-weight: 600;">Courses</div>
            <div style="font-size: 12px; color: #059669; margin-top: 2px;">ICAG, CITG & more</div>
          </div>
        </button>
        <button id="contact-info" style="
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin: 6px 0;
          background: linear-gradient(135deg, #fef2f2, #fecaca);
          border: 1px solid #f87171;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #991b1b;
          font-weight: 500;
        ">
          <span style="font-size: 18px;">📞</span>
          <div>
            <div style="font-weight: 600;">Contact</div>
            <div style="font-size: 12px; color: #dc2626; margin-top: 2px;">Phone & email</div>
          </div>
        </button>
      </div>
      
      <div id="chat-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
        backdrop-filter: blur(10px);
        display: none;
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease-out;
      ">
        <div style="
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95));
          backdrop-filter: blur(25px);
          border-radius: 28px;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 32px 100px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transform: scale(0.9);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        ">
          <!-- Decorative background elements -->
          <div style="
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          "></div>
          <div style="
            position: absolute;
            bottom: -30%;
            left: -30%;
            width: 160%;
            height: 160%;
            background: radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          "></div>
          <div style="
            padding: 28px 28px 24px 28px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 28px 28px 0 0;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          ">
                          <div style="display: flex; align-items: center; gap: 16px;">
              <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
              ">🤖</div>
              <div>
                <h3 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">AI Study Assistant</h3>
                <div style="font-size: 13px; opacity: 0.9; margin-top: 4px; font-weight: 500;">Ready to help you learn! 🚀</div>
              </div>
            </div>
                         <button id="close-modal" style="
               background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
               border: 1px solid rgba(255, 255, 255, 0.3);
               font-size: 22px;
               cursor: pointer;
               color: white;
               padding: 10px;
               width: 44px;
               height: 44px;
               display: flex;
               align-items: center;
               justify-content: center;
               border-radius: 50%;
               transition: all 0.3s ease;
               z-index: 10001;
               pointer-events: auto;
               position: relative;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
               font-weight: 300;
             ">×</button>
          </div>
          
          <div id="chat-messages" style="
            flex: 1;
            padding: 28px;
            overflow-y: auto;
            max-height: 450px;
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6));
            position: relative;
            z-index: 1;
          ">
            <!-- Welcome message and suggested questions -->
            <div id="welcome-message" style="
              text-align: center;
              padding: 28px;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
              border-radius: 20px;
              margin-bottom: 24px;
              border: 1px solid rgba(226, 232, 240, 0.6);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
              backdrop-filter: blur(10px);
            ">
              <div style="
                width: 72px;
                height: 72px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px auto;
                font-size: 28px;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                border: 3px solid rgba(255, 255, 255, 0.8);
              ">🤖</div>
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
                Welcome to AI Study Assistant! 🎓
              </h3>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 15px; line-height: 1.6; font-weight: 500;">
                I'm here to help you with your studies and ProfStudyMate platform information. 
                Here are some questions you can ask me:
              </p>
              
              <div style="display: grid; gap: 14px; max-width: 450px; margin: 0 auto;">
                <button class="suggested-question" data-question="What is ProfStudyMate?" style="
                  background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
                  border: 1px solid #a855f7;
                  color: #581c87;
                  padding: 16px 20px;
                  border-radius: 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: left;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
                  position: relative;
                  overflow: hidden;
                ">
                  <span style="font-size: 18px; margin-right: 10px;">🎓</span>
                  What is ProfStudyMate?
                </button>
                
                <button class="suggested-question" data-question="Tell me about ICAG courses" style="
                  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                  border: 1px solid #10b981;
                  color: #065f46;
                  padding: 16px 20px;
                  border-radius: 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: left;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
                  position: relative;
                  overflow: hidden;
                ">
                  <span style="font-size: 18px; margin-right: 10px;">📖</span>
                  Tell me about ICAG courses
                </button>
                
                <button class="suggested-question" data-question="How can I contact ProfStudyMate?" style="
                  background: linear-gradient(135deg, #fef2f2, #fecaca);
                  border: 1px solid #f87171;
                  color: #991b1b;
                  padding: 16px 20px;
                  border-radius: 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: left;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.15);
                  position: relative;
                  overflow: hidden;
                ">
                  <span style="font-size: 18px; margin-right: 10px;">📞</span>
                  How can I contact ProfStudyMate?
                </button>
                
                <button class="suggested-question" data-question="Can you help me with math problems?" style="
                  background: linear-gradient(135deg, #fef3c7, #fde68a);
                  border: 1px solid #fbbf24;
                  color: #92400e;
                  padding: 16px 20px;
                  border-radius: 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: left;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
                  position: relative;
                  overflow: hidden;
                ">
                  <span style="font-size: 18px; margin-right: 10px;">🧮</span>
                  Can you help me with math problems?
                </button>
                
                <button class="suggested-question" data-question="What are effective study tips?" style="
                  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                  border: 1px solid #60a5fa;
                  color: #1e40af;
                  padding: 16px 20px;
                  border-radius: 16px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: left;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.15);
                  position: relative;
                  overflow: hidden;
                ">
                  <span style="font-size: 18px; margin-right: 10px;">📚</span>
                  What are effective study tips?
                </button>
              </div>
            </div>
            
            <!-- Back to questions button (hidden initially) -->
            <div id="back-to-questions" style="
              display: none;
              text-align: center;
              padding: 20px;
              margin-bottom: 20px;
            ">
              <button id="show-questions-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                padding: 16px 24px;
                border-radius: 30px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0 auto;
                transition: all 0.3s ease;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                letter-spacing: 0.5px;
              ">
                <span style="font-size: 18px;">🔙</span>
                Show Suggested Questions
              </button>
            </div>
          </div>
          
          <form id="chat-form" style="
            padding: 24px 28px 28px 28px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
            border-radius: 0 0 28px 28px;
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
          ">
                         <input type="text" id="chat-input" placeholder="Ask me anything about your studies..." style="
               flex: 1;
               padding: 16px 24px;
               border: 2px solid rgba(226, 232, 240, 0.8);
               border-radius: 30px;
               font-size: 15px;
               outline: none;
               transition: all 0.3s ease;
               background: rgba(249, 250, 251, 0.8);
               color: #000000;
               font-weight: 500;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
             ">
            <button type="submit" style="
              padding: 16px 28px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 30px;
              cursor: pointer;
              font-weight: 700;
              font-size: 15px;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 10px;
              box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
              letter-spacing: 0.5px;
            ">
              <span>Send</span>
              <span style="font-size: 18px;">→</span>
            </button>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(fab);
  }

  setupEvents() {
    // Wait a bit for DOM elements to be ready
    setTimeout(() => {
      const fabButton = document.getElementById('fab-button');
      const fabMenu = document.getElementById('fab-menu');
      const openChat = document.getElementById('open-chat');
      const mathHelp = document.getElementById('math-help');
      const studyTips = document.getElementById('study-tips');
      const profstudymateInfo = document.getElementById('profstudymate-info');
      const courseInfo = document.getElementById('course-info');
      const contactInfo = document.getElementById('contact-info');
      const chatModal = document.getElementById('chat-modal');
      const closeModal = document.getElementById('close-modal');
      const chatForm = document.getElementById('chat-form');
      const chatInput = document.getElementById('chat-input');

             console.log('Elements found:', {
         fabButton: !!fabButton,
         fabMenu: !!fabMenu,
         openChat: !!openChat,
         mathHelp: !!mathHelp,
         studyTips: !!studyTips,
         chatModal: !!chatModal,
         closeModal: !!closeModal,
         chatForm: !!chatForm,
         chatInput: !!chatInput
       });

       // Debug close button specifically
       if (closeModal) {
         console.log('Close button found:', closeModal);
         console.log('Close button style:', closeModal.style.cssText);
         console.log('Close button z-index:', closeModal.style.zIndex);
         console.log('Close button pointer-events:', closeModal.style.pointerEvents);
       }

    // FAB button click
    fabButton.onclick = () => {
      if (fabMenu.style.display === 'none' || !fabMenu.style.display) {
        fabMenu.style.display = 'block';
        setTimeout(() => {
          fabMenu.style.transform = 'translateY(0) scale(1)';
          fabMenu.style.opacity = '1';
        }, 10);
      } else {
        fabMenu.style.transform = 'translateY(10px) scale(0.95)';
        fabMenu.style.opacity = '0';
        setTimeout(() => {
          fabMenu.style.display = 'none';
        }, 300);
      }
    };

    // Hover effects for FAB button
    fabButton.onmouseenter = () => {
      fabButton.style.transform = 'scale(1.1)';
      fabButton.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
    };

    fabButton.onmouseleave = () => {
      fabButton.style.transform = 'scale(1)';
      fabButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
    };

    // Menu button hover effects
    [openChat, mathHelp, studyTips, profstudymateInfo, courseInfo, contactInfo].forEach(btn => {
      if (btn) {
        btn.onmouseenter = () => {
          btn.style.transform = 'translateX(5px)';
          btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        };
        
        btn.onmouseleave = () => {
          btn.style.transform = 'translateX(0)';
          btn.style.boxShadow = 'none';
        };
      }
    });

    // Open chat
    openChat.onclick = () => {
      this.openModal();
    };

    // Math help
    mathHelp.onclick = () => {
      this.openModal("Can you help me with math problems? I need assistance with equations and formulas.");
    };

    // Study tips
    studyTips.onclick = () => {
      this.openModal("I need study tips and learning strategies. Can you help me improve my study habits?");
    };

    // ProfStudyMate info
    if (profstudymateInfo) {
      profstudymateInfo.onclick = () => {
        this.openModal("What is ProfStudyMate? Tell me about the platform and its features.");
      };
    }

    // Course info
    if (courseInfo) {
      courseInfo.onclick = () => {
        this.openModal("What courses does ProfStudyMate offer? I'm interested in ICAG and CITG programs.");
      };
    }

    // Contact info
    if (contactInfo) {
      contactInfo.onclick = () => {
        this.openModal("How can I contact ProfStudyMate? I need their phone number and email address.");
      };
    }

         // Close modal
     if (closeModal) {
       console.log('Setting up close button event listener');
       closeModal.onclick = (e) => {
         e.preventDefault();
         e.stopPropagation();
         console.log('Close button clicked');
         this.closeModal();
       };
       
       // Also try addEventListener as backup
       closeModal.addEventListener('click', (e) => {
         e.preventDefault();
         e.stopPropagation();
         console.log('Close button clicked (addEventListener)');
         this.closeModal();
       });
     } else {
       console.error('Close modal button not found!');
     }

    // Close modal on background click
    chatModal.onclick = (e) => {
      if (e.target === chatModal) {
        this.closeModal();
      }
    };

    // Form submission
    chatForm.onsubmit = (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        this.addMessage(message, 'user');
        this.simulateResponse(message);
        chatInput.value = '';
        this.hideWelcomeMessage();
        this.showBackButton();
      }
    };

    // Suggested question buttons
    const suggestedQuestions = document.querySelectorAll('.suggested-question');
    suggestedQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        this.addMessage(question, 'user');
        this.simulateResponse(question);
        this.hideWelcomeMessage();
        this.showBackButton();
      });

      // Hover effects for suggested questions
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = 'none';
      });
    });

    // Back to questions button
    const showQuestionsBtn = document.getElementById('show-questions-btn');
    if (showQuestionsBtn) {
      showQuestionsBtn.addEventListener('click', () => {
        this.showWelcomeMessage();
        this.hideBackButton();
      });

      // Hover effects for back button
      showQuestionsBtn.addEventListener('mouseenter', () => {
        showQuestionsBtn.style.transform = 'translateY(-2px)';
        showQuestionsBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
      });

      showQuestionsBtn.addEventListener('mouseleave', () => {
        showQuestionsBtn.style.transform = 'translateY(0)';
        showQuestionsBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
      });
    }

         // Close menu when clicking outside
     document.onclick = (e) => {
       if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
         fabMenu.style.transform = 'translateY(10px) scale(0.95)';
         fabMenu.style.opacity = '0';
         setTimeout(() => {
           fabMenu.style.display = 'none';
         }, 300);
       }
     };
     }, 100); // Close the setTimeout
   }

  openModal(initialMessage = null) {
    const modal = document.getElementById('chat-modal');
    const modalContent = modal.querySelector('div');
    
    modal.style.display = 'flex';
    setTimeout(() => {
      modalContent.style.transform = 'scale(1)';
      modalContent.style.opacity = '1';
    }, 10);

    // Reset chat state
    this.showWelcomeMessage();
    this.hideBackButton();
    
    // Clear previous messages
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      // Keep only the welcome message and back button
      const welcomeMessage = document.getElementById('welcome-message');
      const backButton = document.getElementById('back-to-questions');
      chatMessages.innerHTML = '';
      if (welcomeMessage) chatMessages.appendChild(welcomeMessage);
      if (backButton) chatMessages.appendChild(backButton);
    }

    if (initialMessage) {
      setTimeout(() => {
        this.hideWelcomeMessage();
        this.addMessage(initialMessage, 'user');
        this.simulateResponse(initialMessage);
        this.showBackButton();
      }, 500);
    }
  }

  hideWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }
  }

  showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.style.display = 'block';
      welcomeMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showBackButton() {
    const backButton = document.getElementById('back-to-questions');
    if (backButton) {
      backButton.style.display = 'block';
    }
  }

  hideBackButton() {
    const backButton = document.getElementById('back-to-questions');
    if (backButton) {
      backButton.style.display = 'none';
    }
  }

     closeModal() {
     console.log('closeModal method called');
     const modal = document.getElementById('chat-modal');
     const modalContent = modal.querySelector('div');
     
     console.log('Modal found:', !!modal);
     console.log('Modal content found:', !!modalContent);
     
     if (modal && modalContent) {
       modalContent.style.transform = 'scale(0.9)';
       modalContent.style.opacity = '0';
       
       setTimeout(() => {
         modal.style.display = 'none';
         console.log('Modal hidden');
       }, 300);
     } else {
       console.error('Modal or modal content not found');
     }
   }

  addMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    const isUser = sender === 'user';
    messageDiv.className = `message-bubble ${sender}`;
    messageDiv.style.cssText = `
      margin-bottom: 20px;
      display: flex;
      justify-content: ${isUser ? 'flex-end' : 'flex-start'};
      align-items: flex-end;
      gap: 8px;
    `;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isUser) {
      messageDiv.innerHTML = `
        <div style="
          max-width: 75%;
          padding: 16px 20px;
          border-radius: 20px 20px 4px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 15px;
          line-height: 1.5;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          position: relative;
          word-wrap: break-word;
        ">${text}</div>
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        ">👤</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          flex-shrink: 0;
        ">🤖</div>
        <div style="
          max-width: 75%;
          padding: 18px 22px;
          border-radius: 20px 20px 20px 4px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
          color: #1f2937;
          font-size: 15px;
          line-height: 1.6;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.6);
          backdrop-filter: blur(10px);
          position: relative;
          word-wrap: break-word;
        ">${text}</div>
      `;
    }
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  simulateResponse(userMessage) {
    // Use enhanced dataset for responses
    const lowerMessage = userMessage.toLowerCase();
    let response = this.getDefaultResponse();

    // Check if we have the enhanced dataset loaded
    if (this.knowledgeBase.profstudymate_platform) {
      const platform = this.knowledgeBase.profstudymate_platform;

      // Check for contact queries FIRST (before general profstudymate queries)
      if (lowerMessage.includes('contact') || lowerMessage.includes('location') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('tema') || lowerMessage.includes('how can i contact')) {
        console.log('FAB processing general contact query');
        response = platform.company_info.location_contact.answer;
      } else if (lowerMessage.includes('success rate') || lowerMessage.includes('95%') || lowerMessage.includes('students trained')) {
        response = platform.company_info.success_rate.answer;
      } else if (lowerMessage.includes('profstudymate') && !lowerMessage.includes('contact') && !lowerMessage.includes('phone') && !lowerMessage.includes('email')) {
        response = platform.company_info.about.answer;
      } else if (lowerMessage.includes('phone number') || lowerMessage.includes('phone numbers')) {
        response = platform.contact_social.phone_numbers.answer;
      } else if (lowerMessage.includes('email address') || lowerMessage.includes('email addresses') || lowerMessage.includes('emails')) {
        response = platform.contact_social.email_addresses.answer;
      } else if (lowerMessage.includes('physical address') || lowerMessage.includes('visit') || lowerMessage.includes('where are you located')) {
        response = platform.contact_social.physical_address.answer;
      } else if (lowerMessage.includes('business hours') || lowerMessage.includes('working hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
        response = platform.contact_social.business_hours.answer;
      } else if (lowerMessage.includes('social media') || lowerMessage.includes('follow') || lowerMessage.includes('social')) {
        response = platform.contact_social.social_media_presence.answer;
      } else if (lowerMessage.includes('download app') || lowerMessage.includes('mobile app') || lowerMessage.includes('app store') || lowerMessage.includes('google play')) {
        response = platform.contact_social.app_download.answer;
      } else if (lowerMessage.includes('icag') || lowerMessage.includes('icagh') || lowerMessage.includes('chartered accountants')) {
        response = platform.courses.icagh.answer;
      } else if (lowerMessage.includes('citg') || lowerMessage.includes('citgh') || lowerMessage.includes('taxation')) {
        response = platform.courses.citgh.answer;
      } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('24/7')) {
        response = platform.platform_features.support.answer;
      } else if (lowerMessage.includes('mobile app') || lowerMessage.includes('app store') || lowerMessage.includes('google play')) {
        response = platform.platform_features.mobile_app.answer;
      } else if (lowerMessage.includes('student') || lowerMessage.includes('testimonial') || lowerMessage.includes('graduate')) {
        response = platform.success_stories.martin_asare.answer;
      } else if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('formula')) {
        response = 'I can help you with math! Here are some key concepts:\n\n• **Algebra**: Solving equations, factoring, quadratic formulas\n• **Geometry**: Area, volume, Pythagorean theorem\n• **Calculus**: Derivatives, integrals, limits\n\nWhat specific math topic are you struggling with?';
      } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tip')) {
        response = 'Great question! Here are proven study strategies:\n\n• **Pomodoro Technique**: 25min focus, 5min break\n• **Active Recall**: Test yourself instead of re-reading\n• **Spaced Repetition**: Review at increasing intervals\n• **Mind Mapping**: Visual organization of concepts\n\nWhich strategy would you like to learn more about?';
      }
    } else {
      // Fallback responses if dataset not loaded
      const fallbackResponses = {
        'profstudymate': 'ProfStudyMate is Ghana\'s premier professional education platform that transforms careers with expert-led professional education. We specialize in ICAG, CITG, and business growth strategies with industry experts and practical learning experiences.',
        'math': 'I can help you with math! Here are some key concepts:\n\n• **Algebra**: Solving equations, factoring, quadratic formulas\n• **Geometry**: Area, volume, Pythagorean theorem\n• **Calculus**: Derivatives, integrals, limits\n\nWhat specific math topic are you struggling with?',
        'study': 'Great question! Here are proven study strategies:\n\n• **Pomodoro Technique**: 25min focus, 5min break\n• **Active Recall**: Test yourself instead of re-reading\n• **Spaced Repetition**: Review at increasing intervals\n• **Mind Mapping**: Visual organization of concepts\n\nWhich strategy would you like to learn more about?'
      };

      if (lowerMessage.includes('profstudymate') || lowerMessage.includes('what is profstudymate')) {
        response = fallbackResponses.profstudymate;
      } else if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('formula')) {
        response = fallbackResponses.math;
      } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tip')) {
        response = fallbackResponses.study;
      }
    }

    setTimeout(() => {
      this.addMessage(response, 'assistant');
    }, 1000);
  }

  getDefaultResponse() {
    const responses = this.responsePatterns?.default_responses || [
      "I'm here to help with your studies and ProfStudyMate platform information! I can assist with:\n\n• **ProfStudyMate courses** (ICAG, CITG, Corporate Training)\n• **Math problems** and equations\n• **Study techniques** and learning strategies\n• **Platform information** and contact details\n• **Student success stories** and testimonials\n\nWhat would you like to work on today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Initialize FAB
new ChatbotFAB();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  #welcome-message {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .suggested-question {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .suggested-question:nth-child(1) { animation-delay: 0.1s; }
  .suggested-question:nth-child(2) { animation-delay: 0.2s; }
  .suggested-question:nth-child(3) { animation-delay: 0.3s; }
  .suggested-question:nth-child(4) { animation-delay: 0.4s; }
  .suggested-question:nth-child(5) { animation-delay: 0.5s; }
  
  #back-to-questions {
    animation: fadeInUp 0.4s ease-out;
  }
  
  #chat-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  #close-modal:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: scale(1.1);
  }
  
  button[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;
document.head.appendChild(style); 