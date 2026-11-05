// Appen består av flere filer som må passe sammen (index.html importerer logic.js og data.js).
// Derfor hentes alle filene samlet når en ny versjon av sw.js oppdages (install), og de serveres
// fra cache (cache først). Da kan ikke en ny index.html møte en gammel logic.js. Nettleseren sjekker
// sw.js mot nettet ved hver åpning, så en ny versjon tas i bruk neste gang appen åpnes med nett.
const CACHE = 'garasjegym-v12';
const FILES = ['./', './index.html', './logic.js', './data.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // cache: 'reload' går utenom nettleserens HTTP-cache, så vi ikke henter en gammel kopi
    await Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    // Si fra til åpne sider at en ny versjon er klar (siden avgjør selv om den vil laste på nytt)
    for (const cl of await self.clients.matchAll({ type: 'window' })) cl.postMessage({ type: 'updated', version: CACHE });
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(e.request, { ignoreSearch: true });
    if (cached) return cached;
    try { return await fetch(e.request); }
    catch { return (await caches.match('./index.html')) || Response.error(); }
  })());
});
