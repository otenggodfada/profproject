/** @format */

document.addEventListener("DOMContentLoaded", function () {
const footer = `
            <footer class="block bottom-0 left-0 right-0 w-full bg-gradient-to-b from-[#242525] via-[#1a1a1a] to-[#0f0f0f] text-white py-12 px-6 border-t border-gray-800">
                    <div class="max-w-7xl mx-auto">
                            <!-- Main Footer Content -->
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <!-- Company Info -->
                                    <div class="space-y-6">
                                            <a href="./index.html" class="group flex items-center">
                                                    <img src="assets/logo (5).png" alt="Logo" class="h-12 mr-3" />
                                                   
                                            </a>
                                            <p class="text-gray-400 text-sm">Empowering students with quality education and comprehensive study materials.</p>
                                            <div class="space-y-2">
                                                    <p class="text-gray-400 text-sm">📞 +233 243 44 39 34</p>
                                                    <p class="text-gray-400 text-sm">📧 Profstraining52@gmail.com</p>
                                                    <p class="text-gray-400 text-sm">📍 Accra, Ghana</p>
                                            </div>
                                    </div>

                                    <!-- Quick Links -->
                                    <div>
                                            <h3 class="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                                            <ul class="space-y-2">
                                                    <li><a href="blog.html" class="text-gray-400 hover:text-white text-sm">Blog posts</a></li>
                                                    <li><a href="courses.html" class="text-gray-400 hover:text-white text-sm">Courses</a></li>
                                                    <li><a href="store.html" class="text-gray-400 hover:text-white text-sm">Shop</a></li>
                                                    <li><a href="gallery.html" class="text-gray-400 hover:text-white text-sm">Gallery</a></li>
                                            </ul>
                                    </div>

                                    <!-- Support -->
                                    <div>
                                            <h3 class="text-lg font-semibold mb-4 text-white">Support</h3>
                                            <ul class="space-y-2">
                                                    <li><a href="support.html" class="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
                                                    <li><a href="aboutus.html" class="text-gray-400 hover:text-white text-sm">About Us</a></li>
                                                    <li><a href="terms_conditions.html" class="text-gray-400 hover:text-white text-sm">FAQs</a></li>
                                            </ul>
                                    </div>

                                    <!-- Mobile Apps -->
                                    <div>
                                            <h3 class="text-lg font-semibold mb-4 text-white">Mobile Apps</h3>
                                            <div class="space-y-3">
                                                    <a href="https://play.google.com/store/apps/details?id=profstudymate.appev" class="block">
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-10" />
                                                    </a>
                                                    <a href="#" class="block">
                                                            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" class="h-10" />
                                                    </a>
                                            </div>
                                    </div>
                            </div>

                            <!-- Social Media Links -->
                            <div class="flex justify-center space-x-6 mt-8 border-t border-gray-800 pt-8">
                                    <a href="http://instagram.com/profs_training_solutions/" target="_blank" class="text-gray-400 hover:text-pink-500">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" class="w-5 h-5" alt="Instagram" />
                                    </a>
                                    <a href="http://tiktok.com/@profstraining" target="_blank" class="text-gray-400 hover:text-gray-100">
                                            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046120.png" class="w-5 h-5" alt="TikTok" />
                                    </a>
                                    <a href="http://youtube.com/@ProfsTrainingSolutions" target="_blank" class="text-gray-400 hover:text-red-600">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" class="w-5 h-5" alt="YouTube" />
                                    </a>
                                    <a href="https://linkedin.com/in/profs-training-solutions/" target="_blank" class="text-gray-400 hover:text-blue-500">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384062.png" class="w-5 h-5" alt="LinkedIn" />
                                    </a>
                                    <a href="http://facebook.com/ProfsTraining" target="_blank" class="text-gray-400 hover:text-blue-600">
                                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png" class="w-5 h-5" alt="Facebook" />
                                    </a>
                            </div>

                            <!-- Copyright -->
                            <div class="text-center text-gray-400 text-sm mt-8">
                                    <p>&copy; 2025 ProfstudyHub. All rights reserved.</p>
                            </div>
                    </div>
            </footer>
    `;
  document.getElementById("footer-container").innerHTML = footer;
});
