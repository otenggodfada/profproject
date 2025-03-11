document.addEventListener("DOMContentLoaded", function () {
    const footer = `
        <footer class="block bottom-0 left-0 right-0 w-full bg-[#172554] text-white py-6 px-4 border-t border-white">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                <!-- Brand Info -->
                <div class="space-y-3">
                    <h2 class="text-3xl font-bold text-white">ProfstudyHub</h2>
                    <p class="text-gray-300">Your Pass Mark is Guaranteed with Us.</p>
                    <p class="text-gray-400">📞 +233 243 44 39 34</p>
                    <p class="text-gray-400">📧 Profstraining52@gmail.com</p>
                </div>
                
                <!-- Quick Links -->
                <div>
                    <h3 class="text-xl font-semibold mb-3">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="blog.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">📌</span> Blog posts</a></li>
                        <li><a href="courses.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">📚</span> Courses</a></li>
                        <li><a href="store.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">🛒</span> Shop</a></li>
                        <li><a href="aboutus.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">📷</span> Gallery</a></li>
                        <li><a href="aboutus.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">🎥</span> Free Videos</a></li>
                    </ul>
                </div>
                
                <!-- Support -->
                <div>
                    <h3 class="text-xl font-semibold mb-3">Support</h3>
                    <ul class="space-y-2">
                        <li><a href="support.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">📩</span> Contact Us</a></li>
                        <li><a href="aboutus.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">ℹ️</span> About Us</a></li>
                        <li><a href="terms_conditions.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">❓</span> FAQs</a></li>
                        <li><a href="terms_conditions.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">📜</span> Terms</a></li>
                        <li><a href="blog.html" class="flex items-center text-gray-400 hover:text-white"><span class="mr-2">✍️</span> Create Article</a></li>
                    </ul>
                </div>
            </div>
            
            <!-- Download Buttons -->
            <div class="mt-6 text-center">
                <p class="text-lg font-semibold mb-2">📲 Get our study apps now!</p>
                <div class="flex justify-center space-x-4">
                    <a href="#" class="hover:scale-105 transition">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-12">
                    </a>
                    <a href="#" class="hover:scale-105 transition">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" class="h-12">
                    </a>
                </div>
            </div>
            
            <!-- Social Media Links -->
            <div class="flex justify-center space-x-4 mt-6">
                 <div>
              <a
              href="http://instagram.com/profs_training_solutions/"
              target="_blank"
              class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
                class="w-6 h-6"
                alt="Instagram"
              />
            </a>
            </div>
           <div>
            <a
            href="http://tiktok.com/@profstraining"
            target="_blank"
            class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/50"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3046/3046120.png"
              class="w-6 h-6"
              alt="TikTok"
            />
          </a>
           </div>
             <div>
              <a
              href="http://youtube.com/@ProfsTrainingSolutions"
              target="_blank"
              class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                class="w-6 h-6"
                alt="YouTube"
              />
            </a>
             </div>
            <div>
              <a
              href="https://linkedin.com/in/profs-training-solutions/"
              target="_blank"
              class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384062.png"
                class="w-6 h-6"
                alt="LinkedIn"
              />
            </a>
            </div>
           <div>
            <a
            href="http://facebook.com/ProfsTraining"
            target="_blank"
            class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-blue-600/50"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png"
              class="w-6 h-6"
              alt="Facebook"
            />
          </a>
           </div>
           <div>
            <a
            href="https://whatsapp.com/channel/0029VaZV6OeEAKWHHdSdiR1S"
            target="_blank"
            class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384055.png"
              class="w-6 h-6"
              alt="WhatsApp"
            />
          </a>
           </div>
       <div>
        <a
        href="https://t.me/Profstrainingsolutions"
        target="_blank"
        class="glassmorphism p-2 flex items-center justify-center w-10 h-10 transition-transform transform hover:scale-110 hover:shadow-lg hover:shadow-blue-400/50"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png"
          class="w-6 h-6"
          alt="Telegram"
        />
      </a>
       </div>
            </div>

            <!-- Copyright -->
            <div class="mt-6 text-center text-gray-400 text-sm border-t border-gray-700 pt-2">
                &copy; 2025 ProfstudyHub. All rights reserved.
            </div>
        </footer>
    `;
    document.getElementById("footer-container").innerHTML = footer;
});
