const staticPaths = new Set(["/about.webp","/airtel.webp","/bun.webp","/clickpesa.webp","/desktop.webp","/drizzle.webp","/elysia.webp","/favicon.ico","/google.svg","/hero-big.webp","/hero.webp","/login-image.webp","/man.webp","/manifest.js","/manifest.json","/manifest.webmanifest","/mfumo.webp","/mobile.webp","/newLogo.webp","/q-manifest.json","/qwik-prefetch-service-worker.js","/qwik.webp","/register-image.webp","/registerSW.js","/robots.txt","/service-worker.js","/sitemap.xml","/thumbnail.webp","/thumbnail2.webp","/vercel.webp","/vite.svg","/whatsApp.svg","/woman.webp","/workbox-5ffe50d4.js","/yas.webp"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };