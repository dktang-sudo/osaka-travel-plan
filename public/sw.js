const CACHE_NAME = 'osaka-travel-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/images/vocab/ticket.svg',
  '/images/vocab/ferry.svg',
  '/images/vocab/whale.svg',
  '/images/vocab/icecream.svg',
  '/images/vocab/beetle.svg',
  '/images/vocab/nintendo.svg',
  '/images/vocab/butterbeer.svg',
  '/images/vocab/takoyaki.svg',
  '/images/vocab/kushikatsu.svg',
  '/images/vocab/glico.svg',
  '/images/vocab/taxfree.svg',
  '/images/vocab/ramen.svg',
  '/images/vocab/beer.svg',
  '/images/vocab/rapit.svg',
  '/images/vocab/okonomiyaki.svg',
  '/images/vocab/curry.svg',
  '/images/vocab/ferriswheel.svg',
  '/images/vocab/sushi.svg',
  '/images/vocab/audio_guide.svg',
  '/images/vocab/castle_ticket.svg',
  '/images/vocab/express_pass.svg',
  '/images/vocab/scallop.svg',
  '/images/vocab/slider.svg',
  '/images/vocab/royce.svg',
  '/images/vocab/pokemon.svg',
  '/images/vocab/capcom.svg',
  '/images/vocab/donkeykong.svg',
];

// 설치 시 정적 에셋 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 인터셉트: Cache First + Network Fallback & Runtime Caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 구글 맵 iframe 외부 요청은 네트워크로 패스
  if (url.origin.includes('google.com') || url.origin.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 백그라운드에서 최신 버전 fetch하여 캐시 갱신
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // 오프라인 상태에서 페이지 요청 시 index.html 반환
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html') || caches.match('/');
          }
        });
    })
  );
});
