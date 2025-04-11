/** @format */

document.addEventListener("DOMContentLoaded", function () {
  const footer = `
        <footer class="block bottom-0 left-0 right-0 w-full bg-gradient-to-b from-[#242525] via-[#1a1a1a] to-[#0f0f0f] text-white py-12 px-6 border-t border-gray-800">
            <div class="max-w-7xl mx-auto">
                <!-- Top Section with Logo and Contact -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <!-- Brand Info -->
                    <div class="space-y-6">
                        <a href="./index.html" class="group flex items-center">
                            <div class="relative">
                                <img src="assets/logo (5).png" alt="Logo" class="h-16 mr-4 transform group-hover:scale-110 transition-all duration-500" />
                                <div class="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                            </div>
                            <div>
                                <h2 class="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors duration-500">ProfstudyHub</h2>
                                <p class="text-gray-300 text-lg mt-1">Your Pass Mark is Guaranteed with Us.</p>
                            </div>
                        </a>
                        <div class="space-y-3">
                            <p class="text-gray-400 flex items-center hover:text-white transition-all duration-300 transform hover:translate-x-2">
                                <span class="mr-3 text-xl">📞</span> +233 243 44 39 34
                            </p>
                            <p class="text-gray-400 flex items-center hover:text-white transition-all duration-300 transform hover:translate-x-2">
                                <span class="mr-3 text-xl">📧</span> Profstraining52@gmail.com
                            </p>
                            <p class="text-gray-400 flex items-center hover:text-white transition-all duration-300 transform hover:translate-x-2">
                                <span class="mr-3 text-xl">📍</span> Accra, Ghana
                            </p>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center">
                                <span class="text-yellow-400 text-2xl mr-2">⭐</span>
                                <span class="text-white font-semibold">4.9/5</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-blue-400 text-2xl mr-2">👥</span>
                                <span class="text-white font-semibold">10K+ Students</span>
                            </div>
                        </div>
                    </div>

                    <!-- Newsletter Signup -->
                    <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-gray-800">
                        <h3 class="text-2xl font-bold mb-4 text-blue-400">Stay Updated</h3>
                        <p class="text-gray-300 mb-4">Subscribe to our newsletter for the latest study tips and resources.</p>
                        <div class="flex gap-2">
                            <input type="email" placeholder="Enter your email" class="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                            <button class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 font-semibold">
                                Subscribe
                            </button>
                        </div>
                        <div class="mt-4 flex items-center text-sm text-gray-400">
                            <span class="mr-2">🔒</span> We respect your privacy. Unsubscribe at any time.
                        </div>
                    </div>
                </div>

                <!-- Main Links Section -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <!-- Quick Links -->
                    <div>
                        <h3 class="text-xl font-semibold mb-6 text-blue-400 flex items-center">
                            <span class="mr-2">🚀</span> Quick Links
                        </h3>
                        <ul class="space-y-4">
                            <li><a href="blog.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">📌</span> Blog posts
                            </a></li>
                            <li><a href="courses.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">📚</span> Courses
                            </a></li>
                            <li><a href="store.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">🛒</span> Shop
                            </a></li>
                            <li><a href="gallery.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">📷</span> Gallery
                            </a></li>
                        </ul>
                    </div>

                    <!-- Support -->
                    <div>
                        <h3 class="text-xl font-semibold mb-6 text-blue-400 flex items-center">
                            <span class="mr-2">💡</span> Support
                        </h3>
                        <ul class="space-y-4">
                            <li><a href="support.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">📩</span> Contact Us
                            </a></li>
                            <li><a href="aboutus.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">ℹ️</span> About Us
                            </a></li>
                            <li><a href="terms_conditions.html" class="flex items-center text-gray-400 hover:text-white transform hover:translate-x-2 transition-all duration-300 group">
                                <span class="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300">❓</span> FAQs
                            </a></li>
                        </ul>
                    </div>

            

                    <!-- Download Apps -->
                    <div>
                        <h3 class="text-xl font-semibold mb-6 text-blue-400 flex items-center">
                            <span class="mr-2">📱</span> Download Our Apps
                        </h3>
                        <div class="space-y-4">
                            <a href="https://play.google.com/store/apps/details?id=profstudymate.appev" class="block transform hover:scale-105 transition-all duration-300">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-14 w-auto" />
                            </a>
                            <a href="#" class="block transform hover:scale-105 transition-all duration-300">
                                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" class="h-14 w-auto" />
                            </a>
                        </div>
                        <div class="mt-6">
                            <h4 class="text-lg font-semibold mb-3 text-white">App Features:</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li class="flex items-center">
                                    <span class="mr-2">✅</span> Offline Access
                                </li>
                                <li class="flex items-center">
                                    <span class="mr-2">✅</span> Progress Tracking
                                </li>
                                <li class="flex items-center">
                                    <span class="mr-2">✅</span> Interactive Quizzes
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Social Media Links -->
                <div class="flex flex-wrap justify-center gap-6 mb-12">
                    <a href="http://instagram.com/profs_training_solutions/" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" class="w-6 h-6" alt="Instagram" />
                    </a>
                    <a href="http://tiktok.com/@profstraining" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/3046/3046120.png" class="w-6 h-6" alt="TikTok" />
                    </a>
                    <a href="http://youtube.com/@ProfsTrainingSolutions" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" class="w-6 h-6" alt="YouTube" />
                    </a>
                    <a href="https://linkedin.com/in/profs-training-solutions/" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384062.png" class="w-6 h-6" alt="LinkedIn" />
                    </a>
                    <a href="http://facebook.com/ProfsTraining" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png" class="w-6 h-6" alt="Facebook" />
                    </a>
                    <a href="https://whatsapp.com/channel/0029VaZV6OeEAKWHHdSdiR1S" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384055.png" class="w-6 h-6" alt="WhatsApp" />
                    </a>
                    <a href="https://t.me/Profstrainingsolutions" target="_blank" class="social-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" class="w-6 h-6" alt="Telegram" />
                    </a>
                </div>

                <!-- Copyright -->
                <div class="text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
                    <p class="mb-2">&copy; 2025 ProfstudyHub. All rights reserved.</p>
               
                </div>
            </div>

            <style>
                .social-icon {
                    @apply glassmorphism p-3 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500;
                    background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .social-icon:hover {
                    @apply transform scale-110;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .social-icon:nth-child(1):hover { 
                    background: linear-gradient(145deg, rgba(236,72,153,0.2), rgba(236,72,153,0.1));
                    box-shadow: 0 10px 15px -3px rgba(236,72,153,0.2);
                }
                .social-icon:nth-child(2):hover { 
                    background: linear-gradient(145deg, rgba(75,85,99,0.2), rgba(75,85,99,0.1));
                    box-shadow: 0 10px 15px -3px rgba(75,85,99,0.2);
                }
                .social-icon:nth-child(3):hover { 
                    background: linear-gradient(145deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1));
                    box-shadow: 0 10px 15px -3px rgba(239,68,68,0.2);
                }
                .social-icon:nth-child(4):hover { 
                    background: linear-gradient(145deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1));
                    box-shadow: 0 10px 15px -3px rgba(59,130,246,0.2);
                }
                .social-icon:nth-child(5):hover { 
                    background: linear-gradient(145deg, rgba(37,99,235,0.2), rgba(37,99,235,0.1));
                    box-shadow: 0 10px 15px -3px rgba(37,99,235,0.2);
                }
                .social-icon:nth-child(6):hover { 
                    background: linear-gradient(145deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1));
                    box-shadow: 0 10px 15px -3px rgba(34,197,94,0.2);
                }
                .social-icon:nth-child(7):hover { 
                    background: linear-gradient(145deg, rgba(96,165,250,0.2), rgba(96,165,250,0.1));
                    box-shadow: 0 10px 15px -3px rgba(96,165,250,0.2);
                }
            </style>
        </footer>
    `;
  document.getElementById("footer-container").innerHTML = footer;
});
