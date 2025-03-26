// const CACHE_NAME = "education-app-cache-v1";
// const urlsToCache = [

 
// ];

// // Install event - Cache necessary assets
// self.addEventListener("install", (event) => {
//   self.skipWaiting(); // Force activation immediately
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// // Fetch event - Serve cached content when offline
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         return caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, response.clone());
//           return response;
//         });
//       })
//       .catch(() => caches.match(event.request))
//   );
// });



// // Activate event - Cleanup old caches
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
//       );
//     })
//   );
//   self.clients.claim(); // Take control of open pages
// });

