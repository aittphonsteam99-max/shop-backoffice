// ให้แอปเปิดได้แม้ไม่มีเน็ต: ดึงไฟล์ใหม่จากเน็ตก่อน ถ้าไม่ได้ใช้ของที่เก็บไว้
// (ไม่ยุ่งกับการเรียก api.github.com — การซิงค์ข้อมูลยังไปตรงเสมอ)
const CACHE = 'backoffice-v1';
const CORE = ['./', './ระบบหลังร้าน.html', './manifest.webmanifest', './icon.svg', './icon-192.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./ระบบหลังร้าน.html')))
  );
});
