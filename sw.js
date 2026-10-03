/* Party Sheets service worker: keeps the app and rules data on the phone so it opens without a connection.
   Change VERSION whenever you upload new files so phones pick them up. */
const VERSION = "party-2026-10-02-f";
const SHELL = ["./", "index.html", "tome.css", "tome.html", "tome.js", "spells-2024.json", "monsters-2024.json",
  "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
const FB = "https://www.gstatic.com/firebasejs/10.14.1/";
const FIREBASE = [FB + "firebase-app.js", FB + "firebase-auth.js", FB + "firebase-firestore.js"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})));
    await Promise.all(FIREBASE.map(u => fetch(u, { mode: "cors" }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const bigData = u => /spells-2024\.json$|monsters-2024\.json$/.test(u.pathname);

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  /* the database and sign-in traffic is handled by the Firebase SDK itself */
  if (/(firestore|identitytoolkit|securetoken|firebaseinstallations)\.googleapis\.com$|\.firebaseio\.com$/.test(url.hostname)) return;
  /* Firebase library files never change for a given version: cache first */
  if (url.hostname === "www.gstatic.com" && url.pathname.indexOf("/firebasejs/") === 0) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return r;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  /* big rules files: show the saved copy straight away, refresh it in the background */
  if (bigData(url)) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response("[]", { status: 503, headers: { "content-type": "application/json" } });
    }));
    return;
  }
  /* the app itself: newest copy when online, saved copy when not */
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    try {
      const r = await fetch(req, { cache: "no-cache" });
      if (r.ok) c.put(req, r.clone());
      return r;
    } catch (err) {
      const hit = (await c.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? (await c.match("index.html")) || (await c.match("./")) : null);
      if (hit) return hit;
      return new Response("You are offline and this file was not saved yet. Open the app once while online.", { status: 503, headers: { "content-type": "text/plain" } });
    }
  })());
});
