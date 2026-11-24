/* global self, caches, fetch, URL, location */
/* AJEENTY service worker: lets the site install as an app on phones and keeps it usable on a weak signal.
   Pages (HTML) always try the network first, so new prices show as soon as they're published;
   the cached copy is only used when there's no connection. Versioned assets, fonts and images are
   served from the cache and refreshed in the background. Orders (Google Apps Script) and anything
   on another site are never touched. Bump VERSION when this file changes. */
const VERSION = 'ajeenty-20261124-menuapp';
const CORE = ['./', 'index.html', 'menu/', 'menu/index.html', '404.html', 'site.webmanifest', 'favicon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; };

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // orders, WhatsApp, maps: straight to the network
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(fetch(req).then(r => put(req, r)).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(r => r || caches.match(url.pathname.startsWith('/menu') ? 'menu/index.html' : 'index.html'))));
    return;
  }
  if (/\.(mp4|webm)$/.test(url.pathname) || req.headers.has('range')) return;   // let video stream normally
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => put(req, r)).catch(() => hit);
    return hit || net;
  }));
});
