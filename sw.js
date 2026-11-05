// Nettverk først (så oppdateringer kommer med en gang), men med kort frist: svarer ikke nettet innen
// NET_MS brukes cachen, så appen ikke henger i en garasje med dårlig dekning. Nettet fortsetter i
// bakgrunnen og oppdaterer cachen til neste gang.
const CACHE = 'garasjegym-v10';
const NET_MS = 2500;
const FILES = ['./', './index.html', './logic.js', './data.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    // Bare vellykkede svar legges i cache, så en 404/500 ikke overskriver en god kopi
    const net = fetch(e.request).then(res => {
      if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => null);
    const first = await Promise.race([net, new Promise(r => setTimeout(() => r(null), NET_MS))]);
    if (first) return first;
    if (cached) return cached;
    return (await net) || caches.match('./index.html');
  })());
});
