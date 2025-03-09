document.addEventListener("DOMContentLoaded", function () {
    const footer = `
        <footer class="hidden md:block  bottom-0 left-0 right-0 w-full bg-[#172554] text-white py-4 px-4">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <!-- Brand Info -->
                <div>
                    <h2 class="text-2xl font-bold">ProfstudyHub</h2>
                    <p class="mt-2 text-gray-400">Your Pass Mark is Guaranteed with Us.</p>
                    <p class="mt-2 text-gray-400">📞 +233 243 44 39 34</p>
                    <p class="mt-2 text-gray-400">📧 Profstraining52@gmail.com</p>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-semibold">Quick Links</h3>
                    <ul class="mt-2 space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white">Blog posts</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Courses</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Shop</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Gallery</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Free Videos</a></li>
                    </ul>
                </div>

                <!-- More Links -->
                <div>
                    <h3 class="text-lg font-semibold">Support</h3>
                    <ul class="mt-2 space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white">Contact Us</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">FAQs</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Terms</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Create Article</a></li>
                    </ul>
                </div>
            </div>

            <!-- Copyright -->
            <div class="mt-4 text-center text-gray-500 text-sm border-t border-gray-700 pt-2">
                &copy; 2025 ProfstudyHub. All rights reserved.
            </div>
        </footer>
    `;

    document.getElementById("footer-container").innerHTML = footer;
});
