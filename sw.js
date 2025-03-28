// const CACHE_NAME = "referral-dashboard-cache-v1";
// const urlsToCache = [
//   "/",
//   "navbar.js",
//   "bottomnv.js",
//   "kaka.js",
//   "dynamiccon.js",

// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => response || fetch(event.request))
//   );
// });


